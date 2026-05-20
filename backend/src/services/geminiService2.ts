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
Your task is to convert a story into a 6-page comic storyboard in strict JSON format.

1. STYLE GUIDELINES
- Target Art Style: ${data.artStyle}
- Visual Language: Use comic-specific terms like "cinematic framing," "dynamic gutters,"
  "depth of field," "heroic low-angle shots," and "saturated color grading."

STYLE ENFORCEMENT RULES — MANDATORY:
- The phrase "${data.artStyle} comic page" MUST appear at the very START of every imagePrompt
- The phrase "rendered in ${data.artStyle} style" MUST appear at the very END of every imagePrompt
- Every panel description MUST include at least one of these style reinforcers:
  "${data.artStyle} rendering", "hyper-detailed ${data.artStyle} art",
  "photorealistic comic art", "cinematic ${data.artStyle} illustration"
- Never use terms that contradict the art style (e.g. "cartoon", "anime", "illustrated",
  "drawn", "sketch", "painted" if art style is Photorealistic)
- If art style is Photorealistic: use terms like "8K resolution", "DSLR quality",
  "ray-traced lighting", "subsurface skin scattering", "cinematic lens flare"

2. SPEECH BUBBLE & LETTERING PROTOCOL
- Dialogue: "Rounded speech balloons with tails pointing to the speaker."
- Exclamations: "Bold, jagged-edged shout bubbles with thick outlines."
- Internal Monologue: "Rectangular narrative captions at the top or bottom of panels."
- Sound Effects: "Stylized onomatopoeia integrated into the action (e.g., 'BOOM', 'CRACK', 'WHOOSH')."

DIALOGUE QUALITY RULES — MANDATORY:
- Every word in every speech bubble MUST be correctly spelled — proofread before writing
- Every sentence MUST be grammatically correct with proper punctuation
- Max 10 words per speech balloon — short, punchy, natural
- Max 15 words per narrative caption
- Sound effects must be single stylized words only (BOOM, CRACK, WHOOSH, THUD, SNAP)
- Never use placeholder text, incomplete sentences, or ellipsis as a full thought
- Read each dialogue line aloud mentally before finalizing — if it sounds unnatural, rewrite it

3. INPUT DATA
- Template: ${data.template || 'No template provided'}
- Story Context: ${details}

4. IMAGE PROMPT CONSTRUCTION RULES
Each imagePrompt MUST follow this EXACT structure — scene and action ONLY,
no character physical descriptions (characters will be provided separately to the image model):

"${data.artStyle} comic page.
4-panel layout with clear gutters.
PANEL 1: [Scene action + environment + mood], ${data.artStyle} rendering, [lighting details]. [Bubble type]: '[Proofread text]'.
PANEL 2: [Scene action + environment], hyper-detailed ${data.artStyle} art, [mood]. [Bubble type]: '[Proofread text]'.
PANEL 3: [Scene action + atmosphere], cinematic ${data.artStyle} illustration. Sound Effect: '[Single word]'.
PANEL 4: [Scene action + mood + lighting], ${data.artStyle} rendering, [depth details]. [Bubble type]: '[Proofread text]'.
Atmospheric details: [lighting, color grading, depth of field]. Rendered in ${data.artStyle} style,
8K resolution, ray-traced lighting, cinematic lens flare, subsurface skin scattering."

SCENE DESCRIPTION RULES:
- Describe ONLY actions, environments, camera angles, mood, and lighting
- Refer to characters by name only (e.g. "Avishek turns to face the mountain")
- Do NOT describe any physical appearance, clothing, hair, or facial features
- Do NOT include any CHARACTER ANCHOR or physical description blocks
- Focus on: what is happening, where it is happening, how it looks atmospherically

PROMPT QUALITY CHECKLIST — run for EVERY page before writing:
✓ Does the prompt START with "${data.artStyle} comic page"?
✓ Does the prompt END with "rendered in ${data.artStyle} style"?
✓ Does every panel contain a ${data.artStyle} style reinforcer?
✓ Are characters referenced by name only with NO physical descriptions?
✓ Is every dialogue word correctly spelled and grammatically natural?
✓ Are sound effects single stylized words only?
If ANY answer is NO — rewrite that section before moving to the next page.

5. CONSISTENCY ENFORCEMENT
After completing all 6 pages perform a final pass:
- Confirm every imagePrompt starts with "${data.artStyle} comic page"
- Confirm every imagePrompt ends with "rendered in ${data.artStyle} style"
- Confirm every panel has at least one style reinforcer keyword
- Confirm NO physical character descriptions appear anywhere in the prompts
- Confirm all dialogue is grammatically correct and properly spelled
Only output the JSON after this final pass is complete.

6. OUTPUT FORMAT
Return ONLY a JSON object:
{
  "title": "Title of the Comic",
  "subtitle": "Issue/Arc Name",
  "pages": [
    { "page": 1, "imagePrompt": "..." },
    { "page": 2, "imagePrompt": "..." },
    { "page": 3, "imagePrompt": "..." },
    { "page": 4, "imagePrompt": "..." },
    { "page": 5, "imagePrompt": "..." },
    { "page": 6, "imagePrompt": "..." }
  ]
}

FINAL REMINDER BEFORE YOU OUTPUT:
- Does every imagePrompt start with "${data.artStyle} comic page"?
- Does every imagePrompt end with "rendered in ${data.artStyle} style"?
- Does every panel contain a style reinforcer?
- Do ALL prompts contain ZERO physical character descriptions?
- Is all dialogue correctly spelled and grammatically natural?
If ANY answer is NO — rewrite before outputting.`;




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