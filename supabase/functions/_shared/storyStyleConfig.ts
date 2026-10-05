// One look per story style: the writer picks a layout per page from its style's menu, the server
// turns the layout and panels into the illustrator's prompt (so layout geometry is never paraphrased).

export interface Layout { id: string; panels: number; geometry: string; bestFor: string }
export interface Panel { cast: string; shot: string; action: string; caption: string; dialogue: string; sfx: string }
interface Style {
  art: string;       // the look, described as a medium (never a studio name)
  avoid: string;
  sheet: string;     // how the character sheet is drawn; the sheet anchors every page
  size: string;
  textInImage: boolean;
  rules: string;     // writer rules for this style
  layouts: Layout[];
}

const STYLES: Record<string, Style> = {
  storybook: {
    art: `Still frame from a hand-drawn 2D Japanese animated feature film (1990s cel animation).
Characters are cel-painted with thin, clean dark-brown ink outlines, flat colour with a single soft shadow tone,
simplified friendly faces (small nose, simple mouth, expressive eyes) and natural proportions.
Backgrounds are lush hand-painted gouache and watercolour scenery with visible brush texture, towering cumulus
clouds, rich greens and blues, warm sunlight and gentle everyday detail. Soft, warm, nostalgic and whimsical.`,
    avoid: 'photograph, photorealistic skin or pores, 3D render, CGI, glossy surfaces, HDR, lens blur or bokeh, comic halftone, heavy black outlines',
    sheet: 'a hand-drawn 2D animation character model: thin clean ink outline, flat cel colour with one soft shadow tone, simplified drawn features, never photographic',
    size: '1024x1024',
    textInImage: false,
    rules: `STORYBOOK PAGES
- One painting per page: every layout has exactly 1 panel. No panels, grids, borders (except "framed"), speech bubbles or text in the image.
- "text" is printed below the picture: 40-60 words, 3-4 sentences, warm and simple.
- caption, dialogue and sfx are always "".`,
    layouts: [
      { id: 'full-bleed', panels: 1, geometry: 'A single scene filling the whole frame edge to edge, clear foreground, middle ground and background.', bestFor: 'most pages' },
      { id: 'vignette', panels: 1, geometry: 'A single scene painted in the middle of the frame whose edges fade softly into plain cream paper, no hard border.', bestFor: 'quiet, intimate or reflective moments' },
      { id: 'panorama', panels: 1, geometry: 'A wide landscape with a big open sky taking most of the frame; the characters are small within it.', bestFor: 'arriving somewhere, travel, wonder' },
      { id: 'close-moment', panels: 1, geometry: 'Close framing on the characters\' faces and hands, the background soft and simple.', bestFor: 'the emotional peak, a feeling between characters' },
      { id: 'framed', panels: 1, geometry: 'A single scene inside a thin hand-drawn decorative border of leaves and flowers on cream paper.', bestFor: 'the opening and ending pages' },
    ],
  },

  manga: {
    art: `Black-and-white Japanese manga page with a printed-page look: crisp G-pen ink lines of varied weight,
solid black fills, grey screentone dot shading, hatching for shadows, speed lines and impact lines for motion,
expressive manga faces and detailed inked backgrounds. Pure black ink on white paper.`,
    avoid: 'colour, grey watercolour washes, photograph, photorealism, 3D render, western comic style',
    sheet: 'a black-and-white manga character design: crisp ink lines, screentone shading, no colour, never photographic',
    size: '1024x1536',
    textInImage: true,
    rules: `MANGA PAGES (read RIGHT TO LEFT, top to bottom; panels are listed in that reading order)
- "text" is always "": the story lives inside the page.
- caption: narration box text for this panel, at most 12 words, or "". Spread the page's narration over 1-2 panels.
- dialogue: "Name: words" for a speech bubble, at most 8 words, or "". Use silent panels too.
- sfx: one sound-effect word drawn into the art (e.g. "DOKI", "WHOOSH", "SLAM"), only for action, or "".
- Every word must be spelled correctly and read naturally.`,
    layouts: [
      { id: 'yonkoma', panels: 4, geometry: 'Four equal full-width panels stacked top to bottom.', bestFor: 'comedy, everyday beats, setup and punchline' },
      { id: 'three-tier', panels: 4, geometry: 'Tier 1: one wide establishing panel across the top. Tier 2: two panels side by side (panel 2 on the right, panel 3 on the left). Tier 3: one wide panel across the bottom.', bestFor: 'default storytelling page' },
      { id: 'staggered-five', panels: 5, geometry: 'Top row: two panels (panel 1 right, panel 2 left). Middle: one wide panel. Bottom row: two panels (panel 4 right, panel 5 left).', bestFor: 'conversation and back-and-forth' },
      { id: 'tall-column', panels: 4, geometry: 'Panel 1 is a tall panel running the full height of the right third of the page. Panels 2, 3 and 4 are stacked top to bottom in the left two thirds.', bestFor: 'a character entrance or reveal' },
      { id: 'diagonal', panels: 3, geometry: 'Three panels separated by steep slanted gutters that cut diagonally across the page, from top right to bottom left.', bestFor: 'action, a chase, sudden movement' },
      { id: 'broken-border', panels: 3, geometry: 'Three stacked panels; the main character of panel 2 is drawn large and breaks out over the panel borders into the gutters.', bestFor: 'an emotional peak or moment of determination' },
      { id: 'splash-inset', panels: 2, geometry: 'Panel 1 fills almost the whole page. Panel 2 is a small inset panel with a thick white border overlapping its bottom-left corner.', bestFor: 'a big moment with a reaction' },
      { id: 'eye-strip', panels: 3, geometry: 'Panel 1: a large panel across the top half. Panel 2: a thin full-width strip with an extreme close-up of eyes. Panel 3: a large panel across the bottom.', bestFor: 'tension, a realisation' },
      { id: 'full-splash', panels: 1, geometry: 'One single panel filling the entire page.', bestFor: 'the climax (at most once per book)' },
    ],
  },

  comic: {
    art: `Modern American comic-book page: bold confident black ink outlines with varied line weight, flat cel
colours with hard-edged shadows, subtle Ben-Day halftone dots in the midtones, dynamic poses and strong silhouettes,
vivid saturated palette and detailed inked backgrounds.`,
    avoid: 'photograph, photorealism, 3D render, soft painterly blending, manga screentones, washed-out colour',
    sheet: 'an American comic-book character design: bold ink outlines, flat colours with hard-edged shadows, never photographic',
    size: '1024x1536',
    textInImage: true,
    rules: `COMIC PAGES (read left to right, top to bottom; panels are listed in that reading order)
- "text" is always "": the story lives inside the page.
- caption: narration in a yellow rectangular caption box, at most 15 words, or "". Spread the page's narration over 1-2 panels.
- dialogue: "Name: words" for a rounded speech balloon (jagged for shouting), at most 10 words, or "".
- sfx: one stylized sound-effect word integrated into the action (e.g. "BOOM", "CRACK", "WHOOSH"), or "".
- Every word must be spelled correctly, grammatical and natural. No placeholder text.`,
    layouts: [
      { id: 'grid-six', panels: 6, geometry: 'A classic grid of six equal panels: two across, three rows down.', bestFor: 'steady narration and dialogue' },
      { id: 'grid-four', panels: 4, geometry: 'Four equal panels in a 2x2 grid.', bestFor: 'a simple sequence' },
      { id: 'nine-grid', panels: 9, geometry: 'Nine small equal panels in a 3x3 grid.', bestFor: 'time passing, rhythm, a montage' },
      { id: 'widescreen', panels: 3, geometry: 'Three full-width horizontal letterbox panels stacked top to bottom.', bestFor: 'cinematic travel and landscapes' },
      { id: 'banner-top', panels: 4, geometry: 'Panel 1: a big establishing panel across the top half. Panels 2, 3 and 4: three equal panels side by side across the bottom half.', bestFor: 'opening a new scene' },
      { id: 'z-path', panels: 4, geometry: 'Panel 1: wide panel across the top. Panels 2 and 3: two panels side by side in the middle. Panel 4: wide panel across the bottom.', bestFor: 'cause and effect' },
      { id: 'hero-left', panels: 3, geometry: 'Panel 1: a big panel filling the left two thirds, full height. Panels 2 and 3: stacked on the right third.', bestFor: 'a hero moment with reactions' },
      { id: 'tall-columns', panels: 3, geometry: 'Three tall full-height panels side by side.', bestFor: 'movement, a before/during/after beat' },
      { id: 'splash-inset', panels: 2, geometry: 'Panel 1 fills the whole page. Panel 2 is a small inset panel with a thick white border in the bottom-right corner.', bestFor: 'the climax with a reaction' },
      { id: 'splash', panels: 1, geometry: 'One single panel filling the entire page.', bestFor: 'the climax (at most once per book)' },
    ],
  },
};

