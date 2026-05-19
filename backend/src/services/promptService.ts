import { ApiError } from '../utils/ApiError';
import { genAI }    from './gemini';

// ── Types ──────────────────────────────────────────────────
interface StoryImage {
  image:    string | null;
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
const buildDetails = (
  questionnaire: Record<string, string>,
  storytext:     string,
): string => {
  if (questionnaire && Object.keys(questionnaire).length > 0) {
    return Object.entries(questionnaire)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n');
  }
  return storytext || '';
};

// ── NEW: Extract character description from a SINGLE image via AI ──
const extractCharacterDescription = async (
  imageUrl: string,
  characterName: string,
): Promise<string> => {
  try {
    console.log("Entered inside extractCharacterDescription");
    // ✅ Detect base64 vs hosted URL and build the correct part
    const imagePart = imageUrl.startsWith('data:')
      ? {
          inlineData: {
            data:     imageUrl.split(',')[1],
            mimeType: imageUrl.split(';')[0].split(':')[1],
          },
        }
      : {
          fileData: {
            fileUri:  imageUrl,
            mimeType: 'image/jpeg',
          },
        };

    
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          {
            text: `You are analyzing an image to extract a precise character description for AI image generation.

            FOCUS EXCLUSIVELY on the PRIMARY person (the most prominent/centered individual). Disregard all other people, backgrounds, and objects entirely.

            Describe this single person with maximum specificity across these dimensions:

            - **Hair**: exact color (e.g. ash blonde, blue-black, copper auburn), length, texture (coarse, silky, wavy, 4C coils), and style
            - **Face structure**: jaw shape (square, soft oval, angular), nose (broad, narrow, upturned, hooked), eye color and shape (almond, hooded, deep-set), eyebrow density and arch, lip fullness and shape
            - **Skin tone**: use precise descriptors (e.g. warm golden beige, cool deep ebony, fair with pink undertones, rich warm mahogany)
            - **Distinguishing features**: freckles, scars, dimples, moles, facial hair (style + color), visible tattoos
            - **Build**: body type, proportions, approximate height impression
            - **Outfit**: describe ONLY if it appears to be a costume, uniform, or signature look — skip if generic

            OUTPUT FORMAT:
            Return a single dense paragraph. Begin with exactly: "A [gender] with..."
            Do NOT mention other people, the background, the setting, or make assumptions beyond what is clearly visible.`,
                                  },
                    ],
                },
                config: { temperature: 0.2 },   // low temp = more precise description
                });

    const desc = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return desc.trim();

  } catch (error) {
    console.error(`Failed to extract description for ${characterName}:`, error);
    return '';
  }
};

