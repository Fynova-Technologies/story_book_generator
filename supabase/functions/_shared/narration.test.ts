// deno test supabase/functions/_shared/narration.test.ts
import assert from 'node:assert/strict';
import { narrationScript } from './narration.ts';

const panel = (caption: string, dialogue: string) => ({ cast: '', shot: '', action: '', emotion: '', caption, dialogue, sfx: '' });

Deno.test('storybook pages read their printed text', () => {
  assert.equal(narrationScript({ text: ' Once upon a time. ', panels: [panel('ignored', '')] }), 'Once upon a time.');
});

Deno.test('comic pages read captions and speech in panel order, skipping grawlixes', () => {
  assert.equal(narrationScript({ text: '', panels: [panel('Night fell.', 'Dev: Run!'), panel('', 'Arjun: #@$%!'), panel('', 'Hello')] }),
    'Night fell. Dev: "Run!" "Hello"');
});
