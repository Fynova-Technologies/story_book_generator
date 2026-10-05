// deno test supabase/functions/_shared/questionnairePrefill.test.ts
import assert from 'node:assert/strict';
import { cleanAnswers } from './questionnairePrefill.ts';

const questions = [1, 2, 3].map(id => ({ id, question: `q${id}`, type: 'text' }));

Deno.test('cleanAnswers returns one entry per question, dropping unknown ids and padding missing ones', () => {
  const out = cleanAnswers([
    { id: 1, answer: '  Maya ', suggestions: ['ignored'] },
    { id: 2, answer: '   ', suggestions: [' a ', '', 'b', 'c', 'd', 'e'] },
    { id: 9, answer: 'stray', suggestions: [] },
  ], questions);
  assert.deepEqual(out, [
    { id: 1, answer: 'Maya', suggestions: [] },
    { id: 2, answer: null, suggestions: ['a', 'b', 'c', 'd'] },
    { id: 3, answer: null, suggestions: [] },
  ]);
});

Deno.test('cleanAnswers keeps the number in an age and drops dates the input cannot show', () => {
  const typed = [
    { id: 1, question: 'age', type: 'number' }, { id: 2, question: 'age', type: 'number' },
    { id: 3, question: 'day', type: 'date' }, { id: 4, question: 'day', type: 'date' },
  ];
  const out = cleanAnswers([
    { id: 1, answer: '21', suggestions: [] }, { id: 2, answer: '21 years old', suggestions: [] },
    { id: 3, answer: '2026-10-16', suggestions: [] }, { id: 4, answer: '16th of Oct', suggestions: [] },
  ], typed);
  assert.deepEqual(out.map(a => a.answer), ['21', '21', '2026-10-16', null]);
});
