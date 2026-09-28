import { generateStory, stylePreset } from './storyService';
import { createCharacterSheet, transformImage } from './imageService';
import { CharacterReference } from './characterReferences';
import { ApiError } from '../utils/ApiError';

export interface StoryRequest {
  template: string;
  questionnaire: Record<string, string>;
  artStyle: string;
  narration: string;
  storytext: string;
  storyStyle: string;
  storyLength: any;
}

// The full generation flow shared by the API route and the test harness.
export async function createStory(input: StoryRequest, references: CharacterReference[]) {
  // ── Step 1: Story text + image prompts, and one character sheet per person, in parallel ──
  console.log(`Generating ${input.storyStyle} story...`);
  const names = [...new Set(references.map(reference => reference.characterName))];
  const [story, sheets] = await Promise.all([
    generateStory({ ...input, images: references }),
    Promise.all(names.map(name => createCharacterSheet(
      name, references.filter(reference => reference.characterName === name), stylePreset(input.artStyle)))),
  ]);
  console.log('Story generated successfully');
  console.log(story);
  const pageReferences: CharacterReference[] = [
    ...references,
    ...sheets.map((image, i) => ({ image, characterName: names[i], description: '', kind: 'sheet' as const })),
  ];

  // ── Step 2: Generate one image per page from imagePrompt ──
  console.log(`Generating images for ${story.pages.length} pages...`);

  // Wait for every page to settle before releasing the generation lock.
  const pageResults = await Promise.allSettled(
    story.pages.map(async (page: any) => {
      if (typeof page.imagePrompt !== 'string' || !page.imagePrompt.trim()) {
        throw new Error(`Missing illustration prompt for page ${page.page}`);
      }
      const response = await transformImage(pageReferences, story.characterContext, page.imagePrompt, page.page);
      if (!response?.success || !response.imageUrl) throw new Error(`Image failed for page ${page.page}`);

      return {
        page:     page.page,
        text:     page.text || '',
        imageUrl: response.imageUrl,
      };
    })
  );
  const failedPages = pageResults.flatMap((result, index) => result.status === 'rejected' ? [story.pages[index].page] : []);
  if (failedPages.length) {
    throw new ApiError(502, `Illustration generation failed for pages ${failedPages.join(', ')}. Please retry; no substitute images were used.`);
  }

  return {
    title:    story.title,
    subtitle: story.subtitle,
    style:    input.storyStyle,
    pages:    pageResults.flatMap(result => result.status === 'fulfilled' ? [result.value] : []),
  };
}
