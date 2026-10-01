# Story Book Generator

A Next.js frontend (the React Router UI in `src/app/[[...slug]]`, rendered client-side) on
Supabase: Auth (email/password), Postgres, Storage and Edge Functions. Credits are RevenueCat
in-app currency (`CRED`). Plan and design notes: `docs/supabase-plan.md`.

- `supabase/migrations/`: schema, RLS, storage bucket and policies
- `supabase/functions/generate-story`: spends credits, writes the story and character sheets
- `supabase/functions/generate-page`: draws one page (also the user's "Retry page")
- `supabase/functions/welcome-credits`: free starting credits, once per account
- `supabase/functions/_shared/`: the story pipeline, shared with the test harness

## Local development

Copy `.env.sample` to `.env.local` and `supabase/functions/.env.example` to
`supabase/functions/.env`, then fill them in.

```sh
bun install
supabase start                 # local Supabase (Docker); prints the URL and keys
supabase functions serve       # Edge Functions with hot reload
bun run dev                    # http://localhost:3000
bun run build                  # type-check + production build
bun run lint
```

Deploy: `supabase db push`, `supabase functions deploy`, `supabase secrets set ...`, and the
Next.js app anywhere that runs `next start` (or a static host).

## Story pipeline tests

`bun run test:story test/story/cases/whatsapp-duo.json` runs a case through the same
pipeline as the Edge Functions (`createStory` in `supabase/functions/_shared/storyPipeline.ts`) (one paid story generation, about
$0.45-0.70) and saves everything to `test-runs/<timestamp>-<case>/`:

- `trace.jsonl`: every model call with prompt, output, latency and token usage
- `metrics.json`: seconds per stage, tokens and estimated cost per model
- `pages/`, `sheets/`, `story.json`, `faces.json`, `summary.json`

No model judges the images: you review the pages. The only automatic score is a free,
local ArcFace face comparison (`test/story/face_score.py`, run with `uv`) of each drawn face
against the reference photo and four look-alike decoys. Re-score an old run for free with
`bun run test:story --score test-runs/<run-dir>`.

Review runs at http://localhost:3000/test-runs (with `bun run dev`): a page per run (pages
beside the reference photos and character sheets, cost per model, full trace), and a
compare view with the pages side by side.
