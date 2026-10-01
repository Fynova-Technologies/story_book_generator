import fs from 'fs';
import path from 'path';
import { runFilePath } from '@/server/testRuns';

const TYPES: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.json': 'application/json', '.jsonl': 'application/x-ndjson', '.html': 'text/html; charset=utf-8',
};

// Serves files from a local story test run (images, JSON, report.html).
export async function GET(_request: Request, { params }: { params: Promise<{ run: string; path: string[] }> }) {
  const { run, path: parts } = await params;
  const file = runFilePath(run, parts);
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(fs.readFileSync(file), {
    headers: { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' },
  });
}
