import { genAI } from "./gemini";

export const generateImagePrompt= async (
  story:   string,
  artStyle:string,

) => {
    console.log("Enter inside generateImagePrompt.................");
    
    const prompt = `
        You are a manga storyboard artist and prompt engineer.

        Convert a full story into multi-page manga image prompts.

        Input:
        - Full story text ${story}
        - Art style ${artStyle}

        Process:
        - Split story into logical scenes (min 5 pages)
        - Each page = one narrative phase
        - Maintain continuity (characters, setting, tone)

        Rules (per page):
        - Generate ONE image prompt
        - Image = 4-panel manga (2x2 grid)
        - Panels show progression: setup → development → turning point → outcome
        - Use positions: top-left, top-right, bottom-left, bottom-right
        - No “panel 1/2/3/4”
        - Each panel = distinct moment

        Characters:
        - Use consistent character references (e.g., “two male friends”)
        - Avoid detailed facial descriptions
        - Keep appearance stable across panels

        Dialogue:
        - Include speech bubbles (≤5 words)
        - White rounded rectangles, black text
        - Mention placement inside panels

        Style & Visuals:
        - Apply given art style ${artStyle} consistently
        - Include lighting mood, color palette, emotional tone
        - Add relevant environment details

        Optimization:
        - ≤120 tokens
        - Noun-focused, remove filler
        - Strong visual clarity

        End every prompt with:
        reference: given image if any ,manga composition, clean linework, consistent character design

        Output (JSON only):
        {"title":"","subtitle":"","pages": [
            { "page": 1, "imagePrompt": "string" },
            { "page": 2, "imagePrompt": "string" },
            { "page": 3, "imagePrompt": "string" },
            { "page": 4, "imagePrompt": "string" },
            { "page": 5, "imagePrompt": "string" }
        ]
        }
        `;
     try {
      const response = await genAI.models.generateContent({
      model:    'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature:     0.8,
        // maxOutputTokens: 2048,
      }
    });
        const text    = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Image prompts generation error:', error);
        throw error;
    
  }
}