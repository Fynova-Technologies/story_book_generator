import { ApiError } from '../utils/ApiError';
import { genAI } from './gemini';
import { Type, Schema } from '@google/genai';
import { getInstructionsByStyle } from './storyStyleConfig';

// ── Types ──────────────────────────────────────────────────
interface StoryImage {
  image: string | null;
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
  storyLength: any;
}
const StrictUserSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          page: { type: Type.INTEGER },
          imagePrompt: { type: Type.STRING },
        },
        required: ["page", "imagePrompt"]
      }
    }
  },
  required: ["title", "subtitle", "pages"]
};
const getImagePart = (image: string) => {
  if (image.startsWith('data:')) {
    const [metadata, base64] = image.split(',');
    const mimeType = metadata.split(';')[0].replace('data:', '');
    return {
      inlineData: { data: base64, mimeType },
    };
  }
  return {
    fileData: { fileUri: image, mimeType: 'image/jpeg' },
  };
};

// ── Extract visual description for ONE image ───────────────
const extractCharacterDescription = async (
  image:        string,
  characterName: string,
): Promise<string> => {
  if (!image || !image.trim()) return '';

  const prompt = `
Analyze this photo of a person named "${characterName}".
Output a concise visual description paragraph for an AI image generator
to recreate this exact person consistently across multiple illustrations.

Include strictly:
1. Estimated age and ethnicity
2. Hair: style, length, texture, color
3. Face: eye shape, eyebrows, jaw structure, skin tone, distinct features
4. Body: build and height impression
5. Clothing: exact garment types and colors visible

Rule: Output ONLY the raw description. No markdown, no intro, no bullet points.
Example output: "A 22-year-old Nepali young man with short silky black hair..."
  `;

  try {
    const response = await genAI.models.generateContent({
      model:    'gemini-2.5-flash',
      contents: {
        parts: [
          getImagePart(image),
          { text: prompt },
        ],
      },
      config: { temperature: 0.2 },
    });

    return (
      response.candidates?.[0]?.content?.parts?.[0]?.text || ''
    ).trim();

  } catch (error) {
    console.error(`Failed to extract visual for ${characterName}:`, error);
    return '';
  }
};

// ── Extract descriptions for ALL images in parallel ────────
export const extractAllImageDescriptions = async (
  images: StoryImage[],
): Promise<Record<string, string>> => {

  const validImages = (images || []).filter(
    img => img.image && img.image.trim()
  );

  if (validImages.length === 0) return {};

  // ✅ run ALL in parallel — no more sequential for loop
  const results = await Promise.all(
    validImages.map(async (img, index) => {
      const name = img.description?.trim() || `Person ${index + 1}`;

      // ✅ always extract from image — never skip
      const visual = await extractCharacterDescription(
        img.image as string,
        name
      );

      return {
        name,
        visual: visual || `Reference photo ${index + 1}`,
      };
    })
  );

  // build Record<string, string>
  const descriptions: Record<string, string> = {};
  results.forEach(({ name, visual }) => {
    descriptions[name] = visual;
    console.log(`Description for [${name}]:`, visual);
  });

  return descriptions;
};

// ── Build visual section string ────────────────────────────
export const buildVisualDescriptionSection = (
  descriptions: Record<string, string>,
): string => {
  const entries = Object.entries(descriptions)
    .filter(([, desc]) => desc.trim());

  if (!entries.length) return '';

  // ✅ format: [Avishek]: a 22 yrs young boy...
  const block = entries
    .map(([name, desc]) => `[${name}]: ${desc}`)
    .join('\n');

  console.log('Visual description section:\n', block);

  return `\nVISUAL REFERENCE DESCRIPTIONS:\n${block}\n`;
};

