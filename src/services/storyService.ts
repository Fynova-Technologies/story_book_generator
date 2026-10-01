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

// ── Photos: resized in the browser, then uploaded straight to Storage ──
// Image input tokens grow with pixel area and every photo is sent with every page.
const MAX_SIDE = 1024;

async function resizeToJpeg(dataUrl: string): Promise<Blob> {
  const image = await createImageBitmap(await (await fetch(dataUrl)).blob());
  const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not read the photo.')), 'image/jpeg', 0.9));
}

const signedUrls = async (paths: string[]) => {
  if (!paths.length) return new Map<string, string>();
  const data = check(await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60));
  return new Map(data.map(item => [item.path!, item.signedUrl]));
};

// ── Drafts ──
// Saves the wizard to its draft row (creating it on first save) and uploads new photos.
// Returns the draft id and the photos with their storage paths filled in.
export async function saveDraft(userId: string, wizard: StoryWizardState, step: number, storyLength?: number) {
  const fields = {
    template:      wizard.template,
    questionnaire: wizard.questionnaire,
    custom_story:  wizard.story,
    art_style:     wizard.artStyle,
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
    const path = `${userId}/${id}/photos/${crypto.randomUUID()}.jpg`;
    check(await supabase.storage.from(BUCKET).upload(path, await resizeToJpeg(photo.image), { contentType: 'image/jpeg' }));
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
  const images: StoryImage[] = photos.map((photo: any) => ({
    image: urls.get(photo.path) || null, path: photo.path, characterName: photo.character_name, description: photo.description,
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