export const styleFor = (storyStyle: string) => STYLES[storyStyle?.toLowerCase()] || STYLES.storybook;

const BASE = `You are the writer and art director of a personalised illustrated book starring real people from
the reader's photos. You write the story and plan every page for an illustrator, in strict JSON.

OUTPUT
- Only valid JSON matching the schema. No markdown, no commentary.

CAST
- Define every named character once in "characters" (name and a fixed appearance and outfit).
- Characters with photos keep their exact supplied names; never rename them or add a second character for the same person.
- Never change a character's appearance between pages, and never blend two characters' traits.

STORY ARC (any page count)
- First page: establish the world and characters and hook the reader.
- First half: develop the story, build the emotional connection and rising tension.
- Around three quarters in: the turning point or climax.
- Last page: resolve with warmth, hope or meaningful closure.
- One continuous narrative: no scene resets, no repeated scenes.

PANELS
For each page pick a "layout" from the menu, then write exactly that many panels in reading order. Each panel:
- cast: the exact names of the named characters visible in this panel, comma-separated, or "".
- shot: the camera framing (establishing wide, medium, close-up, extreme close-up, over-the-shoulder, low angle, high angle, bird's-eye).
- action: what happens, specific and vivid: the action, setting, time of day, lighting and mood, 15-35 words.
  Refer to characters by name only; never describe their face, hair, body or clothing: the illustrator has
  their photos, and extra description makes faces drift. Background people are strangers of varied ages, builds and looks.
- caption, dialogue, sfx: as the style rules below say.

LAYOUT CHOICE
- Match each page's layout to its beat using "best for".
- Never use the previous page's layout again; vary layouts across the book.
- Use a single-panel layout at most once, for the climax (storybook pages are always single paintings).
- Vary the shots inside a page: mix wide, medium and close-up.

PROPS WITH TEXT
- Never leave a phone, calendar, sign, cake or note's text to the illustrator: say it is blank or unreadable.

NEVER
- Generic actions like "a person standing", extra limbs, watermarks.`;

