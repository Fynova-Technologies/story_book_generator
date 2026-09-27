import { genAI } from './gemini';
import { 
  PersonGeneration,
  SubjectReferenceImage,
  SubjectReferenceType,
} from '@google/genai';

const models = [
  // 'gemini-2.0-flash-preview-image-generation',
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image-preview',  // fallback to newer model
];


// // ── Transform image WITH character preservation ──────────────
// export const transformImage = async (
//   base64Images: string[],
//   prompt: string,
// ) => {
//   const validImages = base64Images.filter(img => img?.includes(','));

//   if (validImages.length === 0) {
//     return { success: false, error: 'No valid images provided' };
//   }

//   // ✅ Use SubjectReferenceImage — this is the correct type for editImage
//  const referenceImages = validImages.map((img, idx) => {
//   const ref = new SubjectReferenceImage();
//   ref.referenceId = idx + 1;
//   ref.referenceImage = {
//     imageBytes: img.split(',')[1],
//   };
//   ref.config = {
//     subjectType: SubjectReferenceType.SUBJECT_TYPE_PERSON,
//   };
//   return ref;
// });

//   for (let attempt = 0; attempt < 3; attempt++) {
//     try {
//       // ✅ editImage — NOT generateImages — supports referenceImages
//       const response = await genAI.models.editImage({
//         model: 'imagen-3.0-capability-001',
//         prompt,
//         referenceImages,
//         config: {
//           numberOfImages: 1,
//           personGeneration: PersonGeneration.ALLOW_ALL,
//         },
//       });

//       const bytes = response.generatedImages?.[0]?.image?.imageBytes;
//       if (bytes) {
//         return {
//           success: true,
//           imageUrl: `data:image/png;base64,${bytes}`,
//         };
//       }

//     } catch (error) {
//       console.error(`Attempt ${attempt + 1} failed:`, error);
//       if (attempt < 2) {
//         await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
//       }
//     }
//   }

//   return { success: false, error: 'All attempts failed' };
// };

// // ── Generate image from text only ────────────────────────────
// export const generateImageFromText = async (prompt: string) => {
//   for (let attempt = 0; attempt < 3; attempt++) {
//     try {
//       const response = await genAI.models.generateImages({
//         model: 'imagen-3.0-generate-002',        // standard generate — no refs needed
//         prompt,
//         config: {
//           numberOfImages: 1,
//           aspectRatio: '1:1',
//           personGeneration: PersonGeneration.ALLOW_ALL,
//         },
//       });

//       const bytes = response.generatedImages?.[0]?.image?.imageBytes;
//       if (bytes) {
//         return {
//           success: true,
//           imageUrl: `data:image/png;base64,${bytes}`,
//         };
//       }

//     } catch (error) {
//       console.error(`Attempt ${attempt + 1} failed:`, error);
//       if (attempt < 2) {
//         await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
//       }
//     }
//   }

//   return { success: false, error: 'All attempts to generate image failed' };
// };
export const transformImage = async (
  base64Images: string[],   // ← array of images now
  characterList: string,   // ← new parameter with all character names
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
   // Detailed character-lock prompt reduces over-expressiveness
    const characterPrompt = `You are given ${base64Images.length} reference photo(s) of named characters:
        ${characterList}
        CHARACTER IDENTITY RULES (STRICT)
        1. Each reference photo represents ONLY that specific named character
        2. Every named character must appear EXACTLY ONCE in the scene
        3. Named characters must visually match their reference photo exactly
          (face, hairstyle, clothing, overall appearance)

       THIRD PARTY / BACKGROUND PEOPLE RULES
        4. ANY person NOT listed above is a THIRD PARTY
        5. Third parties (crowd, bystanders, extras, background figures, audience, passersby, etc.) must NEVER resemble any reference character
        6. Third party faces must be GENERIC, DIVERSE, and DISTINCT from all reference photos
        7. If third parties are in the background, their faces should be BLURRED or INDISTINCT
        8. Do NOT copy, reuse, or approximate any reference face on any third party under any circumstances

        SCENE TO GENERATE
        ${prompt}
          `.trim();

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await genAI.models.generateContent({
          model,
          contents: {
            parts: [
              ...imageParts,   // ← all photos sent together
              {
                text: characterPrompt
              },
            ],
          },
           config: {
           responseModalities: ['IMAGE', 'TEXT'],
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