import { Buffer } from 'node:buffer';
import { ApiError } from './ApiError.ts';
import type { ContentPart } from './openai.ts';

export interface CharacterReference {
  image: string;
  characterName: string;
  description: string;
  // 'sheet' = a stylized portrait generated from the photos, shared by every page.
  kind?: 'photo' | 'sheet';
}

export function imagePart(image: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match || match[2].length % 4 !== 0) {
    throw new ApiError(400, 'Reference photos must be uploaded JPG, PNG or WEBP images. Please upload the photo again.');
  }
  return { mimeType: match[1], data: match[2] };
}

export function normalizeReferences(value: unknown): CharacterReference[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 5) {
    throw new ApiError(400, 'Provide at most 5 reference photos.');
  }
  const names = new Map<string, string>();
  let bytes = 0;
  const references: CharacterReference[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') throw new ApiError(400, 'Invalid reference photo.');
    if (item.image === null || item.image === '') continue;
    if (typeof item.image !== 'string') throw new ApiError(400, 'Invalid reference photo.');
    const part = imagePart(item.image);
    bytes += Buffer.from(part.data, 'base64').length;
    // Never guess who is in a photo: merging unnamed photos blends different people into one face.
    if (typeof item.characterName !== 'string' || !item.characterName.trim()) {
      throw new ApiError(400, 'Tell us who is in each photo before generating.');
    }
    const name = item.characterName.trim().replace(/\s+/g, ' ');
    if (name.length > 80) throw new ApiError(400, 'Character names must be at most 80 characters.');
    if (item.description !== undefined && (typeof item.description !== 'string' || item.description.length > 100)) {
      throw new ApiError(400, 'Photo notes must be text, up to 100 characters.');
    }
    const key = name.toLowerCase();
    if (!names.has(key)) names.set(key, name);
    references.push({ image: item.image, characterName: names.get(key)!, description: item.description || '' });
  }
  if (bytes > 10 * 1024 * 1024) throw new ApiError(400, 'Reference photos must total at most 10 MB.');
  return references;
}

const referenceLabel = (reference: CharacterReference, index: number) => reference.kind === 'sheet'
  ? `Reference image ${index + 1}: approved character sheet for ${JSON.stringify(reference.characterName)} in the book's art style. Draw them exactly like this on every page; their photos remain the source of truth for the face. Take only the character from it, never its background.`
  : `Reference photo ${index + 1}: character ${JSON.stringify(reference.characterName)}. Multiple photos with this name show the SAME character. Use it for identity only, never its photographic look.`;

// Labels interleaved with the photos, for vision chat models.
export function referenceParts(references: CharacterReference[]): ContentPart[] {
  return references.flatMap((reference, index) => [
    { type: 'input_text' as const, text: referenceLabel(reference, index) },
    { type: 'input_image' as const, image_url: reference.image },
  ]);
}

// Image edits take photos as a separate list, so the labels go in the prompt, in upload order.
export const referenceLabels = (references: CharacterReference[]) =>
  references.map(referenceLabel).join('\n');
