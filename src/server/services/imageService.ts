import { editImage } from './openai';
import { CharacterReference, imagePart, referenceLabels } from './characterReferences';
import { trace } from './trace';

// Keep one model for the whole book, including retries, to avoid style drift.
const model = 'gpt-image-2.5-flare';

export async function transformImage(
  references: CharacterReference[],
  characterContext: string,
  prompt: string,
  page?: number,
) {
  const fullPrompt = `${referenceLabels(references)}

Create the requested story illustration.

CHARACTER IDENTITY:
${characterContext}

Reference photos establish identity, not scene membership. Render ONLY characters
present in the scene/panel. The same character may recur in different panels.
Never duplicate a character within a panel unless the scene explicitly requires it.
Preserve face, hair, skin/fur, proportions, and distinguishing features across pages,
adapting them to the requested art style. Do not blend identities or give background
people a reference character's face. Use the canonical outfit below; if reference
photos disagree on clothing, the first photo of that character defines the outfit.
Treat the character definitions as fixed; vary pose, expression and camera angle.

SCENE:
${prompt}`;
  return generate(fullPrompt, references, 'image.attempt', { page });
}

// One stylized portrait per character, generated once and passed to every page so each page
// doesn't reinterpret the photo in the art style on its own.
// Style words about scenery are dropped: a sheet's background leaks into every page.
// The rest of the style text stays, because a sheet rendered like the pages keeps likeness best.
const SCENERY = /\b(backgrounds?|environments?|environmental|landscapes?|scenes?|scenery|composition)\b/i;
export async function createCharacterSheet(name: string, photos: CharacterReference[], style: { styleDetails: string }) {
  const rendering = style.styleDetails.split(',').map(part => part.trim().replace(/\.$/, '')).filter(part => part && !SCENERY.test(part)).join(', ');
  const prompt = `${referenceLabels(photos)}

Character reference sheet for ${JSON.stringify(name)}, for an illustrated storybook.
One head-and-shoulders portrait, three-quarter view facing the viewer.
Redraw the person in the reference photos with this rendering: ${rendering}.
Background: an empty, flat, pale single-colour backdrop. No scenery, no landscape, no buildings, no props.
Keep their exact facial identity: face shape, eyes, eyebrows, nose, mouth, jaw, hairline and hairstyle,
facial hair, glasses, skin tone and build. Keep the outfit from the first photo.
Only this one person. No text, no labels.`;
  const { imageUrl } = await generate(prompt, photos, 'character.sheet', { characterName: name });
  return imageUrl;
}

async function generate(prompt: string, references: CharacterReference[], event: string, info: Record<string, unknown>) {
  const images = references.map(reference => imagePart(reference.image));

  for (let attempt = 0; attempt < 3; attempt++) {
    const started = Date.now();
    try {
      const { b64, usage } = await editImage({ model, prompt, images, size: '1024x1024' });
      const imageUrl = `data:image/png;base64,${b64}`;
      trace(event, { ...info, attempt: attempt + 1, model, ok: true, ms: Date.now() - started, fullPrompt: prompt, usage, ...(event === 'character.sheet' && { imageUrl }) });
      return { success: true, imageUrl };
    } catch (error) {
      trace(event, { ...info, attempt: attempt + 1, model, ok: false, ms: Date.now() - started, error: String(error) });
      console.error(`Image generation attempt ${attempt + 1} failed:`, error);
    }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
  }
  throw new Error('Unable to generate an illustration with its character references. Please retry.');
}
