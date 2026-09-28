// Story pipeline test harness. Runs a case through the production flow, records every
// stage, saves outputs under test-runs/, and scores consistency with an OpenAI judge.
//
//   bun run test:story test/story/cases/whatsapp-duo.json   generate + judge
//   bun run test:story --judge test-runs/<run-dir>          re-judge an existing run
// Bun loads .env.local, so OPENAI_API_KEY comes from there.
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { createStory } from '../../src/server/services/storyPipeline';
import { normalizeReferences } from '../../src/server/services/characterReferences';
import { withTrace } from '../../src/server/services/trace';
import { respond, type ContentPart } from '../../src/server/services/openai';

const RUNS = path.resolve(__dirname, '../../test-runs');
const JUDGE_MODEL = process.env.OPENAI_JUDGE_MODEL || 'gpt-5.5';

type Ref = { characterName: string; file: string };
type Page = { page: number; text: string; image: string; imagePrompt: string };

const mime = (file: string) => ({ '.png': 'image/png', '.webp': 'image/webp' } as Record<string, string>)[path.extname(file)] || 'image/jpeg';
const dataUrl = (file: string) => `data:${mime(file)};base64,${fs.readFileSync(file).toString('base64')}`;
const write = (dir: string, name: string, value: unknown) =>
  fs.writeFileSync(path.join(dir, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const read = (dir: string, name: string) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));

async function generate(casePath: string) {
  const testCase = JSON.parse(fs.readFileSync(casePath, 'utf8'));
  const dir = path.join(RUNS, `${new Date().toISOString().replace(/[:.]/g, '-')}-${testCase.name}`);
  fs.mkdirSync(path.join(dir, 'refs'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'pages'));

  const refs: Ref[] = testCase.references.map((r: any, i: number) => {
    const src = path.resolve(path.dirname(casePath), r.photo);
    const file = `refs/${i + 1}-${r.characterName}${path.extname(src)}`;
    fs.copyFileSync(src, path.join(dir, file));
    return { characterName: r.characterName, file };
  });
  const references = normalizeReferences(testCase.references.map((r: any, i: number) =>
    ({ ...r, image: dataUrl(path.join(dir, refs[i].file)) })));
  const request = { storytext: '', storyStyle: 'storybook', ...testCase.request };
  write(dir, 'case.json', testCase);

  const events: { t: number; event: string; [k: string]: unknown }[] = [];
  const started = Date.now();
  const sink = (event: string, data: Record<string, unknown>) => {
    const entry = { t: Date.now() - started, event, ...data };
    events.push(entry);
    fs.appendFileSync(path.join(dir, 'trace.jsonl'), JSON.stringify(entry) + '\n');
  };

  console.log(`Run dir: ${dir}`);
  try {
    const story = await withTrace(sink, () => createStory(request, references));
    const director = events.find(e => e.event === 'director');
    const prompts = new Map<number, string>(JSON.parse(String(director?.response || '{"pages":[]}')).pages
      .map((p: any) => [p.page, p.imagePrompt]));
    const pages: Page[] = story.pages.map(p => {
      const [, type, b64] = /^data:image\/(\w+);base64,(.*)$/.exec(p.imageUrl)!;
      const image = `pages/page-${p.page}.${type === 'jpeg' ? 'jpg' : type}`;
      fs.writeFileSync(path.join(dir, image), Buffer.from(b64, 'base64'));
      return { page: p.page, text: p.text, image, imagePrompt: prompts.get(p.page) || '' };
    });
    write(dir, 'story.json', { title: story.title, subtitle: story.subtitle, style: story.style, ms: Date.now() - started, refs, pages });
    write(dir, 'metrics.json', metrics(events, Date.now() - started));
  } catch (error: any) {
    write(dir, 'error.json', { message: error?.message, statusCode: error?.statusCode, stack: error?.stack, ms: Date.now() - started });
    write(dir, 'metrics.json', metrics(events, Date.now() - started));
    console.error(`Generation failed: ${error?.message}. Trace saved in ${dir}`);
    process.exitCode = 1;
    return;
  }
  await judge(dir);
}

// ── Metrics: time per stage, tokens and estimated cost per model ──
// ponytail: hardcoded list prices (USD per 1M tokens, standard tier, 2026-09); update when models change.
const PRICES: Record<string, { input: number; imageInput?: number; output: number }> = {
  'gpt-5.4-mini': { input: 0.75, output: 4.50 },
  'gpt-5.5':      { input: 5.00, output: 30.00 },
  'gpt-image-2':  { input: 5.00, imageInput: 8.00, output: 30.00 },
  'gpt-6-luna':   { input: 0.10, output: 0.50 },
  'gpt-image-2.5-sunburst': { input: 5.00, imageInput: 8.00, output: 30.00 },
  'gpt-image-2.5-flare':    { input: 5.00, imageInput: 8.00, output: 30.00 },
};

