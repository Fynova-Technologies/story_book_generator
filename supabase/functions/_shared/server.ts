// Edge Function plumbing shared by every function: clients, auth, errors, storage, credits.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { Buffer } from 'node:buffer';
import { ApiError } from './ApiError.ts';

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };

export const WELCOME_CREDITS = 5;
export const MAX_ATTEMPTS    = 3;  // per page; keep in sync with sync_story_status() in the migration

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const admin = createClient(Deno.env.get('SUPABASE_URL')!, SERVICE_KEY, { auth: { persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Users only ever see ApiError messages, which are written for them. Everything else
// (OpenAI, RevenueCat, database errors) is logged and replaced with a generic message.
export const GENERIC_ERROR = 'Something went wrong on our side. Please try again.';
export function publicMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  console.error(error);
  return GENERIC_ERROR;
}

// Wraps a handler: CORS preflight, JSON errors with sanitized messages.
export const serve = (handler: (req: Request) => Promise<Response>) =>
  Deno.serve(async req => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    try {
      return await handler(req);
    } catch (error) {
      return json(error instanceof ApiError ? error.statusCode : 500, { error: publicMessage(error) });
    }
  });

// Run work after the response is sent (counts toward the 150s wall clock, not the response timeout).
export const background = (work: Promise<unknown>) =>
  EdgeRuntime.waitUntil(work.catch(error => console.error('Background task failed:', error)));

const bearer = (req: Request) => req.headers.get('Authorization')?.replace(/^Bearer /, '') || '';

export const isInternal = (req: Request) => bearer(req) === SERVICE_KEY;

export async function requireUser(req: Request) {
  const { data, error } = await admin.auth.getUser(bearer(req));
  if (error || !data.user) throw new ApiError(401, 'Please log in again.');
  return data.user;
}

export async function body<T>(req: Request): Promise<T> {
  const value = await req.json().catch(() => null);
  if (!value || typeof value !== 'object') throw new ApiError(400, 'Invalid request.');
  return value as T;
}

// Calls another function with the service key; it replies 202 straight away and works in the background.
export async function invoke(name: string, payload: unknown) {
  const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/${name}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`${name} ${res.status}: ${await res.text()}`);
}

// ── Storage (one private bucket, paths start with the user id) ──
const BUCKET = 'stories';

export async function downloadDataUrl(path: string) {
  const { data, error } = await admin.storage.from(BUCKET).download(path);
  if (error) throw error;
  return `data:${data.type};base64,${Buffer.from(await data.arrayBuffer()).toString('base64')}`;
}

export async function uploadDataUrl(path: string, dataUrl: string) {
  const [, type, b64] = /^data:([\w/+.-]+);base64,(.*)$/.exec(dataUrl)!;
  const { error } = await admin.storage.from(BUCKET).upload(path, Buffer.from(b64, 'base64'), { contentType: type, upsert: true });
  if (error) throw error;
}

// ── Credits: RevenueCat in-app currency CRED, RevenueCat app user id = Supabase user id ──
// RevenueCat rejects a spend that would go negative (422) and replays a request with the same
// Idempotency-Key instead of applying it twice.
export async function adjustCredits(userId: string, amount: number, idempotencyKey: string) {
  const project = Deno.env.get('REVENUECAT_PROJECT_ID');
  const res = await fetch(`https://api.revenuecat.com/v2/projects/${project}/customers/${encodeURIComponent(userId)}/virtual_currencies/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('REVENUECAT_SECRET_KEY')}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ adjustments: { CRED: amount } }),
  });
  if (res.status === 422) return 'insufficient' as const;
  if (!res.ok) throw new Error(`RevenueCat ${res.status}: ${await res.text()}`);
  return 'ok' as const;
}

// Refunds a run's spend when the story ends up failed. Safe to call more than once per run.
export async function refundIfFailed(storyId: string) {
  const { data: story } = await admin.from('stories').select('user_id, status, generation, credits_spent').eq('id', storyId).single();
  if (story?.status !== 'failed' || !story.credits_spent) return;
  await adjustCredits(story.user_id, story.credits_spent, `refund-${storyId}-${story.generation}`);
}
