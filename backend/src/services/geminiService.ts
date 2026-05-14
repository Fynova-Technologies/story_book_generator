import { ApiError } from '../utils/ApiError';
import { genAI }    from './gemini';

// ── Types ──────────────────────────────────────────────────
interface StoryImage {
  imageUrl:    string | null;
  description: string;
}

interface GenerateStoryInput {
  template:      string;
  questionnaire: Record<string, string>;
  artStyle:      string;
  narration:     string;
  storyStyle:    string;
  storytext:     string;
  images?:       StoryImage[];
}

// ── Helper: build questionnaire details or use storytext ──
const buildDetails = (questionnaire: Record<string, string>, storytext: string): string => {
  // If questionnaire has content, use it
  if (questionnaire && Object.keys(questionnaire).length > 0) {
    return Object.entries(questionnaire)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n');
  }
  // Otherwise use storytext as-is
  return storytext || '';
};

// ── Helper: build character context from descriptions ─────
const buildCharacterContext = (images: StoryImage[]): string => {
  const descriptions = images
    .filter(img => img.description && img.description.trim() !== '')
    .map((img, i) => `Photo ${i + 1}: ${img.description.trim()}`)
    .join('\n');

  return descriptions
    ? `\nUser photo descriptions (use for character consistency across all pages):\n${descriptions}\n`
    : '';
};

// ── Helper: extract valid image URLs ──────────────────────
const extractImageUrls = (images: StoryImage[]): string[] =>
  images
    .filter(img => img.imageUrl && img.imageUrl.trim() !== '')
    .map(img => img.imageUrl as string);

// ── Helper: build Gemini contents with images + prompt ────
const buildContents = (prompt: string, imageUrls: string[]) => {
  if (imageUrls.length === 0) {
    return { parts: [{ text: prompt }] };
  }

  const imageParts = imageUrls.map(url => ({
    fileData: {
      fileUri:  url,
      mimeType: 'image/jpeg',
    }
  }));

  return {
    parts: [
      ...imageParts,
      { text: prompt }
    ]
  };
};

// ══ STORYBOOK PROMPT ══════════════════════════════════════
const buildStorybookPrompt = (
  data:             GenerateStoryInput,
  details:          string,
  characterSection: string,
): string => `
You are a professional personalized storybook author and illustration prompt engineer.
Create a polished, emotionally engaging 6-page storybook narrative using the exact user inputs.

Input:
- Template: ${data.template}
- Art style: ${data.artStyle}
- Narrative tone: ${data.narration || 'warm and uplifting'}
${details}
${characterSection}
${data.storytext}

Instructions:
1. Return ONLY valid JSON with no markdown, code fences, explanation, or extra keys.
2. Use this exact schema:
{"title":"","subtitle":"","pages":[
  { "page": 1, "text": "", "imagePrompt": "" },
  { "page": 2, "text": "", "imagePrompt": "" },
  { "page": 3, "text": "", "imagePrompt": "" },
  { "page": 4, "text": "", "imagePrompt": "" },
  { "page": 5, "text": "", "imagePrompt": "" },
  { "page": 6, "text": "", "imagePrompt": "" }
]}
3. Create a compelling title and subtitle that match the template and tone.
4. Produce exactly 6 pages.
5. Each page text should be 40-60 words, 3-4 sentences, one narrative scene.
6. Start each page with a strong scene anchor or vivid emotional image phrase.
7. Integrate user details naturally — never list, repeat verbatim, or bullet them.
8. Keep the story consistent with the template theme and requested art style.
9. Page 1: introduce main character, setting, and story goal.
10. Pages 2-5: develop plot, gentle tension, deepen character connection.
11. Page 6: resolve with warmth, hope, growth, or meaningful closure.
12. Each imagePrompt: one illustrated scene in the given art style.
13. Each imagePrompt MUST use the user photo descriptions for character appearance consistency.
14. Each imagePrompt: mention characters, setting, mood, lighting, composition, key visual details.
15. Keep each imagePrompt concise, vivid, under 120 words.
16. Use polished, child-friendly language that feels professional and engaging.
`;

