// POST { storyId }. Anyone with a book's link can read it once it's finished, signed in or not
// (verify_jwt is off in config.toml). Only what a reader sees leaves the server: never the
// questionnaire, photos or prompts, and only the creator's first name.
import { ApiError } from '../_shared/ApiError.ts';
import { admin, body, json, serve } from '../_shared/server.ts';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LINK_HOURS = 24;

serve(async req => {
  const { storyId } = await body<{ storyId?: string }>(req);
  if (typeof storyId !== 'string' || !UUID.test(storyId)) throw new ApiError(404, 'This story is not available.');
  const { data: story, error } = await admin.from('stories').select('user_id, title, subtitle')
    .eq('id', storyId).eq('status', 'completed').maybeSingle();
  if (error) throw error;
  if (!story) throw new ApiError(404, 'This story is not available.');

  const [{ data: rows, error: pagesError }, { data: owner }] = await Promise.all([
    admin.from('story_pages').select('page, text, image_path').eq('story_id', storyId).order('page'),
    admin.auth.admin.getUserById(story.user_id),
  ]);
  if (pagesError) throw pagesError;
  const paths = rows.flatMap(row => row.image_path ? [row.image_path] : []);
  const { data: signed, error: signError } = paths.length
    ? await admin.storage.from('stories').createSignedUrls(paths, LINK_HOURS * 3600)
    : { data: [], error: null };
  if (signError) throw signError;
  const urls = new Map(signed.map(s => [s.path, s.signedUrl]));

  // Same name the app shows (authService): the profile name, else the Google account name.
  const meta = owner?.user?.user_metadata || {};
  const creator = String(meta.display_name || meta.full_name || meta.name || '').trim().split(/\s+/)[0] || null;

  return json(200, {
    title: story.title || '',
    subtitle: story.subtitle || '',
    creator,
    pages: rows.map(row => ({ page: row.page, text: row.text, imageUrl: urls.get(row.image_path) || '' })),
  });
});
