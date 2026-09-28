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
  const images = references.map(reference => imagePart(reference.image));

  for (let attempt = 0; attempt < 3; attempt++) {
    const started = Date.now();
    try {
      const { b64, usage } = await editImage({ model, prompt: fullPrompt, images, size: '1024x1024' });
      trace('image.attempt', { page, attempt: attempt + 1, model, ok: true, ms: Date.now() - started, fullPrompt, usage });
      return { success: true, imageUrl: `data:image/png;base64,${b64}` };
    } catch (error) {
      trace('image.attempt', { page, attempt: attempt + 1, model, ok: false, ms: Date.now() - started, error: String(error) });
      console.error(`Image generation attempt ${attempt + 1} failed:`, error);
    }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
  }
  throw new Error('Unable to generate an illustration with its character references. Please retry.');
}
