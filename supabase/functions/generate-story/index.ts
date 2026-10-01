// POST { storyId } with the user's JWT. Spends the book's credits, replies 202, then writes the
// story text and character sheets and hands each page to generate-page.
import { ApiError } from '../_shared/ApiError.ts';
import { normalizeReferences } from '../_shared/characterReferences.ts';
import { planStory } from '../_shared/storyPipeline.ts';
import {
  admin, adjustCredits, background, body, downloadDataUrl, invoke, json, publicMessage,
  refundIfFailed, requireUser, serve, STORY_COST, uploadDataUrl,
} from '../_shared/server.ts';

// A run can't legitimately stay 'generating' this long (two invocations of at most 150s each),
// so the function running it was killed. ponytail: swept only when the user starts another book;
// a pg_cron job if stuck books should clear on their own.
const STALE_MINUTES = 10;

serve(async req => {
  const user = await requireUser(req);
  const { storyId } = await body<{ storyId?: string }>(req);
  await failStaleRuns(user.id);

  const { data: story } = await admin.from('stories').select('*').eq('id', storyId).eq('user_id', user.id).maybeSingle();
  if (!story) throw new ApiError(404, 'Story not found.');
  if (story.status !== 'draft' && story.status !== 'failed') throw new ApiError(409, 'This story has already been generated.');
  if (!story.custom_story.trim() && !story.template) throw new ApiError(400, 'Pick a template or write your story first.');

  const { data: photos } = await admin.from('story_photos').select('*').eq('story_id', story.id).eq('kind', 'photo').order('position');
  if (!photos?.length) throw new ApiError(400, 'Add at least one photo first.');
  if (photos.length > 5) throw new ApiError(400, 'Provide at most 5 reference photos.');

  // Claim the story before spending, so two clicks can't both spend.
  const generation = story.generation + 1;
  const { data: claimed, error } = await admin.from('stories')
    .update({ status: 'generating', generation, error: null })
    .eq('id', story.id).eq('status', story.status).eq('generation', story.generation)
    .select('id');
  if (error?.code === '23505') throw new ApiError(409, 'You already have a story being created. Please wait for it to finish.');
  if (error) throw error;
  if (!claimed.length) throw new ApiError(409, 'This story is already being created.');

  const release = () => admin.from('stories').update({ status: story.status }).eq('id', story.id);
  try {
    if (await adjustCredits(user.id, -STORY_COST, `spend-${story.id}-${generation}`) === 'insufficient') {
      await release();
      throw new ApiError(402, `You need ${STORY_COST} credits to create a story.`);
    }
  } catch (error) {
    if (!(error instanceof ApiError)) await release();
    throw error;
  }

  background(run(user.id, story, photos));
  return json(202, { storyId: story.id });
});

async function run(userId: string, story: any, photos: any[]) {
  try {
    // A failed earlier run may have left pages and sheets behind.
    await admin.from('story_pages').delete().eq('story_id', story.id);
    await admin.from('story_photos').delete().eq('story_id', story.id).eq('kind', 'sheet');

    const references = normalizeReferences(await Promise.all(photos.map(async photo => ({
      image: await downloadDataUrl(photo.path), characterName: photo.character_name, description: photo.description,
    }))));
    const plan = await planStory({
      template:      story.template,
      questionnaire: story.questionnaire,
      artStyle:      story.art_style,
      narration:     story.narration,
      storytext:     story.custom_story,
      storyStyle:    story.story_style || 'storybook',
      storyLength:   story.story_length,
    }, references);

    await Promise.all(plan.sheets.map((sheet, i) => uploadDataUrl(`${userId}/${story.id}/sheets/${i}.webp`, sheet.image)));
    await check(admin.from('story_photos').insert(plan.sheets.map((sheet, i) => ({
      story_id: story.id, kind: 'sheet', character_name: sheet.characterName, path: `${userId}/${story.id}/sheets/${i}.webp`, position: i,
    }))));
    await check(admin.from('stories').update({ title: plan.title, subtitle: plan.subtitle, character_context: plan.characterContext }).eq('id', story.id));
    await check(admin.from('story_pages').insert(plan.pages.map(page => ({
      story_id: story.id, page: page.page, text: page.text, image_prompt: page.imagePrompt,
    }))));

    // If a page can't even be handed off, mark it failed so the user can retry it.
    await Promise.all(plan.pages.map(page => invoke('generate-page', { storyId: story.id, page: page.page }).catch(async error => {
      console.error(error);
      await admin.from('story_pages').update({ status: 'failed', attempts: 1 }).eq('story_id', story.id).eq('page', page.page).eq('status', 'pending');
    })));
  } catch (error) {
    await admin.from('stories').update({ status: 'failed', error: publicMessage(error) }).eq('id', story.id);
    await refundIfFailed(story.id);
  }
}

const check = async (query: PromiseLike<{ error: unknown }>) => {
  const { error } = await query;
  if (error) throw error;
};

async function failStaleRuns(userId: string) {
  const cutoff = new Date(Date.now() - STALE_MINUTES * 60_000).toISOString();
  const { data: stale } = await admin.from('stories').select('id').eq('user_id', userId).eq('status', 'generating').lt('updated_at', cutoff);
  for (const { id } of stale || []) {
    // Pages that never finished become retryable; a run that died before any pages fails outright.
    await admin.from('story_pages').update({ status: 'failed' }).eq('story_id', id).eq('status', 'pending');
    await admin.from('stories').update({ status: 'failed', error: 'Creating this story took too long.' })
      .eq('id', id).eq('status', 'generating');
    await refundIfFailed(id);
  }
}
