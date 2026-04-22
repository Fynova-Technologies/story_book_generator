import { genAI } from './gemini.ts';

export const transformImage = async (
  base64Image: string ,
  prompt:      string,
) => {
  try {
    // 1. Extract raw base64 data and mime type
    const base64Data = base64Image.split(',')[1];
    const mimeType   = base64Image.split(';')[0].split(':')[1];

    // 2. Call Gemini model
    const response = await genAI.models.generateContent({
      model:    'gemini-2.5-flash-image',
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

    return { success: false, error: 'No image returned from Gemini' };

  } catch (error) {
    console.error('Transformation Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// ── Generate image from text only (no user photo) ──────────
export const generateImageFromText = async (
  prompt:   string,
) => {
  try {
    const response = await genAI.models.generateContent({
      model:    'gemini-2.5-flash-image',
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

    return { success: false, error: 'No image returned from Gemini' };

  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};