// ── NEW: Extract all characters independently ──────────────
const extractAllCharacters = async (
  images: StoryImage[],
): Promise<Record<string, string>> => {
    console.log("Entered inside extractAllCharacters");

  const validImages = images.filter(img => img.image?.trim());
  const descriptions: Record<string, string> = {};
//   console.log(validImages);
//   console.log(images);
  
  

  for (let i = 0; i < validImages.length; i++) {
    const img  = validImages[i];
    // ✅ Use description field as the character name
    const name = img.description?.trim() || `Character ${i + 1}`;

    console.log(`Extracting description for: ${name}`);

    const aiDescription = img.image
      ? await extractCharacterDescription(img.image, name)
      : '';

    descriptions[name] = aiDescription;

    if (i < validImages.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log("Descriptions", descriptions);
  return descriptions;
};

// ── NEW: Build character section with named, separated descriptions ──
const buildCharacterContext = (
  characterDescriptions: Record<string, string>,
): string => {
  const entries = Object.entries(characterDescriptions).filter(([, desc]) => desc.trim());

  if (entries.length === 0) return '';

  const block = entries
    .map(([name, desc]) => `CHARACTER "${name}":\n${desc}`)
    .join('\n\n');

  return `
CHARACTER DESCRIPTIONS (maintain each character's appearance exactly as described below.
Do NOT blend features between characters.
If only one character appears in a panel, apply only that character's description):

${block}
`;
};

// ── Helper: build contents — ONE image only (best/first) ──
// Sending multiple images causes hallucination and feature blending
const buildContents = (prompt: string, imageUrls: string[]) => {
  if (imageUrls.length === 0) {
    return { parts: [{ text: prompt }] };
  }
const url = imageUrls[0];
  const imagePart = url.startsWith('data:')
    ? {
        inlineData: {
          data:     url.split(',')[1],
          mimeType: url.split(';')[0].split(':')[1],
        },
      }
    : {
        fileData: {
          fileUri:  url,
          mimeType: 'image/jpeg',
        },
      };
  // ✅ Send only the FIRST image as a visual anchor
  // Character appearance is already locked via text descriptions
  return {
    parts: [
      imagePart,
      { text: prompt },
    ],
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
${data.storytext}

${characterSection}

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
13. Each imagePrompt MUST reference characters by their name and use their description above.
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
Act as a Professional Manga Architect and Image Prompt Engineer.
Your task is to convert a story into a 6-page manga storyboard in strict JSON format.

1. STYLE GUIDELINES
- Art Style: Modern Shojo Manga (sharp line work, high-contrast screentones, expressive eyes, decorative backgrounds)
- Visual Language: Use manga-specific terms like "tonal dots," "white-out highlights," "speed lines," "slanted panels," "shonen-style cross-hatching."

2. SPEECH BUBBLE PROTOCOL
- Action/Shout: "Jagged burst bubbles."
- Dialogue: "Standard oval speech bubbles."
- Thoughts: "Soft, cloud-like bubbles."
- Atmosphere: "Tail-less floating text" for narration.

3. INPUT DATA
- Template: ${data.template || 'No template provided'}
- Story Context: ${details}

- Characters: ${characterSection}

4. OUTPUT FORMAT
Return ONLY a JSON object:
{
  "title": "Title of the Manga",
  "subtitle": "Chapter/Theme Name",
  "pages": [
    { "page": 1, "imagePrompt": "..." },
    { "page": 2, "imagePrompt": "..." },
    { "page": 3, "imagePrompt": "..." },
    { "page": 4, "imagePrompt": "..." },
    { "page": 5, "imagePrompt": "..." },
    { "page": 6, "imagePrompt": "..." }
  ]
}`;

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

2. SPEECH BUBBLE & LETTERING PROTOCOL
- Dialogue: "Rounded speech balloons with tails pointing to the speaker."
- Exclamations: "Bold, jagged-edged shout bubbles with thick outlines."
- Internal Monologue: "Rectangular narrative captions at the top or bottom of panels."
- Sound Effects: "Stylized onomatopoeia integrated into the action (e.g., 'BOOM', 'CRACK', 'WHOOSH')."

3. INPUT DATA
- Template: ${data.template || 'No template provided'}
- Story Context: ${details}
- Characters: ${characterSection}

4. OUTPUT FORMAT
Return ONLY a JSON object:
{
  "title": "Title of the Comic",
  "subtitle": "Issue/Arc Name",
  "pages": [
    { "page": 1, "imagePrompt": "A professional comic page in [Target Art Style]. 4-panel layout with clear gutters. PANEL 1: [Action]. Speech Balloon: '[Text]'. PANEL 2: [Action]. Narrative Caption: '[Text]'. [Atmospheric details]." },
    { "page": 2, "imagePrompt": "..." },
    { "page": 3, "imagePrompt": "..." },
    { "page": 4, "imagePrompt": "..." },
    { "page": 5, "imagePrompt": "..." },
    { "page": 6, "imagePrompt": "..." }
  ]
}`;

// ══ MAIN FUNCTION ══════════════════════════════════════════
export const generateStory = async (data: GenerateStoryInput): Promise<any> => {

  const details   = buildDetails(data.questionnaire, data.storytext);
  const imageUrls = (data.images || [])
    .filter(img => img.image?.trim())
    .map(img => img.image as string);

  // ✅ Extract each character independently before building prompt
  const characterDescriptions = await extractAllCharacters(data.images || []);
  const characterSection = buildCharacterContext(characterDescriptions);
  console.log("characterSection",characterSection);
  
  

  // ── Pick correct prompt ────────────────────────────────
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

  // ✅ Only send first image to avoid hallucination from multiple inputs
  // const contents = buildContents(prompt, imageUrls);
  const contents = prompt;

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
          config: { temperature: 0.8 },
        });

        const text    = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed  = JSON.parse(cleaned);

        if (!parsed.pages || parsed.pages.length < 6) {
          throw new Error('Incomplete story — less than 6 pages returned');
        }

        console.log(`Story generated successfully with ${model}`);
        return { ...parsed, style: data.storyStyle };

      } catch (error: any) {
        console.error(`Model ${model} attempt ${attempt + 1} failed:`, error.message);
        lastError = error;

        if (
          error.message?.includes('401') ||
          error.message?.includes('403') ||
          error.message?.includes('400')
        ) {
          throw new ApiError(error.statusCode || 500, error.message);
        }

        if (attempt < 2) {
          const waitTime = 1000 * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, waitTime));
        }
      }
    }
  }

  throw lastError || new ApiError(500, 'All attempts to generate story failed.');
};