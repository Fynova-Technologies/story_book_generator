import { respond } from './openai.ts';
import { buildImagePrompt, directorInstructions, storyboardSchema, styleFor } from './storyStyleConfig.ts';
import { CharacterReference, referenceParts } from './characterReferences.ts';
import { trace } from './trace.ts';

// ── Types ──────────────────────────────────────────────────
interface GenerateStoryInput {
  template: string;
  questionnaire: Record<string, string>;
  narration: string;
  storyStyle: string;
  storytext: string;
  images?: CharacterReference[];
  storyLength: any;
}
// Temperature is gone: GPT-5 reasoning models don't accept it.
const DESCRIBE_MODEL = 'gpt-6-luna';
const DIRECTOR_MODEL = 'gpt-6-luna';
const EFFORT = 'low';

// ── Extract visual description for ONE image ───────────────
const extractCharacterDescription = async (
  references: CharacterReference[],
  characterName: string,
): Promise<string> => {
  const prompt = `
Analyze these photos of ONE character named ${JSON.stringify(characterName)}.
All photos show the SAME character, not different people. The subject may be human,
an animal or a fictional character. Use the notes only to identify the subject.
Notes: ${JSON.stringify(references.map(reference => reference.description))}
The illustrator also receives these photos, so do not describe the face in general terms.
Output one short identity note (at most 40 words) with only what must never change:
1. Species and visible age range; do not infer ethnicity or other hidden traits
2. The most distinctive features: glasses (shape, frame), facial hair, hairstyle, marks
3. Clothing: exact garment types and colors from the FIRST photo, even if other photos differ

Rule: Output ONLY the raw note. No markdown, no intro, no bullet points.
Example output: "Young adult man; thin rectangular metal glasses; thin mustache and goatee; thick wavy side-swept hair; navy crew-neck T-shirt."
  `;

  try {
    const started = Date.now();
    const response = await respond({
      model:   DESCRIBE_MODEL,
      effort:  EFFORT,
      content: [...referenceParts(references), { type: 'input_text', text: prompt }],
    });

    const description = response.text.trim();
    if (!description) throw new Error('Empty character description');
    trace('character.describe', { characterName, photos: references.length, model: DESCRIBE_MODEL, effort: EFFORT, prompt, description, ms: Date.now() - started, usage: response.usage });
    return description;

  } catch (error) {
    trace('character.describe', { characterName, ok: false, error: String(error) });
    console.error(`Failed to extract visual for ${characterName}:`, error);
    throw new Error(`Could not analyze reference photos for ${characterName}. Please retry.`);
  }
};

// ── Extract descriptions for ALL images in parallel ────────
export const extractAllImageDescriptions = async (
  images: CharacterReference[],
): Promise<Record<string, string>> => {

  const groups = new Map<string, CharacterReference[]>();
  for (const image of images) {
    const group = groups.get(image.characterName) || [];
    group.push(image);
    groups.set(image.characterName, group);
  }

  // ✅ run ALL in parallel — no more sequential for loop
  const results = await Promise.all(
    [...groups].map(async ([name, references]) => {

      // ✅ always extract from image — never skip
      const visual = await extractCharacterDescription(
        references,
        name
      );

      return {
        name,
        visual,
      };
    })
  );

  // build Record<string, string>
  const descriptions: Record<string, string> = Object.create(null);
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


// The user's own notes on each character ("my son, turning 7"), as story facts.
const notesSection = (images: CharacterReference[]) => {
  const notes = [...new Set(images.filter(i => i.description.trim()).map(i => `- ${i.characterName}: ${i.description.trim()}`))];
  return notes.length ? `Notes on the characters:\n${notes.join('\n')}` : '';
};

export const generateStory = async (
  data: GenerateStoryInput
): Promise<any> => {

  const style   = styleFor(data.storyStyle);
  const details = buildDetails(data.questionnaire, data.storytext);

  try {

    // ── Phase 1: Character Visual Analysis ────────────────
    console.log('Phase 1: Running character visual analysis...');

    const descriptions = await extractAllImageDescriptions(data.images || []);
    const combinedFormulasString = buildVisualDescriptionSection(descriptions);

    console.log('Phase 1 complete. Visual descriptions ready:\n', combinedFormulasString);

    // ── Phase 2: Storyboard Director ──────────────────────
    console.log('Phase 2: Executing Storyboard Director...');

    const dynamicDirectorInstructions = directorInstructions(style);

    const directorContents = `
        THIS REQUEST
        Template:       ${data.template   || 'Not provided'}
        Narrative tone: ${data.narration  || 'warm and emotional'}
        Total pages:    ${data.storyLength || 6}

        STORY CONTEXT
        ${details}
        ${notesSection(data.images || [])}

        CHARACTERS WITH PHOTOS (for you only: never copy these descriptions into panels)
        ${combinedFormulasString || 'No character photos provided — invent consistent characters.'}

        Define the complete named cast ONCE in the characters array (name and appearance).
        ${Object.keys(descriptions).length ? `The people in the photos are exactly: ${Object.keys(descriptions).map(n => JSON.stringify(n)).join(', ')}.
        When the story context mentions them (for example as the main or supporting character), it means these people:
        use these exact names, never rename them, and never add a second character for the same person.` : ''}
        Use exactly the supplied names and appearances for characters with photos.
        Define a fixed appearance and outfit for any additional story characters.
        Photos with the same name are alternate views of ONE character.
      `;
    const started = Date.now();
    const response = await respond({
      model:        DIRECTOR_MODEL,
      effort:       EFFORT,
      instructions: dynamicDirectorInstructions,
      content:      directorContents,
      schema:       { name: 'storyboard', schema: storyboardSchema(style) },
    });

    trace('director', { model: DIRECTOR_MODEL, effort: EFFORT, systemInstruction: dynamicDirectorInstructions, contents: directorContents, response: response.text, ms: Date.now() - started, usage: response.usage });
    if (!response.text) throw new Error('Empty response from Director model.');

    console.log('Phase 2 complete. Story generated successfully.');
    const story = JSON.parse(response.text);
    if (!Array.isArray(story.characters) || !Array.isArray(story.pages) || !story.pages.length) {
      throw new Error('Invalid storyboard returned. Please retry.');
    }
    const cast: Record<string, string> = Object.create(null);
    const photoNames = new Set(Object.keys(descriptions).map(n => n.toLowerCase()));
    for (const character of story.characters) {
      if (typeof character.name !== 'string' || !character.name.trim() ||
          typeof character.appearance !== 'string' || !character.appearance.trim()) {
        throw new Error('Invalid character definition returned. Please retry.');
      }
      // Photo characters come from the photos below, never the director's paraphrase.
      if (!photoNames.has(character.name.trim().toLowerCase())) cast[character.name] = character.appearance;
    }
    Object.assign(cast, descriptions);
    const characterContext = buildVisualDescriptionSection(cast);
    trace('cast', { directorCast: story.characters, photoDescriptions: descriptions, characterContext });

    // The server, not the writer, turns layout + panels into the illustrator's prompt.
    const pages = story.pages.map((page: any) => ({
      page:        page.page,
      text:        style.textInImage ? '' : page.text,
      layout:      page.layout,
      imagePrompt: buildImagePrompt(style, page.layout, page.panels || []),
    }));
    trace('pages', { pages });
    return { ...story, pages, characterContext };

  } catch (err) {
    trace('error', { stage: 'generateStory', error: String(err) });
    console.error('Error in generateStory:', err);
    throw err;
  }
};
