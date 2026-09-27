import { genAI } from './gemini';
import { CharacterReference, referenceParts } from './characterReferences';

// Keep one model for the whole book, including retries, to avoid style drift.
const model = 'gemini-2.5-flash-image';

export async function transformImage(
  references: CharacterReference[],
  characterContext: string,
  prompt: string,
) {
  const parts = [
    ...referenceParts(references),
    { text: `Create the requested story illustration.

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
${prompt}` },
  ];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await genAI.models.generateContent({
        model,
        contents: { parts },
        config: { responseModalities: ['IMAGE', 'TEXT'] },
      });
      const image = response.candidates?.[0]?.content?.parts?.find(
        part => part.inlineData?.mimeType?.startsWith('image/') && part.inlineData.data,
      )?.inlineData;
      if (image) return { success: true, imageUrl: `data:${image.mimeType};base64,${image.data}` };
    } catch (error) {
      console.error(`Image generation attempt ${attempt + 1} failed:`, error);
    }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
  }
  throw new Error('Unable to generate an illustration with its character references. Please retry.');
}
