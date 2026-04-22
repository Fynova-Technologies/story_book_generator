import { genAI } from './gemini.ts';

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
You are a professional storybook author. Write a 6-page personalized story.

Details:
- Template: ${data.template}
- Tone: ${data.narration}
${details}

Rules:
- Each page: 3-4 sentences max
- Page main theme is in first 100 char
- Weave details naturally, never list them
- Pages must flow as one continuous story
- End page 6 with hope or warmth
- illustrationPrompt must describe the full scene in the given art style

Return ONLY this JSON no markdown no extra text:
{"title":"","subtitle":"","pages":[
    { "page": 1, "text": "string", "imagePrompt": "string" },
    { "page": 2, "text": "string", "imagePrompt": "string" },
    { "page": 3, "text": "string", "imagePrompt": "string" },
    { "page": 4, "text": "string", "imagePrompt": "string" },
    { "page": 5, "text": "string", "imagePrompt": "string" },
    { "page": 6, "text": "string", "imagePrompt": "string" },
]}
  `;

  try {
    const response = await genAI.models.generateContent({
      model:    'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature:     0.8,
        maxOutputTokens: 8500,
      }
    });
    const text    = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Story generation error:', error);
    throw error;
    
  }

  
};