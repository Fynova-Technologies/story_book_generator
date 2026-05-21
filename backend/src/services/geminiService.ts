import { ApiError } from '../utils/ApiError';
import { genAI } from './gemini';

// ── Types ──────────────────────────────────────────────────
interface StoryImage {
  imageUrl: string | null;
  description: string;
}

interface GenerateStoryInput {
  template: string;
  questionnaire: Record<string, string>;
  artStyle: string;
  narration: string;
  storyStyle: string;
  storytext: string;
  images?: StoryImage[];
}

// ── STYLE PRESETS ──────────────────────────────────────────
const STYLE_PRESETS: Record<string, any> = {
  photorealistic: {
    intro:
      'Photorealistic cinematic storyboard page.',
    
    styleDetails: `Ultra realistic cinematic photography,Sony A7R IV,85mm lens,RAW photo quality,natural skin texture,realistic anatomy,HDR lighting,depth of field,volumetric lighting,realistic shadows,cinematic composition.`,
    
    negative:'cartoon, anime, illustration, comic art, painting, cel shading, distorted anatomy, low quality'
  },

  anime: {
    intro:
      'High-quality anime storyboard page.',

    styleDetails: `
      Modern anime aesthetic,clean anime line art,anime movie lighting,detailed cel shading,expressive anime eyes,Makoto Shinkai inspired atmosphere,dynamic anime framing,vibrant cinematic color harmony.`,

    negative:
      'photorealistic, DSLR photo, realistic skin pores, live action, RAW photography'
  },

  ghibli: {
    intro:
      'Studio Ghibli inspired storyboard page.',

    styleDetails: `
      Soft painterly environments,warm emotional lighting,dreamlike scenery,gentle hand-painted textures,Hayao Miyazaki inspired composition,natural whimsical atmosphere,soft cinematic colors.`,

    negative:
      '3D render, photorealistic skin, comic book style, hard shadows, CGI'
  },

  watercolor: {
    intro:
      'Watercolor illustrated storyboard page.',

    styleDetails: `Soft watercolor textures,paper grain,organic brush strokes,delicate pigment blending,pastel palette,traditional watercolor painting aesthetic.`,

    negative:
      '3D render, CGI, photorealistic, sharp digital outlines, cel shading'
  },

  '3d': {
    intro:
      'High-end 3D cinematic storyboard page.',

    styleDetails: `Pixar-quality rendering,Unreal Engine lighting,Octane render,cinematic global illumination,high-detail textures,stylized 3D characters,realistic materials,cinematic depth of field.`,

    negative:
      '2D drawing, watercolor, manga, sketch, flat illustration'
  },

  manga: {
    intro:
      'Modern manga storyboard page.',

    styleDetails: `
      Detailed manga linework,
      high-contrast screentones,
      dynamic manga framing,
      speed lines,
      expressive manga eyes,
      black-and-white manga aesthetic,
      Japanese comic panel composition.`,

    negative:
      'photorealistic skin, CGI, 3D render, watercolor painting'
  }
};

// ── Helper: build questionnaire details ───────────────────
const buildDetails = (
  questionnaire: Record<string, string>,
  storytext: string
): string => {
  if (questionnaire && Object.keys(questionnaire).length > 0) {
    return Object.entries(questionnaire)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n');
  }

  return storytext || '';
};

// ── Helper: build character context ───────────────────────
// const buildCharacterContext = (images: StoryImage[]): string => {
//   const descriptions = images
//     .filter(img => img.description && img.description.trim() !== '')
//     .map((img, i) => `Character ${i + 1}: ${img.description.trim()}`)
//     .join('\n');

//   return descriptions
//     ? `\nCharacter consistency references:\n${descriptions}\n`
//     : '';
// };

// ── Helper: extract image URLs ────────────────────────────
// const extractImageUrls = (images: StoryImage[]): string[] =>
//   images
//     .filter(img => img.imageUrl && img.imageUrl.trim() !== '')
//     .map(img => img.imageUrl as string);

