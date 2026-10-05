// POST { storyId, page }. Draws one page, replies 202 and works in the background.
// Called by generate-story with the service key (first attempt), or by the owner to retry a
// failed page while the book is 'incomplete' (no extra credits, MAX_ATTEMPTS per page).
import { ApiError } from '../_shared/ApiError.ts';
import { illustratePage } from '../_shared/storyPipeline.ts';
import {
  admin, background, body, downloadDataUrl, isInternal, json, MAX_ATTEMPTS, refundIfFailed, requireUser, serve, uploadDataUrl,
} from '../_shared/server.ts';

serve(async req => {
  const { storyId, page } = await body<{ storyId?: string; page?: number }>(req);
  const { data: row } = await admin.from('story_pages').select('*, stories!inner(user_id, status, character_context, story_style)')
    .eq('story_id', storyId).eq('page', page).maybeSingle();
  if (!row) throw new ApiError(404, 'Page not found.');

  if (isInternal(req)) {
    const { data } = await admin.from('story_pages').update({ attempts: 1 })
      .eq('story_id', storyId).eq('page', page).eq('status', 'pending').eq('attempts', 0).select('attempts');
    if (!data?.length) return json(200, { skipped: true });
  } else {
    const user = await requireUser(req);
    if (row.stories.user_id !== user.id) throw new ApiError(404, 'Page not found.');
    if (row.stories.status !== 'incomplete' || row.status !== 'failed') throw new ApiError(409, 'This page is not waiting for a retry.');
    if (row.attempts >= MAX_ATTEMPTS) throw new ApiError(409, 'This page has used all its retries.');
    // Back to pending flips the book to 'generating', which the one-at-a-time index may refuse.
    const { data, error } = await admin.from('story_pages').update({ status: 'pending', attempts: row.attempts + 1 })
      .eq('story_id', storyId).eq('page', page).eq('status', 'failed').eq('attempts', row.attempts).select('attempts');
    if (error?.code === '23505') throw new ApiError(409, 'You already have a story being created. Please wait for it to finish.');
    if (error) throw error;
    if (!data.length) throw new ApiError(409, 'This page is already being retried.');
  }

  background(draw(row.stories.user_id, row.stories.character_context, row.stories.story_style, row));
  return json(202, { storyId, page });
});

async function draw(userId: string, characterContext: string, storyStyle: string, row: any) {
  try {
    // Photos first, then character sheets: the order the prompt's reference labels describe.
    const { data: photos } = await admin.from('story_photos').select('*').eq('story_id', row.story_id)
      .order('kind', { ascending: true }).order('position');
    const references = await Promise.all((photos || []).map(async photo => ({
      image: await downloadDataUrl(photo.path), characterName: photo.character_name, description: photo.description, kind: photo.kind,
    })));
    const imageUrl = await illustratePage(references, characterContext, { page: row.page, text: row.text, imagePrompt: row.image_prompt }, storyStyle);
    const path = `${userId}/${row.story_id}/pages/${row.page}.webp`;
    await uploadDataUrl(path, imageUrl);
    const { error } = await admin.from('story_pages').update({ status: 'done', image_path: path }).eq('story_id', row.story_id).eq('page', row.page);
    if (error) throw error;
  } catch (error) {
    console.error(`Page ${row.page} of ${row.story_id} failed:`, error);
    await admin.from('story_pages').update({ status: 'failed' }).eq('story_id', row.story_id).eq('page', row.page);
    await refundIfFailed(row.story_id);
  }
}