function metrics(events: any[], totalMs: number) {
  const stage = (name: string) => {
    const es = events.filter(e => e.event === name && typeof e.ms === 'number');
    return es.length ? Math.max(...es.map(e => e.t)) - Math.min(...es.map(e => e.t - e.ms)) : 0;
  };
  const models: Record<string, { calls: number; failed: number; ms: number; inputTokens: number; inputImageTokens: number; outputTokens: number; reasoningTokens: number; totalTokens: number; estCostUsd: number }> = {};
  for (const e of events.filter(e => e.model)) {
    const m = models[e.model] ??= { calls: 0, failed: 0, ms: 0, inputTokens: 0, inputImageTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0, estCostUsd: 0 };
    const u = e.usage || {};
    m.calls++;
    m.failed += e.ok === false ? 1 : 0;
    m.ms += e.ms || 0;
    for (const k of ['inputTokens', 'inputImageTokens', 'outputTokens', 'reasoningTokens', 'totalTokens'] as const) m[k] += u[k] || 0;
  }
  for (const [name, m] of Object.entries(models)) {
    const p = PRICES[name];
    // OpenAI output tokens already include reasoning tokens.
    m.estCostUsd = p ? +(((m.inputTokens - m.inputImageTokens) * p.input + m.inputImageTokens * (p.imageInput ?? p.input) + m.outputTokens * p.output) / 1e6).toFixed(4) : NaN;
  }
  const sum = (k: 'totalTokens' | 'estCostUsd') => +Object.values(models).reduce((a, m) => a + m[k], 0).toFixed(4);
  return {
    seconds: {
      total: +(totalMs / 1000).toFixed(1),
      describe: +(stage('character.describe') / 1000).toFixed(1),
      director: +(stage('director') / 1000).toFixed(1),
      images: +(stage('image.attempt') / 1000).toFixed(1),
    },
    imageAttempts: events.filter(e => e.event === 'image.attempt').length,
    failedImageAttempts: events.filter(e => e.event === 'image.attempt' && !e.ok).length,
    totalTokens: sum('totalTokens'),
    estCostUsd: sum('estCostUsd'),
    models,
  };
}

// ── OpenAI judge ─────────────────────────────────────────────
const judgeUsage = { calls: 0, inputTokens: 0, outputTokens: 0 };
async function ask(content: ContentPart[], name: string, schema: object) {
  const { text, usage } = await respond({ model: JUDGE_MODEL, content, schema: { name, schema } });
  judgeUsage.calls++;
  judgeUsage.inputTokens += usage.inputTokens;
  judgeUsage.outputTokens += usage.outputTokens;
  return JSON.parse(text);
}

const obj = (properties: Record<string, object>) =>
  ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const PAGE_SCHEMA = obj({
  characters: { type: 'array', items: obj({
    name: { type: 'string' },
    present: { type: 'boolean' },
    identityScore: { type: 'integer', description: '0-10 likeness to the reference photo; 0 if absent' },
    outfitMatches: { type: 'boolean' },
    notes: { type: 'string' },
  }) },
  duplicateCharacter: { type: 'boolean', description: 'a reference character appears twice in one scene' },
  borrowedFace: { type: 'boolean', description: 'a background/extra person has a reference character\'s face' },
  textInImage: { type: 'boolean' },
  anatomyIssues: { type: 'boolean' },
  promptAdherence: { type: 'integer', description: '0-10' },
  notes: { type: 'string' },
});
// Face identity via local ArcFace embeddings (face_score.py). A drawn face "beats rivals" when it is
// closer to the character's photo than to every look-alike decoy and every other character.
const CASES = path.resolve(__dirname, 'cases');
function faceScore(dir: string, story: any, pages: { page: number; image: string; expected: string[] }[]) {
  const file = path.join(CASES, `${read(dir, 'case.json').name}.json`);
  const decoys = fs.existsSync(file)
    ? (JSON.parse(fs.readFileSync(file, 'utf8')).decoys || []).map((d: string) => path.resolve(CASES, d))
    : [];
  const input = path.join(dir, 'face-input.json');
  write(dir, 'face-input.json', {
    refs: story.refs.map((r: Ref) => ({ name: r.characterName, file: path.join(dir, r.file) })),
    decoys,
    pages: pages.map(p => ({ page: p.page, file: path.join(dir, p.image), expected: p.expected })),
  });
  const result = spawnSync('uv', ['run', '-q', '--python', '3.12', '--with', 'insightface==0.7.3', '--with', 'onnxruntime',
    '--with', 'opencv-python-headless', 'python', path.join(__dirname, 'face_score.py'), input], { encoding: 'utf8', maxBuffer: 1 << 26 });
  fs.rmSync(input);
  if (result.status !== 0) {
    console.warn(`Face scoring skipped: ${result.error?.message || result.stderr.trim().split('\n').pop()}`);
    return null;
  }
  return JSON.parse(result.stdout);
}

const BOOK_SCHEMA = obj({
  characterConsistency: { type: 'array', items: obj({ name: { type: 'string' }, score: { type: 'integer', description: '0-10 same person on every page' }, notes: { type: 'string' } }) },
  styleConsistency: { type: 'integer', description: '0-10 one art style across all pages' },
  notes: { type: 'string' },
});

