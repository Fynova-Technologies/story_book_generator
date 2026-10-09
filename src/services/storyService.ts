import { FunctionsHttpError } from '@supabase/supabase-js';
import { BUCKET, supabase } from '../lib/supabase';
import type { StoryImage, StoryWizardState } from '../store/slices/storyWizardSlice';

export type StoryStatus = 'draft' | 'generating' | 'incomplete' | 'completed' | 'failed';

export interface StoryRow {
  id:           string;
  status:       StoryStatus;
  template:     string;
  questionnaire: Record<string, string>;
  custom_story: string;
  art_style:    string;
  story_style:  string;
  narration:    string;
  story_length: number | null;
  wizard_step:  number;
  title:        string | null;
  subtitle:     string | null;
  error:        string | null;
  updated_at:   string;
}

export interface BookPage {
  page:     number;
  text:     string;
  status:   'pending' | 'done' | 'failed';
  attempts: number;
  imageUrl: string;
}

// Without an error, Supabase always returns data.
const check = <T>({ data, error }: { data: T; error: unknown }) => {
  if (error) throw error;
  return data as NonNullable<T>;
};

const signedUrls = async (paths: string[]) => {
  if (!paths.length) return new Map<string, string>();
  const data = check(await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60));
  return new Map(data.map(item => [item.path!, item.signedUrl]));
};

// ── Drafts ──
// Photo roles ride in the questionnaire as one answer: the story writer reads every answer, and
// drafts keep them without a database column. "Eren: Birthday star; Mikasa: Friend".
export const ROLES_KEY = "Who's who in the photos";

const withRoles = (answers: Record<string, string>, images: StoryImage[]) => {
  const roles = new Map<string, string>();
  for (const photo of images) {
    const name = photo.characterName.trim();
    if (photo.image && name && photo.role && !roles.has(name)) roles.set(name, photo.role);
  }
  const rest = { ...answers };
  delete rest[ROLES_KEY];
  return roles.size ? { ...rest, [ROLES_KEY]: [...roles].map(([name, role]) => `${name}: ${role}`).join('; ') } : rest;
};

const roleOf = (roles: string | undefined, name: string) =>
  roles?.split('; ').find(entry => entry.startsWith(`${name}: `))?.slice(name.length + 2);

// Saves the wizard to its draft row (creating it on first save) and uploads new photos.
// Returns the draft id and the photos with their storage paths filled in.
export async function saveDraft(userId: string, wizard: StoryWizardState, step: number, storyLength?: number) {
  const fields = {
    template:      wizard.template,
    questionnaire: withRoles(wizard.questionnaire, wizard.images),
    custom_story:  wizard.story,
    story_style:   wizard.storyStyle,
    narration:     wizard.narration,
    wizard_step:   step,
    ...(storyLength !== undefined && { story_length: storyLength }),
  };
  const id = wizard.currentDraftId
    ? (check(await supabase.from('stories').update(fields).eq('id', wizard.currentDraftId)), wizard.currentDraftId)
    : check(await supabase.from('stories').insert(fields).select('id').single()).id as string;

  const images = await Promise.all(wizard.images.map(async photo => {
    if (!photo.image || photo.path) return photo;
    // Already compressed when picked (compressPhoto): WebP, or JPEG where the browser can't encode WebP.
    const blob = await (await fetch(photo.image)).blob();
    const path = `${userId}/${id}/photos/${crypto.randomUUID()}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`;
    check(await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type }));
    return { ...photo, path };
  }));

  // ponytail: replaced photos stay in Storage; delete orphans if storage gets tight.
  check(await supabase.from('story_photos').delete().eq('story_id', id).eq('kind', 'photo'));
  const rows = images.flatMap((photo, position) => photo.path ? [{
    story_id: id, path: photo.path, position, character_name: photo.characterName.trim(), description: photo.description,
  }] : []);
  if (rows.length) check(await supabase.from('story_photos').insert(rows));
  return { id, images };
}

export async function loadDraft(id: string) {
  const story = check(await supabase.from('stories').select('*').eq('id', id).single()) as StoryRow;
  const photos = check(await supabase.from('story_photos').select('*').eq('story_id', id).eq('kind', 'photo').order('position'));
  const urls = await signedUrls(photos.map((photo: any) => photo.path));
  // Sizes for the 10 MB total. Every photo shares one folder; replaced photos stay there too, hence the high limit.
  const folder = photos[0]?.path.slice(0, photos[0].path.lastIndexOf('/'));
  const files = folder ? check(await supabase.storage.from(BUCKET).list(folder, { limit: 1000 })) : [];
  const sizes = new Map(files.map(file => [`${folder}/${file.name}`, file.metadata?.size as number | undefined]));
  const images: StoryImage[] = photos.map((photo: any) => ({
    image: urls.get(photo.path) || null, path: photo.path, size: sizes.get(photo.path),
    characterName: photo.character_name, description: photo.description,
    role: roleOf(story.questionnaire?.[ROLES_KEY], photo.character_name),
  }));
  return { story, images };
}

