import fs from 'fs';
import path from 'path';

// Reads story-harness output from test-runs/ (written by test/story/run.ts).
export const RUNS_DIR = path.join(process.cwd(), 'test-runs');

const readJson = (dir: string, name: string) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
  } catch {
    return null;
  }
};

export interface RunInfo {
  id: string;
  caseName: string;
  startedAt: string;
  status: 'scored' | 'generated' | 'failed' | 'running';
  error?: string;
  summary: any;
  metrics: any;
}

export function listRuns(): RunInfo[] {
  if (!fs.existsSync(RUNS_DIR)) return [];
  return fs.readdirSync(RUNS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(RUNS_DIR, entry.name, 'case.json')))
    .map(entry => runInfo(entry.name))
    .sort((a, b) => b.id.localeCompare(a.id));
}

function runInfo(id: string): RunInfo {
  const dir = path.join(RUNS_DIR, id);
  const testCase = readJson(dir, 'case.json');
  const summary = readJson(dir, 'summary.json');
  const error = readJson(dir, 'error.json');
  // Dir names start with an ISO timestamp whose ':' and '.' were replaced by '-'.
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/.exec(id);
  return {
    id,
    caseName: testCase?.name || id,
    startedAt: m ? `${m[1]}T${m[2]}:${m[3]}:${m[4]}.${m[5]}Z` : '',
    status: summary ? 'scored' : error ? 'failed' : fs.existsSync(path.join(dir, 'story.json')) ? 'generated' : 'running',
    error: error?.message,
    summary,
    metrics: readJson(dir, 'metrics.json'),
  };
}

// Only ids that exist in the listing are accepted, so no path tricks.
export function loadRun(id: string) {
  if (!listRuns().some(run => run.id === id)) return null;
  const dir = path.join(RUNS_DIR, id);
  const trace = fs.existsSync(path.join(dir, 'trace.jsonl'))
    ? fs.readFileSync(path.join(dir, 'trace.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
    : [];
  // Saved as refs/<n>-<name>.<ext> before generation starts, so failed runs have them too.
  const refs = fs.existsSync(path.join(dir, 'refs'))
    ? fs.readdirSync(path.join(dir, 'refs')).sort().map(file => ({
      characterName: file.replace(/^\d+-/, '').replace(/\.[^.]+$/, ''),
      file: `refs/${file}`,
    }))
    : [];
  const sheets = fs.existsSync(path.join(dir, 'sheets'))
    ? fs.readdirSync(path.join(dir, 'sheets')).sort().map(file => ({ characterName: file.replace(/\.[^.]+$/, ''), file: `sheets/${file}` }))
    : [];
  return {
    ...runInfo(id),
    refs,
    sheets,
    testCase: readJson(dir, 'case.json'),
    story: readJson(dir, 'story.json'),
    // Older runs kept face scores inside judge.json.
    faces: readJson(dir, 'faces.json') ?? readJson(dir, 'judge.json')?.faces ?? null,
    narration: readJson(dir, 'narration.json'),
    trace,
  };
}

export function runFilePath(id: string, parts: string[]) {
  if (!listRuns().some(run => run.id === id)) return null;
  const dir = path.join(RUNS_DIR, id);
  const file = path.resolve(dir, ...parts);
  return file.startsWith(dir + path.sep) && fs.existsSync(file) ? file : null;
}

// ── Comparable metrics ───────────────────────────────────────
export interface MetricRow {
  group: string;
  label: string;
  better: 'higher' | 'lower';
  format: (v: number) => string;
  value: (run: RunInfo) => number | null | undefined;
}

const num = (v: number) => String(+v.toFixed(2));
const secs = (v: number) => `${v.toFixed(1)}s`;
const usd = (v: number) => `$${v.toFixed(3)}`;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const int = (v: number) => v.toLocaleString('en-US');

export function metricRows(runs: RunInfo[]): MetricRow[] {
  const names = [...new Set(runs.flatMap(run => Object.keys(run.summary?.faceSimilarity || {})))];
  // Judge scores are 0-10; ArcFace similarities are cosine (-1..1, same-person photos ~0.5+).
  const perCharacter = (group: string, label: string, key: string, format = num): MetricRow[] =>
    names.map(name => ({ group, label: `${label}: ${name}`, better: 'higher', format, value: run => run.summary?.[key]?.[name] }));
  const models = [...new Set(runs.flatMap(run => Object.keys(run.metrics?.models || {})))];
  return [
    ...perCharacter('Face identity (ArcFace)', 'Beats look-alikes', 'faceBeatsRivals', pct),
    ...perCharacter('Face identity (ArcFace)', 'Similarity to photo', 'faceSimilarity'),
    ...perCharacter('Face identity (ArcFace)', 'Same face across pages', 'faceCrossPage'),
    { group: 'Pages', label: 'Missing page text', better: 'lower', format: num, value: r => r.summary?.emptyPageText },
    { group: 'Time', label: 'Total', better: 'lower', format: secs, value: r => r.metrics?.seconds?.total },
    { group: 'Time', label: 'Photo analysis', better: 'lower', format: secs, value: r => r.metrics?.seconds?.describe },
    { group: 'Time', label: 'Storyboard', better: 'lower', format: secs, value: r => r.metrics?.seconds?.director },
    { group: 'Time', label: 'Character sheets', better: 'lower', format: secs, value: r => r.metrics?.seconds?.sheets },
    { group: 'Time', label: 'Illustrations', better: 'lower', format: secs, value: r => r.metrics?.seconds?.images },
    { group: 'Cost', label: 'Estimated cost', better: 'lower', format: usd, value: r => r.metrics?.estCostUsd },
    { group: 'Cost', label: 'Total tokens', better: 'lower', format: int, value: r => r.metrics?.totalTokens },
    { group: 'Cost', label: 'Image retries', better: 'lower', format: num, value: r => r.metrics ? r.metrics.failedImageAttempts : null },
    ...models.map((model): MetricRow => ({ group: 'Cost', label: `Cost: ${model}`, better: 'lower', format: usd, value: r => r.metrics?.models?.[model]?.estCostUsd })),
    ...models.map((model): MetricRow => ({ group: 'Cost', label: `Tokens: ${model}`, better: 'lower', format: int, value: r => r.metrics?.models?.[model]?.totalTokens })),
  ];
}