export const directorInstructions = (style: Style) => `${BASE}

${style.rules}

LAYOUT MENU (id, panels: best for)
${style.layouts.map(layout => `- ${layout.id} (${layout.panels}): ${layout.bestFor}`).join('\n')}`;

// The chosen layout, or the biggest layout that fits the panels written, so geometry and panels always agree.
export function fitLayout(style: Style, id: string, panels: Panel[]) {
  const chosen = style.layouts.find(layout => layout.id === id);
  if (chosen && chosen.panels === panels.length) return { layout: chosen, panels };
  const layout = style.layouts.filter(l => l.panels <= panels.length).sort((a, b) => b.panels - a.panels)[0];
  if (!layout) throw new Error('A page came back without panels. Please retry.');
  return { layout, panels: panels.slice(0, layout.panels) };
}

const describePanel = (style: Style, panel: Panel, index: number, single: boolean) => {
  const parts = [`${panel.shot}. ${panel.action}`, `Characters: ${panel.cast || 'no named characters'}.`];
  if (style.textInImage) {
    if (panel.caption) parts.push(`Narration box: "${panel.caption}".`);
    if (panel.dialogue) parts.push(`Speech bubble pointing at the speaker: "${panel.dialogue}" (the name before the colon is the speaker, not part of the bubble).`);
    if (panel.sfx) parts.push(`Sound effect drawn into the art: "${panel.sfx}".`);
  }
  return single ? parts.join(' ') : `PANEL ${index + 1}: ${parts.join(' ')}`;
};

export function buildImagePrompt(style: Style, layoutId: string, rawPanels: Panel[]) {
  const { layout, panels } = fitLayout(style, layoutId, rawPanels);
  const single = panels.length === 1;
  const text = style.textInImage
    ? 'Render only the quoted narration, speech and sound-effect text above, spelled exactly; no other letters anywhere.'
    : 'No text, letters, speech bubbles or panels anywhere in the image.';
  return `PAGE LAYOUT: ${layout.geometry}${single ? '' : ' Clean white gutters between panels.'}

${panels.map((panel, i) => describePanel(style, panel, i, single)).join('\n')}

${text} No watermarks, no distorted faces.`;
}

// Strict schema: the layout is an enum of this style's menu.
const obj = (properties: Record<string, object>) =>
  ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const str = { type: 'string' };
export const storyboardSchema = (style: Style) => obj({
  title: str,
  subtitle: str,
  characters: { type: 'array', items: obj({ name: str, appearance: str }) },
  pages: { type: 'array', items: obj({
    page: { type: 'integer' },
    text: { type: 'string', description: 'the story text printed below the picture' },
    layout: { type: 'string', enum: style.layouts.map(layout => layout.id) },
    panels: { type: 'array', items: obj({ cast: str, shot: str, action: str, caption: str, dialogue: str, sfx: str }) },
  }) },
});