export const listStories = async (statuses: StoryStatus[]) =>
  check(await supabase.from('stories').select('*').in('status', statuses).order('updated_at', { ascending: false })) as StoryRow[];

export const deleteStory = async (id: string) => check(await supabase.from('stories').delete().eq('id', id));

// First page image of each book, for cards.
export async function coverUrls(storyIds: string[]) {
  if (!storyIds.length) return new Map<string, string>();
  const pages = check(await supabase.from('story_pages').select('story_id, image_path').in('story_id', storyIds).eq('page', 1));
  const urls = await signedUrls(pages.flatMap((page: any) => page.image_path ? [page.image_path] : []));
  return new Map<string, string>(pages.map((page: any) => [page.story_id, urls.get(page.image_path) || '']));
}

// ── Generation (Edge Functions) ──
// Functions reply with { error } holding a message written for the user. Only these messages
// are shown as-is; anything else (database, storage) gets a generic message in the UI.
export class UserFacingError extends Error {}

async function call(name: string, body: Record<string, unknown>) {
  const { error } = await supabase.functions.invoke(name, { body });
  if (!error) return;
  const message = error instanceof FunctionsHttpError
    ? (await error.context.json().catch(() => null))?.error
    : null;
  throw new UserFacingError(message || 'Could not reach the server. Please check your connection and try again.');
}

export const generateStory = (storyId: string) => call('generate-story', { storyId });

export interface PrefillAnswer { id: number; answer: string | null; suggestions: string[] }
// Answers what the character notes cover and suggests answers for the rest. Callers fall back to
// asking every question if this fails, so it never blocks the wizard.
export async function prefillQuestionnaire(body: {
  template: string;
  questions: { id: number; question: string; type: string }[];
  characters: { name: string; description: string }[];
}) {
  const { data, error } = await supabase.functions.invoke('prefill-questionnaire', { body });
  if (error) throw error;
  return data.answers as PrefillAnswer[];
}
export const retryPage = (storyId: string, page: number) => call('generate-page', { storyId, page });

export async function loadBook(id: string) {
  const story = check(await supabase.from('stories').select('*').eq('id', id).single()) as StoryRow;
  const rows = check(await supabase.from('story_pages').select('*').eq('story_id', id).order('page'));
  const urls = await signedUrls(rows.flatMap((row: any) => row.image_path ? [row.image_path] : []));
  const pages: BookPage[] = rows.map((row: any) => ({
    page: row.page, text: row.text, status: row.status, attempts: row.attempts, imageUrl: urls.get(row.image_path) || '',
  }));
  return { story, pages };
}

// A finished book as anyone with its link sees it (no login): title, pages and the creator's first name.
export interface SharedBook { title: string; subtitle: string; creator: string | null; pages: { page: number; text: string; imageUrl: string }[] }
export async function loadSharedBook(id: string): Promise<SharedBook> {
  const { data, error } = await supabase.functions.invoke('shared-book', { body: { storyId: id } });
  if (error) throw error;
  return data;
}

// Calls onChange whenever the story or one of its pages changes (Realtime).
export function watchBook(id: string, onChange: () => void) {
  const channel = supabase.channel(`book-${id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stories', filter: `id=eq.${id}` }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'story_pages', filter: `story_id=eq.${id}` }, onChange)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export const formatLastSaved = (isoString: string): string => {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

// Search (case-insensitive, on title and template) and sort for the collection page.
export type StorySort = 'newest' | 'oldest' | 'title';

export const searchAndSort = (rows: StoryRow[], query: string, sort: StorySort, titleOf: (row: StoryRow) => string) => {
  const q = query.trim().toLowerCase();
  const found = rows.filter(row => !q || `${titleOf(row)} ${row.template}`.toLowerCase().includes(q));
  if (sort === 'title') return found.sort((a, b) => titleOf(a).localeCompare(titleOf(b)));
  // listStories already returns newest first.
  return sort === 'oldest' ? found.reverse() : found;
};