// ══ MANGA PROMPT ══════════════════════════════════════════
const buildMangaPrompt = (
  data:             GenerateStoryInput,
  details:          string,
  characterSection: string,
): string => `
The Manga Architect Master Prompt
Act as a Professional Manga Architect and Image Prompt Engineer. Your task is to convert a story into a 6-page manga storyboard delivered in a strict JSON format.
1. CHARACTER & STYLE GUIDELINES
•	Art Style: Modern Shojo Manga (sharp line work, high-contrast screentones, expressive eyes, and decorative backgrounds).
•	Character Consistency: You must extract visual anchors from the provided reference images (e.g., specific hair textures, eye shapes, and clothing) and repeat these descriptions in every page prompt to ensure the AI doesn't change the characters' looks.
•	Visual Language: Use manga-specific terms like "tonal dots," "white-out highlights," "speed lines," "slanted panels," and "shonen-style cross-hatching."
2. SPEECH BUBBLE PROTOCOL
Every imagePrompt must explicitly describe the placement and content of dialogue:
•	Action/Shout: Use "Jagged burst bubbles."
•	Dialogue: Use "Standard oval speech bubbles."
•	Thoughts: Use "Soft, cloud-like bubbles."
•	Atmosphere: Use "Tail-less floating text" for narration.
3. INPUT DATA
•	Template: ${data.template||'No template provided'}
•	Story Context: ${details}
•	Character Context: ${characterSection}
•	The Reference Images: [User provides images like image_4e20dc.jpg and the WhatsApp files]
4. OUTPUT FORMAT
Return ONLY a JSON object with the following structure:
JSON
{
  "title": "Title of the Manga",
  "subtitle": "Chapter/Theme Name",
  "pages": [
    {
      "page": 1,
      "imagePrompt": "Detailed prompt including Global Style Anchors, panel descriptions, and specific speech bubble text/placement."
    },
    {"page": 2, "imagePrompt": "..."},
    {"page": 3,"imagePrompt": "..." },
    {"page": 4,"imagePrompt": "..." },
    {"page": 5,"imagePrompt": "..." },
    {"page": 6,"imagePrompt": "..." }
  ]
}


`;

// ══ COMIC PROMPT ══════════════════════════════════════════
const buildComicPrompt = (
  data:             GenerateStoryInput,
  details:          string,
  characterSection: string,
): string => `
Act as a Professional Comic Book Illustrator and Image Prompt Engineer. 
Your task is to convert a story into a 6-page comic storyboard delivered in a strict JSON format.

1. STYLE GUIDELINES
- Target Art Style: ${data.artStyle}
- Visual Language: Use comic-specific terms like "cinematic framing," "dynamic gutters," 
  "depth of field," "heroic low-angle shots," and "saturated color grading."

2. SPEECH BUBBLE & LETTERING PROTOCOL
Every imagePrompt must explicitly describe the placement and content of dialogue:
- Dialogue: "Rounded speech balloons with tails pointing to the speaker."
- Exclamations: "Bold, jagged-edged shout bubbles with thick outlines."
- Internal Monologue: "Rectangular narrative captions at the top or bottom of panels."
- Sound Effects: "Stylized onomatopoeia integrated into the action (e.g., 'BOOM', 'CRACK', 'WHOOSH')."

3. INPUT DATA
- Template: ${data.template || 'No template provided'}
- Story Context: ${details}

4. OUTPUT FORMAT
Return ONLY a JSON object with the following structure:
{
  "title": "Title of the Comic",
  "subtitle": "Issue/Arc Name",
  "pages": [
    {
      "page": 1,
      "imagePrompt": "A professional comic page in [Target Art Style]. 4-panel layout with clear gutters. PANEL 1: [Action]. Speech Balloon: '[Text]'. PANEL 2: [Action]. Narrative Caption: '[Text]'. [Atmospheric details]."
    },
    { "page": 2, "imagePrompt": "..." },
    { "page": 3, "imagePrompt": "..." },
    { "page": 4, "imagePrompt": "..." },
    { "page": 5, "imagePrompt": "..." },
    { "page": 6, "imagePrompt": "..." }
  ]
}`;




// ══ MAIN FUNCTION ══════════════════════════════════════════
export const generateStory = async (data: GenerateStoryInput): Promise<any> => {

  const details          = buildDetails(data.questionnaire, data.storytext);
  const characterSection = buildCharacterContext(data.images || []);
  const imageUrls        = extractImageUrls(data.images || []);

  // ── Pick correct prompt based on story style ───────────
  let prompt: string;
  switch (data.storyStyle.toLowerCase()) {
    case 'manga':
      prompt = buildMangaPrompt(data, details, characterSection);
      break;
    case 'comic':
      prompt = buildComicPrompt(data, details, characterSection);
      break;
    case 'storybook':
    default:
      prompt = buildStorybookPrompt(data, details, characterSection);
      break;
  }

  // ── Build contents — text prompt + user images ─────────
  const contents = buildContents(prompt, imageUrls);

  // ── Try models with retry + exponential backoff ────────
  const MODELS      = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  let   lastError: any = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`Trying model: ${model}, attempt: ${attempt + 1}, style: ${data.storyStyle}`);

        const response = await genAI.models.generateContent({
          model,
          contents,
          config: { temperature: 0.8 }
        });

        const text    = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed  = JSON.parse(cleaned);

        // validate response
        if (!parsed.pages || parsed.pages.length < 6) {
          throw new Error('Incomplete story — less than 6 pages returned');
        }

        console.log(`Story generated successfully with ${model}`);
        return { ...parsed, style: data.storyStyle };

      } catch (error: any) {
        console.error(`Model ${model} attempt ${attempt + 1} failed:`, error.message);
        lastError = error;

        // do not retry on auth or bad request errors
        if (
          error.message?.includes('401') ||
          error.message?.includes('403') ||
          error.message?.includes('400')
        ) {
          throw new ApiError(error.statusCode || 500, error.message);
        }

        if (attempt < 2) {
          const waitTime = 1000 * Math.pow(2, attempt);
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(r => setTimeout(r, waitTime));
        }
      }
    }
  }

  throw lastError || new ApiError(500, 'All attempts to generate story failed with both models.');
};