// ── STYLE PRESETS ──────────────────────────────────────────
const STYLE_PRESETS: Record<string, any> = {
  photorealistic: {
    intro:
      "Photorealistic cinematic scene.",

    styleDetails:
      "Ultra-realistic photography, Sony A7R IV quality, 85mm lens, RAW photo realism, natural skin texture, realistic anatomy, HDR lighting, volumetric lighting, realistic shadows, cinematic composition, shallow depth of field.",

    restrictions:
      "Avoid anime styling, cartoon aesthetics, comic-book rendering, cel shading, painterly textures, exaggerated proportions, and artificial-looking anatomy."
  },

  anime: {
    intro:
      "High-quality anime cinematic scene.",

    styleDetails:
      "Modern anime aesthetic, clean linework, detailed cel shading, expressive eyes, anime movie lighting, cinematic framing, vibrant color harmony, dynamic composition, emotionally rich atmosphere.",

    restrictions:
      "Avoid photorealistic skin textures, DSLR photography appearance, live-action realism, realistic pores, photographic lighting artifacts, and CGI rendering."
  },

  ghibli: {
    intro:
      "Studio Ghibli inspired cinematic scene.",

    styleDetails:
      "Hand-painted backgrounds, warm emotional lighting, whimsical natural environments, soft painterly textures, rich environmental storytelling, gentle color palette, dreamlike atmosphere, Miyazaki-inspired composition.",

    restrictions:
      "Avoid photorealism, CGI rendering, comic-book aesthetics, hard shadows, hyper-detailed realism, and artificial digital textures."
  },

  watercolor: {
    intro:
      "Traditional watercolor illustrated scene.",

    styleDetails:
      "Organic watercolor brushwork, soft pigment blending, visible paper texture, delicate color transitions, pastel palette, hand-painted artistic atmosphere, fluid natural edges.",

    restrictions:
      "Avoid CGI rendering, photorealistic textures, sharp digital outlines, cel shading, comic-book rendering, and glossy materials."
  },

  "3d": {
    intro:
      "High-end 3D cinematic scene.",

    styleDetails:
      "Unreal Engine quality, cinematic global illumination, physically based rendering, realistic materials, detailed textures, volumetric lighting, cinematic depth of field, high-end CGI production quality.",

    restrictions:
      "Avoid hand-drawn aesthetics, watercolor textures, manga inking, sketch lines, flat illustration styles, and 2D rendering."
  },
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
  visualSection: string,
): string => {
  const styleKey = data.artStyle.toLowerCase();
  const style =
    STYLE_PRESETS[styleKey] ||
    STYLE_PRESETS.photorealistic;

    return `You are a world-class cinematic storyteller and AI image prompt engineer.

    Generate a visually cinematic ${data.storyLength || 6}-page story in strict JSON format.

    INPUT:
    - Story template: ${data.template}
    - Art style: ${data.artStyle}
    - Narrative tone: ${data.narration || 'cinematic and emotional'}

    STORY CONTEXT:
    ${details}${visualSection}

    STYLE:
    ${style.intro}

    STYLE DETAILS:
    ${style.styleDetails}

    RESTRICTIONS:
    ${style.restrictions}

    RULES:
    - Return ONLY valid JSON
    - No markdown or explanations
    - Generate EXACTLY ${data.storyLength || 6} pages
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
    - Page secondlast: progression, conflict, emotion
    - Page last: emotional resolution 

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
    RESTRICTIONS:
    ${style.restrictions}"

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
  visualSection: string,
): string => {

  const styleKey = data.artStyle.toLowerCase();
  const style =
    STYLE_PRESETS[styleKey] ||
    STYLE_PRESETS.photorealistic;

  return `
      You are a world-class cinematic storyboard writer and AI image prompt engineer.

      Your task:
      Generate a professional ${data.storyLength || 6}-page visual storyboard in strict JSON format.

      INPUT:
      - Story template: ${data.template || "No template provided"}
      - Art style: ${data.artStyle}
      - Narrative tone: ${data.narration || 'cinematic and emotional'}

      STORY CONTEXT:
      ${details}${visualSection}

      RULES:
      1. Return ONLY valid JSON
      2. No markdown
      3. No code fences
      4. Generate EXACTLY ${data.storyLength || 6} pages
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
      RESTRICTIONS: ${style.restrictions}"

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
      - Pages 2-secondlast develop emotional progression and conflict
      - Page last delivers meaningful emotional resolution
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

const buildMangaPrompt = (
  data: GenerateStoryInput,
  details: string,
  visualSection: string,
): string => {
  const styleKey = data.artStyle.toLowerCase();
  const style =
    STYLE_PRESETS[styleKey] ||
    STYLE_PRESETS.photorealistic;
  return `
You are a master seinen manga storyteller and AI image prompt engineer.
Generate a professional ${data.storyLength || 6}-page cinematic seinen manga storyboard in strict JSON format.

INPUT:
- Story template: ${data.template}
- Art style: ${data.artStyle}

STORY CONTEXT:
${details}${visualSection}

STYLE:
${style.intro}

STYLE DETAILS:
${style.styleDetails}

NEGATIVE PROMPT:
${style.negative}

RULES:
- Return ONLY valid JSON
- No markdown or explanations
- Generate EXACTLY ${data.storyLength || 6} pages
- Output ONLY imagePrompt
- Maintain character, environment, and visual consistency
- Follow authentic seinen manga pacing and panel flow
- Adapt completely to the requested art style
- Keep imagePrompt under 220 words
- Avoid incompatible visual aesthetics

MANGA STRUCTURE:
- 3-5 cinematic panels per page
- Mix establishing shots, close-ups, reaction shots, and dynamic angles
- Use larger panels for emotional or dramatic moments
- Use smaller panels for tension, silence, and pacing
- Include speech bubbles, narration boxes, SFX, internal monologue, and silent panels when appropriate

DIALOGUE RULES:
- Natural and emotionally restrained
- Maximum 10 words per speech bubble
- Short reflective narration boxes
- Use silence strategically
- SFX only during action or tension

VISUAL LANGUAGE:
- cinematic framing
- atmospheric composition
- dramatic shadows
- expressive emotions
- environmental storytelling
- dynamic perspective
- authentic serialized manga pacing

IMAGE PROMPT FORMAT:
"${style.intro} cinematic seinen manga page with clean multi-panel composition. Panel 1: [scene setup and atmosphere], narration box: '[short narration if needed]'. Panel 2: [interaction, reaction, or emotional focus], speech bubble: '[short dialogue if needed]'. Panel 3: [action, tension, or dramatic moment], dynamic framing, SFX: '[single-word sound effect if needed]'. Panel 4: [emotional close-up, silence, or transition], silent panel or internal monologue: '[short thought if needed]'. Atmospheric storytelling, cinematic pacing, dramatic composition, ${style.styleDetails}, negative prompt: ${style.negative}"

JSON FORMAT:
{
  "title": "",
  "subtitle": "",
  "pages": [
    {
      "page": 1,
      "imagePrompt": ""
    },
  ]
}
   `};
// ── MAIN FUNCTION ─────────────────────────────────────────
// export const generateStory = async (
//   data: GenerateStoryInput
// ): Promise<any> => {

//   const details = buildDetails(
//     data.questionnaire,
//     data.storytext
//   );

//   // const characterSection = buildCharacterContext(
//   //   data.images || []
//   // );

//   // const imageUrls = extractImageUrls(
//   //   data.images || []
//   // );
//   let prompt: string;
//   switch (data.storyStyle.toLowerCase()) {
//     case 'manga':
//       prompt = buildMangaPrompt(data, details, buildVisualDescriptionSection(
//         await extractAllImageDescriptions(
//           data.images || []
//         )
//       ));
//       break;
//     case 'comic':
//       prompt = buildComicPrompt(data, details, buildVisualDescriptionSection(
//         await extractAllImageDescriptions(
//           data.images || []
//         )
//       ));
//       break;
//     case 'storybook':
//     default:
//       prompt = buildStoryBookPrompt(data, details, buildVisualDescriptionSection(
//         await extractAllImageDescriptions(
//           data.images || []
//         )
//       ));
//       break;
//   }

//   // const prompt = buildComicPrompt(
//   //   data,
//   //   details,
//   // );

//   // const contents = buildContents(
//   //   prompt,
//   //   imageUrls
//   // );

//   const MODELS = [
//     'gemini-2.5-flash',
//     'gemini-2.5-pro'
//   ];

//   let lastError: any = null;

//   for (const model of MODELS) {
//     for (let attempt = 0; attempt < 3; attempt++) {

//       try {

//         console.log(
//           `Trying model: ${model}, attempt: ${attempt + 1}`
//         );

//         const response =
//           await genAI.models.generateContent({
//             model,
//             contents: [prompt],
//             config: {
//               temperature: 0.7
//             }
//           });

//         const text =
//           response.candidates?.[0]?.content?.parts?.[0]?.text || '';

//         const cleaned =
//           text.replace(/```json|```/g, '').trim();

//         const parsed = JSON.parse(cleaned);

//         if (
//           !parsed.pages ||
//           parsed.pages.length < 6
//         ) {
//           throw new Error(
//             'Incomplete story generated'
//           );
//         }
//         console.log(
//           `Avishek Story generated successfully with ${model}`
//         );

//         return {
//           ...parsed,
//           style: data.artStyle
//         };

//       } catch (error: any) {

//         console.error(
//           `Model ${model} attempt ${attempt + 1} failed:`,
//           error.message
//         );

//         lastError = error;

//         if (
//           error.message?.includes('401') ||
//           error.message?.includes('403') ||
//           error.message?.includes('400')
//         ) {
//           throw new ApiError(
//             error.statusCode || 500,
//             error.message
//           );
//         }

//         if (attempt < 2) {

//           const waitTime =
//             1000 * Math.pow(2, attempt);

//           console.log(
//             `Waiting ${waitTime}ms before retry...`
//           );

//           await new Promise(r =>
//             setTimeout(r, waitTime)
//           );
//         }
//       }
//     }
//   }

//   throw (
//     lastError ||
//     new ApiError(
//       500,
//       'All attempts failed.'
//     )
//   );
  
  

  
// };


export const generateStory = async (
  data: GenerateStoryInput
): Promise<any> => {

  const styleKey = data.artStyle.toLowerCase();
  const style    = STYLE_PRESETS[styleKey] || STYLE_PRESETS.photorealistic;
  const details  = buildDetails(data.questionnaire, data.storytext);

  try {

    // ── Phase 1: Character Visual Analysis ────────────────
    console.log('Phase 1: Running character visual analysis...');

    const descriptions         = await extractAllImageDescriptions(data.images || []);
    const combinedFormulasString = buildVisualDescriptionSection(descriptions);

    console.log('Phase 1 complete. Visual descriptions ready:\n', combinedFormulasString);

    // ── Phase 2: Storyboard Director ──────────────────────
    // only runs after Phase 1 completes — result passed directly
    console.log('Phase 2: Executing Storyboard Director...');

    const dynamicDirectorInstructions = getInstructionsByStyle(
      data,
      combinedFormulasString,   // ← Phase 1 result injected here
      style,
      data.storytext
    );

    const response = await genAI.models.generateContent({
      model:    'gemini-2.5-pro',
      contents: `
        THIS REQUEST
        Template:       ${data.template   || 'Not provided'}
        Art style:      ${data.artStyle   || 'cinematic'}
        Narrative tone: ${data.narration  || 'cinematic and emotional'}
        Total pages:    ${data.storyLength || 6}

        STORY CONTEXT
        ${details}

        CHARACTER VISUAL FORMULAS (UNCHANGEABLE)
        ${combinedFormulasString || 'No character photos provided — invent consistent characters.'}

        ART STYLE DETAILS
        Style details:    ${style.styleDetails  || data.artStyle}
        Restrictions:     ${style.restrictions  || 'None'}
      `,
      config: {
        systemInstruction: dynamicDirectorInstructions,
        temperature:       0.3,
        responseMimeType:  'application/json',
        responseSchema:    StrictUserSchema,
      }
    });

    if (!response.text) throw new Error('Empty response from Director model.');

    console.log('Phase 2 complete. Story generated successfully.');
    return JSON.parse(response.text);

  } catch (err) {
    console.error('Error in generateStory:', err);
    throw err;
  }
};