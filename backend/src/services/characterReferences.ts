import { ApiError } from '../utils/ApiError';

export interface CharacterReference {
  image: string;
  characterName: string;
  description: string;
}

export function imagePart(image: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match || match[2].length % 4 !== 0) {
    throw new ApiError(400, 'Reference photos must be uploaded JPG, PNG or WEBP images. Please upload the photo again.');
  }
  return { inlineData: { mimeType: match[1], data: match[2] } };
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
    bytes += Buffer.from(part.inlineData.data, 'base64').length;
    // The upload UI asks for photos of the main character only, so unnamed photos share one identity.
    const name = typeof item.characterName === 'string' && item.characterName.trim()
      ? item.characterName.trim().replace(/\s+/g, ' ')
      : 'Main Character';
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

export function referenceParts(references: CharacterReference[]) {
  return references.flatMap((reference, index) => [
    { text: `Reference photo ${index + 1}: character ${JSON.stringify(reference.characterName)}. Multiple photos with this name show the SAME character.` },
    imagePart(reference.image),
  ]);
}
