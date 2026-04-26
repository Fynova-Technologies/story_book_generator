import { genAI } from "./gemini";

const models = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',  // fallback to newer model
];
export const generateImagePrompt= async (
  story:   string,
  artStyle:string,

) => {
    console.log("Enter inside generateImagePrompt.................");
    
    const prompt = `
        You are an expert illustration prompt engineer and storybook art director.

        Convert the full story into a professional page-by-page set of illustration prompts.

        Input:
        - Full story text: ${story}
        - Art style: ${artStyle}

        Requirements:
        1. Output EXACT JSON only, with no markdown and no extra text.
        2. Use this schema:
        {"title":"","subtitle":"","pages":[
            { "page": 1, "imagePrompt": "string" },
            { "page": 2, "imagePrompt": "string" },
            { "page": 3, "imagePrompt": "string" },
            { "page": 4, "imagePrompt": "string" },
            { "page": 5, "imagePrompt": "string" }
        ]}
        3. Generate one image prompt per page that matches the story and the requested art style.
        4. Each prompt should describe a single illustrated scene, including characters, setting, mood, composition, lighting, and key visual details.
        5. Keep the prompts concise, vivid, and optimized for image generation.
        6. Apply the requested art style consistently across all prompts.
        7. Do not reference panels, page numbers, or storyboard layout instructions.
        8. Use active visual language and avoid filler words.
`;

    let lastError: any = null;

    for (const model of models) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await genAI.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: {
              temperature: 0.8,
              // maxOutputTokens: 2048,
            },
          });

          const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleaned = text.replace(/```json|```/g, '').trim();
          return JSON.parse(cleaned);
        } catch (error) {
          console.error(`Attempt ${attempt + 1} with model ${model} failed:`, error);
          lastError = error;
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
    }

    throw lastError || new Error('Image prompt generation failed.');
}