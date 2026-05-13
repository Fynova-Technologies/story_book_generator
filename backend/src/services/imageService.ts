import { genAI } from './gemini';

const models = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image-preview',  // fallback to newer model
];

export const transformImage = async (
  base64Images: string[],   // ← array of images now
  prompt:       string,
) => {
  // build image parts from all photos
  const imageParts = base64Images
    .filter(img => img && img.includes(','))
    .map(img => ({
      inlineData: {
        data:     img.split(',')[1],
        mimeType: img.split(';')[0].split(':')[1],
      }
    }));

  if (imageParts.length === 0) {
    return { success: false, error: 'No valid images provided' };
  }

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await genAI.models.generateContent({
          model,
          contents: {
            parts: [
              ...imageParts,   // ← all photos sent together
              {
                text: `Use the provided images as references. 
                Preserve the characters, lighting, mood and style 
                while adapting to the scene below.\n\n${prompt}`
              },
            ],
          },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return {
                success:  true,
                imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
              };
            }
          }
        }

      } catch (error) {
        console.error(`Attempt ${attempt + 1} with model ${model} failed:`, error);
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      }
    }
  }

  return { success: false, error: 'All attempts failed' };
};

// ── Generate image from text only (no user photo) ──────────
export const generateImageFromText = async (
  prompt:   string,
) => {
  // const models = ['gemini-2.5-flash-image', 'gemini-3-flash-image'];

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await genAI.models.generateContent({
          model:    model,
          contents: {
            parts: [{ text: prompt }],
          },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return {
                success:  true,
                imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
              };
            }
          }
        }

        // If no image, continue to next attempt
      } catch (error) {
        // console.error(`Attempt ${attempt + 1} with model ${model} failed:`, error);
        if (attempt < 2) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
  }

  return { success: false, error: 'All attempts to generate image failed with both models' };
};