// ── Helper: build Gemini contents ─────────────────────────
// const buildContents = (prompt: string, imageUrls: string[]) => {
//   if (imageUrls.length === 0) {
//     return { parts: [{ text: prompt }] };
//   }

//   const imageParts = imageUrls.map(url => ({
//     fileData: {
//       fileUri: url,
//       mimeType: 'image/jpeg',
//     }
//   }));

//   return {
//     parts: [
//       ...imageParts,
//       { text: prompt }
//     ]
//   };
// };

const buildStoryBookPrompt =(
  data: GenerateStoryInput,
  details: string,
): string => {
  const styleKey = data.artStyle.toLowerCase();
  const style =
    STYLE_PRESETS[styleKey] ||
    STYLE_PRESETS.photorealistic;

    return `You are a world-class cinematic storyteller and AI image prompt engineer.

    Generate a visually cinematic 6-page story in strict JSON format.

    INPUT:
    - Story template: ${data.template}
    - Art style: ${data.artStyle}
    - Narrative tone: ${data.narration || 'cinematic and emotional'}

    STORY CONTEXT:
    ${details}

    STYLE:
    ${style.intro}

    STYLE DETAILS:
    ${style.styleDetails}

    NEGATIVE PROMPT:
    ${style.negative}

    RULES:
    - Return ONLY valid JSON
    - No markdown or explanations
    - Generate EXACTLY 6 pages
    - Match the requested art style accurately
    - Avoid mixing incompatible aesthetics
    - Keep imagePrompt under 140 words
    - Generate prompts for SINGLE cinematic images only
    - No comic panels
    - No speech bubbles
    - No dialogue text inside images
    - Focus on cinematic composition, lighting, mood, environment, action, and emotion
    - Use concise AI-image-friendly language

    STORY FLOW:
    - Page 1: introduce character and setting
    - Pages 2-5: progression, conflict, emotion
    - Page 6: emotional resolution

    TEXT RULES:
    - 40-60 words per page
    - Natural cinematic narration
    - Avoid repetitive wording
    - Show emotion through actions and atmosphere

    IMAGE PROMPT FORMAT:

    "${style.intro} 
    [cinematic scene description with action, environment, emotion, framing, and atmosphere]
    Visual atmosphere:
    [lighting, mood, environmental depth, cinematic color harmony]
    Style details:
    ${style.styleDetails}
    Negative prompt:
    ${style.negative}"

    JSON FORMAT:
    {
      "title": "",
      "subtitle": "",
      "pages": [
        {
          "page": 1,
          "text": "",
          "imagePrompt": ""
        }
      ]
    }
  `
};

