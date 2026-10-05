// POST { template, questions, characters } with the user's JWT. Replies { answers } with what the
// character notes answer, plus suggestions for the rest. One text call, no credits spent.
import { ApiError } from '../_shared/ApiError.ts';
import { body, json, requireUser, serve } from '../_shared/server.ts';
import { PrefillCharacter, PrefillQuestion, prefillQuestionnaire } from '../_shared/questionnairePrefill.ts';

const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

serve(async req => {
  await requireUser(req);
  const input = await body<{ template?: unknown; questions?: unknown; characters?: unknown }>(req);
  if (!Array.isArray(input.questions) || !Array.isArray(input.characters)) throw new ApiError(400, 'Invalid request.');
  if (input.questions.length > 25 || input.characters.length > 5) throw new ApiError(400, 'Invalid request.');

  const questions: PrefillQuestion[] = input.questions.map((q: any) => ({
    id: Number(q?.id) || 0, question: text(q?.question, 300), type: text(q?.type, 20),
  }));
  const characters: PrefillCharacter[] = input.characters
    .map((c: any) => ({ name: text(c?.name, 100), description: text(c?.description, 2000) }))
    .filter(c => c.name);

  return json(200, { answers: await prefillQuestionnaire(text(input.template, 100), questions, characters) });
});
