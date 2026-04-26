import { ApiError } from '../utils/ApiError';
import { genAI } from './gemini';

export const generateStoryText = async (data: {
  template:      string;
  questionnaire: Record<string, string>;
  artStyle:      string;
  narration:     string;
}): Promise<any> => {

  const details = Object.entries(data.questionnaire)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

const prompt = `
You are a professional personalized storybook author and illustration prompt engineer.
Create a polished, emotionally engaging 6-page storybook narrative using the exact user inputs.

Input:
- Template: ${data.template}
- Art style: ${data.artStyle}
- Narrative tone: ${data.narration || 'warm and uplifting'}
${details}

Instructions:
1. Return ONLY valid JSON with no markdown, code fences, explanation, or extra keys.
2. Use this exact schema:
{"title":"","subtitle":"","pages":[
  { "page": 1, "text": "string", "imagePrompt": "string" },
  { "page": 2, "text": "string", "imagePrompt": "string" },
  { "page": 3, "text": "string", "imagePrompt": "string" },
  { "page": 4, "text": "string", "imagePrompt": "string" },
  { "page": 5, "text": "string", "imagePrompt": "string" },
  { "page": 6, "text": "string", "imagePrompt": "string" }
]}
3. Create a compelling title and subtitle that match the template and tone.
4. Produce exactly 6 pages.
5. Each page text should be 40-60 words, 3-4 sentences, and read as a single narrative scene.
6. Start each page with a strong scene anchor or vivid emotional image phrase.
7. Integrate user details naturally; do not list them, repeat them verbatim, or create bullet lists.
8. Keep the story consistent with the template theme and requested art style.
9. Page 1 should introduce the main character, setting, and story goal.
10. Pages 2-5 should develop the plot, add gentle tension, and deepen character connection.
11. Page 6 should resolve with warmth, hope, growth, or meaningful closure.
12. For each page, include an 'imagePrompt'describing one illustrated scene in the given art style.
13. Each 'imagePrompt' should mention characters, setting, mood, lighting, composition, and key visual details.
14. Keep each 'imagePrompt' concise, vivid, and under 120 words.
15. Use polished, child-friendly language that feels professional and engaging.
`;

  const models = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await genAI.models.generateContent({
          model:    model,
          contents: { parts: [{ text: prompt }] },
          config: {
            temperature:     0.8,
            // maxOutputTokens: 8500,
          }
        });
        const text    = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (error) {
        console.error(`Attempt ${attempt + 1} with model ${model} failed:`, error);
        lastError = error;
        if (attempt < 2) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
  }

  // If all retries fail, throw the last error from the model
  throw lastError || new ApiError(500, "All attempts to generate story failed with both models.");
};