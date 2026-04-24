import { genAI } from './gemini';

const models = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image-preview',  // fallback to newer model
];

export const transformImage = async (
  base64Image: string ,
  prompt:      string,
) => {
  // 1. Extract raw base64 data and mime type
  const base64Data = base64Image.split(',')[1];
  const mimeType   = base64Image.split(';')[0].split(':')[1];


  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // 2. Call Gemini model
        const response = await genAI.models.generateContent({
          model:    model,
          contents: {
            parts: [
              {
                inlineData: {
                  data:     base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        });

        // 3. Parse result to find image part
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
        console.error(`Attempt ${attempt + 1} with model ${model} failed:`, error);
        if (attempt < 2) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
  }

  return { success: false, error: 'All attempts to transform image failed with both models' };
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
        console.error(`Attempt ${attempt + 1} with model ${model} failed:`, error);
        if (attempt < 2) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
  }

  return { success: false, error: 'All attempts to generate image failed with both models' };
};