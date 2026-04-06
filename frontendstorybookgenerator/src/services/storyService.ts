// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateStory = async (wizardData: {
  template:      string;
  questionnaire: Record<string, string>;
  artStyle:      string;
}) => {

  const prompt = `
    You are a professional storybook author who specializes in creating deeply personal, emotionally resonant stories for all of life's moments.
    Template: ${wizardData.template}
    Art Style: ${wizardData.artStyle}

    ${Object.entries(wizardData.questionnaire)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

    Your task is to write a 6-page personalized storybook based on the template and the user's details above.
    UNIVERSAL RULES
    1.	Weave all provided details naturally into the story — never list or mention them directly
    2.	Each page must be 3-4 sentences, vivid, emotionally engaging, and narrative-driven
    3.	The tone must match the template (e.g. joyful for birthdays, tender for memorials, adventurous for travel)
    4.	Every page must flow into the next — it should feel like one continuous story
    5.	If a detail is "Not provided", skip it gracefully — never mention it is missing
    6.	The final page must always end with hope, warmth, or a meaningful forward-looking message
    7.	illustrationPrompt must describe the full scene visually in the given art style — include character appearance, setting, mood, and colors
    8.	Write in simple, warm, everyday language — use short sentences and common words so anyone can read easily. But keep the storytelling feeling alive — use gentle imagery, small emotional moments, and heartfelt details that make the reader smile or feel something. Simple words, but a rich heart.


    Return ONLY a JSON object in this exact format with no extra text:
    {
      "title": "story title here",
      "pages": [
        { "pageNumber": 1, "text": "page 1 story text here" },
        { "pageNumber": 2, "text": "page 2 story text here" },
        { "pageNumber": 3, "text": "page 3 story text here" },
        { "pageNumber": 4, "text": "page 4 story text here" },
        { "pageNumber": 5, "text": "page 5 story text here" },
        { "pageNumber": 6, "text": "page 6 story text here" }
      ]
    }
  `;

//   console.log(prompt);
  

//   const result   = await model.generateContent(prompt);
//   const response = await result.response;
//   const text     = response.text();

  // clean response — Gemini sometimes wraps in ```json ... ```
//   const cleaned  = text.replace(/```json|```/g, '').trim();
//   const parsed   = JSON.parse(cleaned);

//   return parsed;
// const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     }
//   );

//   const data    = await response.json();
//   const text    = data.candidates[0].content.parts[0].text;
//   const cleaned = text.replace(/```json|```/g, '').trim();
//   return JSON.parse(cleaned);
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
  },
  body: JSON.stringify({
    model:           "llama-3.3-70b-versatile",
    messages:        [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  })
});

const data = await response.json();
return JSON.parse(data.choices[0].message.content);
};