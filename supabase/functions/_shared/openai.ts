// Minimal OpenAI REST client (Responses + Image edits). Usage is normalized for tracing.
// node: imports keep this file running on both Deno (Edge Functions) and Bun (test harness).
import { Buffer } from 'node:buffer';
import process from 'node:process';

const API = 'https://api.openai.com/v1';
const auth = () => ({ Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}` });

export interface Usage {
  inputTokens: number;
  inputImageTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
}

export type ContentPart =
  | { type: 'input_text'; text: string }
  | { type: 'input_image'; image_url: string };

async function call(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  const body: any = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(`OpenAI ${res.status}: ${body.error?.message || res.statusText}`), { status: res.status });
  return body;
}

export async function respond(options: {
  model: string;
  content: ContentPart[] | string;
  instructions?: string;
  schema?: { name: string; schema: object };
  effort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
}): Promise<{ text: string; usage: Usage }> {
  const body = await call(`${API}/responses`, {
    method: 'POST',
    headers: { ...auth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model,
      instructions: options.instructions,
      input: [{ role: 'user', content: options.content }],
      ...(options.schema && { text: { format: { type: 'json_schema', strict: true, ...options.schema } } }),
      ...(options.effort && { reasoning: { effort: options.effort } }),
    }),
  });
  const text = body.output?.flatMap((o: any) => o.content || []).find((c: any) => c.type === 'output_text')?.text || '';
  const u = body.usage || {};
  return {
    text,
    usage: {
      inputTokens: u.input_tokens || 0,
      inputImageTokens: 0, // Responses usage doesn't split image input
      outputTokens: u.output_tokens || 0,
      reasoningTokens: u.output_tokens_details?.reasoning_tokens || 0,
      totalTokens: u.total_tokens || 0,
    },
  };
}

export async function editImage(options: {
  model: string;
  prompt: string;
  images: { mimeType: string; data: string }[];
  size?: string;
}): Promise<{ b64: string; usage: Usage }> {
  const form = new FormData();
  form.set('model', options.model);
  form.set('prompt', options.prompt);
  if (options.size) form.set('size', options.size);
  // WebP is ~10x smaller than PNG: the Free plan has 1GB storage and 5GB egress.
  form.set('output_format', 'webp');
  options.images.forEach((image, i) =>
    form.append('image[]', new Blob([Buffer.from(image.data, 'base64')], { type: image.mimeType }), `ref-${i + 1}.${image.mimeType.split('/')[1]}`));
  const body = await call(`${API}/images/edits`, { method: 'POST', headers: auth(), body: form });
  const b64 = body.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI returned no image');
  const u = body.usage || {};
  return {
    b64,
    usage: {
      inputTokens: u.input_tokens || 0,
      inputImageTokens: u.input_tokens_details?.image_tokens || 0,
      outputTokens: u.output_tokens || 0,
      reasoningTokens: 0,
      totalTokens: u.total_tokens || 0,
    },
  };
}
