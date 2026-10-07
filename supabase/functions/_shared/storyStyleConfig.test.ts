// deno test supabase/functions/_shared/storyStyleConfig.test.ts
import assert from 'node:assert/strict';
import { buildImagePrompt, fitLayout, styleFor } from './storyStyleConfig.ts';

const panel = (n: number) => ({ cast: 'Arjun', shot: 'medium', action: `beat ${n}`, emotion: `Arjun: furious, extreme`, caption: `caption ${n}`, dialogue: '', sfx: '' });
const panels = (count: number) => Array.from({ length: count }, (_, i) => panel(i + 1));

Deno.test('fitLayout keeps a matching layout and falls back to the biggest that fits', () => {
  const manga = styleFor('Manga');
  assert.equal(fitLayout(manga, 'yonkoma', panels(4)).layout.id, 'yonkoma');
  const fallback = fitLayout(manga, 'yonkoma', panels(7)); // too many panels: biggest manga layout is 5
  assert.equal(fallback.layout.panels, 5);
  assert.equal(fallback.panels.length, 5);
  assert.equal(fitLayout(manga, 'nope', panels(1)).layout.id, 'full-splash');
  assert.throws(() => fitLayout(manga, 'yonkoma', []));
});

Deno.test('every style can place a single panel, and unknown styles are storybook', () => {
  for (const name of ['storybook', 'manga', 'comic']) assert.ok(styleFor(name).layouts.some(l => l.panels === 1));
  assert.equal(styleFor('Ghibli'), styleFor('storybook'));
});

Deno.test('text only goes in the image for manga and comic', () => {
  assert.match(buildImagePrompt(styleFor('comic'), 'grid-four', panels(4)), /PANEL 4: .*Narration box: "caption 4"/);
  const storybook = buildImagePrompt(styleFor('storybook'), 'full-bleed', panels(1));
  assert.doesNotMatch(storybook, /Narration box|PANEL/);
  assert.match(storybook, /No text/);
});

Deno.test('every style passes each panel emotion to the illustrator', () => {
  for (const name of ['storybook', 'manga', 'comic']) {
    const style = styleFor(name);
    assert.ok(style.emotion);
    assert.match(buildImagePrompt(style, style.layouts[0].id, panels(style.layouts[0].panels)), /Emotion: Arjun: furious, extreme\./);
  }
});

Deno.test('speech bubbles quote only the words, never the speaker name', () => {
  const prompt = buildImagePrompt(styleFor('manga'), 'full-splash', [{ ...panel(1), dialogue: 'Arjun: You forgot to charge it!' }]);
  assert.match(prompt, /tail pointing at Arjun: "You forgot to charge it!"/);
  assert.doesNotMatch(prompt, /"Arjun:/);
});