// ── MASTER PROMPT BUILDER ─────────────────────────────────
const buildComicPrompt = (
  data: GenerateStoryInput,
  details: string,
): string => {

  const styleKey = data.artStyle.toLowerCase();
  const style =
    STYLE_PRESETS[styleKey] ||
    STYLE_PRESETS.photorealistic;

  return `
      You are a world-class cinematic storyboard writer and AI image prompt engineer.

      Your task:
      Generate a professional 6-page visual storyboard in strict JSON format.

      INPUT:
      - Story template: ${data.template || "No template provided"}
      - Art style: ${data.artStyle}
      - Narrative tone: ${data.narration || 'cinematic and emotional'}

      STORY CONTEXT:
      ${details}

      RULES:
      1. Return ONLY valid JSON
      2. No markdown
      3. No code fences
      4. Generate EXACTLY 6 pages
      5. Keep visual continuity across all pages
      6. Maintain consistent character appearance
      7. Use cinematic scene descriptions
      8. Focus on atmosphere, framing, lighting, emotion, environment
      9. Do NOT overdescribe
      10. Keep imagePrompt under 180 words

      JSON FORMAT:
      {
        "title": "",
        "subtitle": "",
        "pages": [
          {
            "page": 1,
            "imagePrompt": ""
          }
        ]
      }
     IMAGE PROMPT STRUCTURE:
    "${style.intro}
      4-panel sequential storyboard layout with cinematic composition and clean gutters.PANEL 1:[scene action, environment, mood, cinematic framing]
      Dialogue bubble: '[short natural dialogue]'ORNarration caption: '[short cinematic narration]'PANEL 2:[character interaction, 
      emotional focus, atmosphere]
      Dialogue bubble: '[emotionally relevant dialogue]'
      Reaction text: '[single-word reaction or SFX]'
      PANEL 3:
      [action moment, dynamic camera angle, environmental detail]
      Dialogue bubble: '[tense or expressive dialogue]'
      Sound effect: '[single stylized word]'
      PANEL 4:
      [resolution moment, emotional closure, cinematic lighting]
      Dialogue bubble: '[concluding emotional line]'OR Narration caption: '[warm concluding narration]'
      Visual atmosphere:[lighting behavior, environment mood, cinematic depth]
      Style details: ${style.styleDetails}
      Negative prompt: ${style.negative}"

      SPEECH BUBBLE & LETTERING PROTOCOL
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

      STORY RULES:
      - Page 1 introduces the main character and setting
      - Pages 2-5 develop emotional progression and conflict
      - Page 6 delivers meaningful emotional resolution
      - Each page text should be 40-60 words
      - Use natural polished storytelling
      - Avoid repetitive narration
      - Keep scenes visually cinematic

      IMPORTANT:
      - Use style-specific visual language
      - Preserve the requested art style consistently
      - Avoid mixing incompatible aesthetics
      - Never mention “illustration”, “comic art”, or “rendering” in photorealistic mode
      `;
};

// ── MAIN FUNCTION ─────────────────────────────────────────
export const generateStory = async (
  data: GenerateStoryInput
): Promise<any> => {

  const details = buildDetails(
    data.questionnaire,
    data.storytext
  );

  // const characterSection = buildCharacterContext(
  //   data.images || []
  // );

  // const imageUrls = extractImageUrls(
  //   data.images || []
  // );
  let prompt: string;
  switch (data.storyStyle.toLowerCase()) {
    // case 'manga':
    //   prompt = buildMangaPrompt(data, details);
    //   break;
    case 'comic':
      prompt = buildComicPrompt(data, details);
      break;
    case 'storybook':
    default:
      prompt = buildStoryBookPrompt(data, details);
      break;
  }

  // const prompt = buildComicPrompt(
  //   data,
  //   details,
  // );

  // const contents = buildContents(
  //   prompt,
  //   imageUrls
  // );

  const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-pro'
  ];

  let lastError: any = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {

      try {

        console.log(
          `Trying model: ${model}, attempt: ${attempt + 1}`
        );

        const response =
          await genAI.models.generateContent({
            model,
            contents: [prompt],
            config: {
              temperature: 0.7
            }
          });

        const text =
          response.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const cleaned =
          text.replace(/```json|```/g, '').trim();

        const parsed = JSON.parse(cleaned);

        if (
          !parsed.pages ||
          parsed.pages.length < 6
        ) {
          throw new Error(
            'Incomplete story generated'
          );
        }
        console.log(
          `Avishek Story generated successfully with ${model}`
        );

        return {
          ...parsed,
          style: data.artStyle
        };

      } catch (error: any) {

        console.error(
          `Model ${model} attempt ${attempt + 1} failed:`,
          error.message
        );

        lastError = error;

        if (
          error.message?.includes('401') ||
          error.message?.includes('403') ||
          error.message?.includes('400')
        ) {
          throw new ApiError(
            error.statusCode || 500,
            error.message
          );
        }

        if (attempt < 2) {

          const waitTime =
            1000 * Math.pow(2, attempt);

          console.log(
            `Waiting ${waitTime}ms before retry...`
          );

          await new Promise(r =>
            setTimeout(r, waitTime)
          );
        }
      }
    }
  }

  throw (
    lastError ||
    new ApiError(
      500,
      'All attempts failed.'
    )
  );
};