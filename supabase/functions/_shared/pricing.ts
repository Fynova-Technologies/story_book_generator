// Credit price of a book. Shared by the generate-story function and the app, so both always agree.
export const MAX_PAGES = 12;
export const BASE_COST = 2;  // writing the story and drawing the character sheets
export const PAGE_COST = 1;
export const DEFAULT_PAGES = 6;

// Narration adds half the page price, but only once narration audio is actually generated.
// ponytail: flip to true when the audio pipeline ships; until then a chosen voice costs nothing.
const NARRATION_LIVE = false;

export const clampPages = (pages: number | null | undefined) => Math.min(MAX_PAGES, Math.max(1, Math.round(pages || DEFAULT_PAGES)));

export const storyCost = (pages: number | null | undefined, narration: boolean) => {
  const pageCredits = clampPages(pages) * PAGE_COST;
  return BASE_COST + pageCredits + (NARRATION_LIVE && narration ? Math.ceil(pageCredits / 2) : 0);
};

// For "≈ N stories" estimates: a default-length book without narration.
export const TYPICAL_STORY_COST = storyCost(DEFAULT_PAGES, false);
