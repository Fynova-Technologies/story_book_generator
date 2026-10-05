import { generateStory } from './storyService.ts';
import { styleFor } from './storyStyleConfig.ts';
import { createCharacterSheet, transformImage } from './imageService.ts';
import { CharacterReference } from './characterReferences.ts';
import { ApiError } from './ApiError.ts';

export interface StoryRequest {
  template: string;
  questionnaire: Record<string, string>;
  narration: string;
  storytext: string;
  storyStyle: string;
  storyLength: any;
}

export interface PlannedPage {
  page: number;
  text: string;
  imagePrompt: string;
}

// Step 1: story text + image prompts, and one character sheet per person, in parallel.
// References are expected at most 1024px on the longest side (resized before upload).
export async function planStory(input: StoryRequest, references: CharacterReference[]) {
  console.log(`Generating ${input.storyStyle} story...`);
  const names = [...new Set(references.map(reference => reference.characterName))];
  const [story, sheets] = await Promise.all([
    generateStory({ ...input, images: references }),
    Promise.all(names.map(name => createCharacterSheet(
      name, references.filter(reference => reference.characterName === name), styleFor(input.storyStyle)))),
  ]);
  const pages: PlannedPage[] = story.pages.map((page: any) => {
    if (typeof page.imagePrompt !== 'string' || !page.imagePrompt.trim()) {
      throw new ApiError(502, 'The story came back without illustration prompts. Please try again.');
    }
    return { page: page.page, text: page.text || '', imagePrompt: page.imagePrompt };
  });
  return {
    title:            story.title as string,
    subtitle:         story.subtitle as string,
    characterContext: story.characterContext as string,
    pages,
    sheets:           sheets.map((image, i) => ({ image, characterName: names[i], description: '', kind: 'sheet' as const })),
  };
}

// Step 2: one illustration per page, from the photos plus the character sheets.
export async function illustratePage(references: CharacterReference[], characterContext: string, page: PlannedPage, storyStyle: string) {
  const { imageUrl } = await transformImage(references, characterContext, page.imagePrompt, styleFor(storyStyle), page.page);
  return imageUrl;
}

// The whole flow in one process, for the test harness. The Edge Functions run the two steps separately.
export async function createStory(input: StoryRequest, references: CharacterReference[]) {
  const plan = await planStory(input, references);
  const pageReferences = [...references, ...plan.sheets];
  console.log(`Generating images for ${plan.pages.length} pages...`);
  const pageResults = await Promise.allSettled(plan.pages.map(async page =>
    ({ page: page.page, text: page.text, imageUrl: await illustratePage(pageReferences, plan.characterContext, page, input.storyStyle) })));
  const failedPages = pageResults.flatMap((result, index) => result.status === 'rejected' ? [plan.pages[index].page] : []);
  if (failedPages.length) {
    throw new ApiError(502, `Illustration generation failed for pages ${failedPages.join(', ')}. Please retry; no substitute images were used.`);
  }
  return {
    title:    plan.title,
    subtitle: plan.subtitle,
    style:    input.storyStyle,
    pages:    pageResults.flatMap(result => result.status === 'fulfilled' ? [result.value] : []),
  };
}