async function judge(dir: string) {
  const story = read(dir, 'story.json');
  const refs: Ref[] = story.refs;
  const names = [...new Set(refs.map(r => r.characterName))];
  const refParts: ContentPart[] = refs.flatMap(r => [
    { type: 'input_text', text: `Reference photo of ${r.characterName}:` },
    { type: 'input_image', image_url: dataUrl(path.join(dir, r.file)) },
  ]);
  console.log(`Judging ${story.pages.length} pages with ${JUDGE_MODEL}...`);

  const pages = await Promise.all(story.pages.map(async (p: Page) => {
    const verdict = await ask([...refParts,
      { type: 'input_text', text: `Illustration for story page ${p.page}. Its generation prompt was:\n${p.imagePrompt}` },
      { type: 'input_image', image_url: dataUrl(path.join(dir, p.image)) },
      { type: 'input_text', text: `You are a strict QA reviewer for a personalized storybook. The illustration is stylized; judge whether each reference character (${names.join(', ')}) is recognizably the same person as their photo (face shape, hair, facial hair, glasses, skin tone, build), adapted to the art style. Report every reference character, even if absent. Be critical: 10 = unmistakable, 5 = generic lookalike, 0 = absent or different person.` },
    ], 'page_review', PAGE_SCHEMA);
    // Expected cast = reference characters named in the page prompt.
    const expected = names.filter(n => new RegExp(`\\b${n}\\b`, 'i').test(p.imagePrompt));
    return { page: p.page, expected, ...verdict };
  }));

  const book = await ask([...refParts,
    ...story.pages.flatMap((p: Page) => [{ type: 'input_text', text: `Page ${p.page}:` }, { type: 'input_image', image_url: dataUrl(path.join(dir, p.image)) }]),
    { type: 'input_text', text: `Review the whole book. For each of ${names.join(', ')}, is it the same person on every page they appear? Is the art style consistent?` },
  ], 'book_review', BOOK_SCHEMA);

  console.log('Scoring face identity...');
  const faces = faceScore(dir, story, story.pages.map((p: Page, i: number) => ({ ...p, expected: pages[i].expected })));
  const summary = summarize(dir, story, pages, book, names, faces);
  write(dir, 'judge.json', { model: JUDGE_MODEL, usage: judgeUsage, pages, book, faces });
  write(dir, 'summary.json', summary);
  fs.appendFileSync(path.join(RUNS, 'index.jsonl'), JSON.stringify(summary) + '\n');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Results: http://localhost:3000/test-runs/${encodeURIComponent(path.basename(dir))} (with bun run dev)`);
}

function summarize(dir: string, story: any, pages: any[], book: any, names: string[], faces: any) {
  const m = fs.existsSync(path.join(dir, 'metrics.json')) ? read(dir, 'metrics.json') : null;
  const mean = (xs: number[]) => xs.length ? +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2) : null;
  const perChar = (n: string) => pages.map(p => p.characters.find((c: any) => c.name === n)).filter(c => c?.present);
  return {
    run: path.basename(dir),
    judgeModel: JUDGE_MODEL,
    title: story.title,
    pages: pages.length,
    seconds: m?.seconds,
    totalTokens: m?.totalTokens,
    estCostUsd: m?.estCostUsd,
    imageRetries: m ? m.imageAttempts - pages.length : null,
    emptyPageText: story.pages.filter((p: Page) => !p.text.trim()).length,
    identity: Object.fromEntries(names.map(n => [n, mean(perChar(n).map(c => c.identityScore))])),
    outfitMatchRate: Object.fromEntries(names.map(n => [n, mean(perChar(n).map(c => +c.outfitMatches))])),
    crossPageConsistency: Object.fromEntries(book.characterConsistency.map((c: any) => [c.name, c.score])),
    styleConsistency: book.styleConsistency,
    castCorrectPages: pages.filter(p => names.every(n =>
      p.expected.includes(n) === !!p.characters.find((c: any) => c.name === n)?.present)).length,
    duplicateCharacterPages: pages.filter(p => p.duplicateCharacter).length,
    borrowedFacePages: pages.filter(p => p.borrowedFace).length,
    textInImagePages: pages.filter(p => p.textInImage).length,
    promptAdherence: mean(pages.map(p => p.promptAdherence)),
    // ArcFace: similarity to the photo, share of pages where the face beats every look-alike, and drawn-vs-drawn similarity.
    faceSimilarity: faces && Object.fromEntries(names.map(n => [n, faces.summary[n]?.similarity ?? null])),
    faceBeatsRivals: faces && Object.fromEntries(names.map(n => [n, faces.summary[n]?.beatsRivals ?? null])),
    faceCrossPage: faces && Object.fromEntries(names.map(n => [n, faces.summary[n]?.crossPage ?? null])),
    judgeUsage,
  };
}

const [flag, target] = process.argv.slice(2);
if (!flag) {
  console.error('Usage: bun run test:story <case.json> | --judge <run-dir>');
  process.exit(1);
}
(flag === '--judge' ? judge(path.resolve(target)) : generate(path.resolve(flag))).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
