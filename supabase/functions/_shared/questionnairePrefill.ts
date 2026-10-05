// Answers a template questionnaire from what the user wrote about each character on the upload step,
// and suggests short answers for the questions the notes don't cover.
import { respond } from './openai.ts';
import { trace } from './trace.ts';

const MODEL = 'gpt-6-luna';

export interface PrefillQuestion { id: number; question: string; type: string }
export interface PrefillCharacter { name: string; description: string }
export interface PrefillAnswer { id: number; answer: string | null; suggestions: string[] }

const schema = {
  name: 'questionnaire_prefill',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['answers'],
    properties: {
      answers: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'answer', 'suggestions'],
          properties: {
            id: { type: 'integer' },
            answer: { type: ['string', 'null'] },
            suggestions: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
};

const instructions = (today: string) => `You help someone fill in a questionnaire for a personalised picture book.
Today is ${today}. You get the book's template, its questions, and the characters the user uploaded
photos of, each with the user's own notes. For EVERY question return one entry:
- answer: when the notes state it OR it follows from them. Work things out like a thoughtful friend
  would: an age from a birth date, the birthday's date from "it's her birthday today", who is
  celebrating from whose notes mention the birthday. Don't make up facts the notes give no basis for:
  those are null. When notes disagree, prefer what they state outright.
  For type "character" answer with the given character names only.
  For type "number" answer with digits only (e.g. "21").
  For type "date" answer as YYYY-MM-DD. A birthday's date is this year's unless the notes say otherwise.
- suggestions: when answer is null and the type is "text" or "textarea", 2 to 4 short, concrete
  answers the user could pick, fitting the template and the characters. Otherwise [].`;

export async function prefillQuestionnaire(template: string, questions: PrefillQuestion[], characters: PrefillCharacter[]) {
  const content = JSON.stringify({ template, questions, characters });
  const started = Date.now();
  const response = await respond({ model: MODEL, effort: 'medium', instructions: instructions(new Date().toISOString().slice(0, 10)), content, schema });
  trace('questionnaire.prefill', { model: MODEL, content, response: response.text, ms: Date.now() - started, usage: response.usage });
  return cleanAnswers(JSON.parse(response.text).answers, questions);
}

// Number and date answers fill <input type="number|date">, which shows nothing for any other format:
// "21 years old" keeps its number, and a date not in YYYY-MM-DD is dropped.
const formatAnswer = (type: string, answer: string | null) => {
  if (!answer) return null;
  if (type === 'number') return answer.match(/\d+/)?.[0] || null;
  if (type === 'date') return /^\d{4}-\d{2}-\d{2}$/.test(answer) ? answer : null;
  return answer;
};

// Keeps one entry per asked question, with trimmed text and at most 4 suggestions.
export function cleanAnswers(raw: PrefillAnswer[], questions: PrefillQuestion[]): PrefillAnswer[] {
  const byId = new Map(raw.map(a => [a.id, a]));
  return questions.map(({ id, type }) => {
    const answer = formatAnswer(type, byId.get(id)?.answer?.trim() || null);
    const suggestions = answer ? [] : (byId.get(id)?.suggestions || []).map(s => s.trim()).filter(Boolean).slice(0, 4);
    return { id, answer, suggestions };
  });
}
