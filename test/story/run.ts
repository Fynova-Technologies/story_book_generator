// Story pipeline test harness. Runs a case through the production flow, records every
// stage and saves outputs under test-runs/ for you to review in /test-runs. The only
// scoring is local and free (ArcFace face similarity); no model judges the images.
//
//   bun run test:story test/story/cases/whatsapp-duo.json   generate + score
//   bun run test:story --score test-runs/<run-dir>          re-score an existing run (free)
// Bun loads .env.local, so OPENAI_API_KEY comes from there.
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import sharp from 'sharp';
import { createStory } from '../../supabase/functions/_shared/storyPipeline.ts';
import { normalizeReferences } from '../../supabase/functions/_shared/characterReferences.ts';
import { withTrace } from '../../supabase/functions/_shared/trace.ts';

const RUNS = path.resolve(__dirname, '../../test-runs');

type Ref = { characterName: string; file: string };
type Page = { page: number; text: string; image: string; imagePrompt: string };

const write = (dir: string, name: string, value: unknown) =>
  fs.writeFileSync(path.join(dir, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
// The app compresses photos in the browser when they are picked (src/lib/compressPhoto.ts); do the same here.
// rotate() applies EXIF orientation before it is stripped.
const shrunkDataUrl = async (file: string) => {
  const webp = await sharp(file).rotate().resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  return `data:image/webp;base64,${webp.toString('base64')}`;
};
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
  const references = normalizeReferences(await Promise.all(testCase.references.map(async (r: any, i: number) =>
    ({ ...r, image: await shrunkDataUrl(path.join(dir, refs[i].file)) }))));
  const request = { storytext: '', storyStyle: 'storybook', ...testCase.request };
  write(dir, 'case.json', testCase);

  const events: { t: number; event: string; [k: string]: unknown }[] = [];
  const started = Date.now();
  const sink = (event: string, data: Record<string, unknown>) => {
    // Character sheets arrive as data URLs; keep the image as a file, not in the trace.
    if (typeof data.imageUrl === 'string') {
      fs.mkdirSync(path.join(dir, 'sheets'), { recursive: true });
      const file = `sheets/${data.characterName}.${/^data:image\/(\w+)/.exec(data.imageUrl)![1]}`;
      fs.writeFileSync(path.join(dir, file), Buffer.from(data.imageUrl.split(',')[1], 'base64'));
      data = { ...data, imageUrl: undefined, file };
    }
    const entry = { t: Date.now() - started, event, ...data };
    events.push(entry);
    fs.appendFileSync(path.join(dir, 'trace.jsonl'), JSON.stringify(entry) + '\n');
  };

  console.log(`Run dir: ${dir}`);
  try {
    const story = await withTrace(sink, () => createStory(request, references));
    // The server, not the director, builds each page's image prompt.
    const built = events.find(e => e.event === 'pages')?.pages as { page: number; imagePrompt: string }[] | undefined;
    const prompts = new Map<number, string>((built || []).map(p => [p.page, p.imagePrompt]));
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
  await score(dir);
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
      sheets: +(stage('character.sheet') / 1000).toFixed(1),
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

async function score(dir: string) {
  const story = read(dir, 'story.json');
  const names = [...new Set((story.refs as Ref[]).map(r => r.characterName))];
  // Expected cast = reference characters named in the page prompt.
  const pages = story.pages.map((p: Page) => ({ ...p, expected: names.filter(n => new RegExp(`\\b${n}\\b`, 'i').test(p.imagePrompt)) }));
  console.log('Scoring face identity (local, free)...');
  const faces = faceScore(dir, story, pages);
  if (faces) write(dir, 'faces.json', faces);
  const m = fs.existsSync(path.join(dir, 'metrics.json')) ? read(dir, 'metrics.json') : null;
  const summary = {
    run: path.basename(dir),
    title: story.title,
    pages: pages.length,
    seconds: m?.seconds,
    totalTokens: m?.totalTokens,
    estCostUsd: m?.estCostUsd,
    imageRetries: m ? m.imageAttempts - pages.length : null,
    emptyPageText: story.pages.filter((p: Page) => !p.text.trim()).length,
    // ArcFace: similarity to the photo, share of pages where the face beats every look-alike, and drawn-vs-drawn similarity.
    faceSimilarity: faces && Object.fromEntries(names.map(n => [n, faces.summary[n]?.similarity ?? null])),
    faceBeatsRivals: faces && Object.fromEntries(names.map(n => [n, faces.summary[n]?.beatsRivals ?? null])),
    faceCrossPage: faces && Object.fromEntries(names.map(n => [n, faces.summary[n]?.crossPage ?? null])),
  };
  write(dir, 'summary.json', summary);
  fs.appendFileSync(path.join(RUNS, 'index.jsonl'), JSON.stringify(summary) + '\n');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Review: http://localhost:3000/test-runs/${encodeURIComponent(path.basename(dir))} (with bun run dev)`);
}

const [flag, target] = process.argv.slice(2);
if (!flag) {
  console.error('Usage: bun run test:story <case.json> | --score <run-dir>');
  process.exit(1);
}
(flag === '--score' ? score(path.resolve(target)) : generate(path.resolve(flag))).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
