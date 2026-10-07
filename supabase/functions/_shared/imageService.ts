import { editImage } from './openai.ts';
import { CharacterReference, imagePart, referenceLabels } from './characterReferences.ts';
import { trace } from './trace.ts';

// Keep one model for the whole book, including retries, to avoid style drift.
const model = 'gpt-image-2.5-flare';

export async function transformImage(
  references: CharacterReference[],
  characterContext: string,
  prompt: string,
  style: { art: string; avoid: string; emotion: string; sheet: string; size: string },
  page?: number,
) {
  // Only the faces in this scene: every extra reference face ends up on background people.
  // ponytail: plain name match; a scene that names nobody keeps every reference (edits need at least one image).
  const inScene = references.filter(reference => prompt.toLowerCase().includes(reference.characterName.toLowerCase()));
  if (inScene.length) references = inScene;
  const fullPrompt = `${referenceLabels(references)}

Create the requested story page.

ART STYLE (everything, including the characters, is drawn in this style):
${style.art}
Avoid: ${style.avoid}.

CHARACTER IDENTITY:
${characterContext}

Reference photos establish identity, not scene membership. Render ONLY characters
present in the scene/panel. The same character may recur in different panels.
Never duplicate a character within a panel unless the scene explicitly requires it.
Preserve face, hair, skin/fur, proportions, and distinguishing features across pages,
redrawn in the art style above, never photographic. Do not blend identities. Use the canonical outfit below; if reference
photos disagree on clothing, the first photo of that character defines the outfit.
Treat the character definitions as fixed; vary camera angle and push expression and pose to each panel's Emotion.
When a character's face is shown, it must be recognizably theirs.

EXPRESSIONS:
${style.emotion}
Exaggerate the expression, never the anatomy: face shape, features, hair and skin tone stay theirs.
The character sheet shows a neutral face; never copy its expression onto the page.

BACKGROUND PEOPLE:
Only the named characters look like the reference images. Everyone else (crowds, passers-by,
spectators, staff) is a stranger: give each a clearly different face, age, build, hairstyle
and skin tone, and never reuse a reference character's face or outfit on them.

TEXT IN THE IMAGE:
Render only text that appears in quotes in the scene, spelled exactly. Phone screens, calendars,
signs, posters, cakes and labels without quoted text stay blank or unreadable: never invent
dates, names, numbers or words.

PAGE:
${prompt}

Draw every character as ${style.sheet}, matching their character sheet.`;
  return generate(fullPrompt, references, 'image.attempt', { page }, style.size);
}

// One stylized portrait per character, generated once and passed to every page so each page
// doesn't reinterpret the photo in the art style on its own.
export async function createCharacterSheet(name: string, photos: CharacterReference[], style: { sheet: string }) {
  const prompt = `${referenceLabels(photos)}

Character reference sheet for ${JSON.stringify(name)}, for an illustrated storybook.
One head-and-shoulders portrait, three-quarter view facing the viewer.
Redraw the person in the reference photos as ${style.sheet}.
Background: an empty, flat, pale single-colour backdrop. No scenery, no landscape, no buildings, no props.
Keep their exact facial identity: face shape, eyes, eyebrows, nose, mouth, jaw, hairline and hairstyle,
facial hair, glasses, skin tone and build. Keep the outfit from the first photo.
Only this one person. No text, no labels.`;
  const { imageUrl } = await generate(prompt, photos, 'character.sheet', { characterName: name });
  return imageUrl;
}

// One attempt only: retries are the user's call (a "Retry page" button), so we never spend
// on OpenAI without them asking, and one invocation stays well inside the 150s limit.
async function generate(prompt: string, references: CharacterReference[], event: string, info: Record<string, unknown>, size = '1024x1024') {
  const images = references.map(reference => imagePart(reference.image));
  const started = Date.now();
  try {
    const { b64, usage } = await editImage({ model, prompt, images, size });
    const imageUrl = `data:image/webp;base64,${b64}`;
    trace(event, { ...info, model, ok: true, ms: Date.now() - started, fullPrompt: prompt, usage, ...(event === 'character.sheet' && { imageUrl }) });
    return { success: true, imageUrl };
  } catch (error) {
    trace(event, { ...info, model, ok: false, ms: Date.now() - started, error: String(error) });
    throw error;
  }
}
