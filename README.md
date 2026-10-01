# Story Book Generator

One Next.js app: the React Router UI (`src/app/[[...slug]]`, rendered client-side) and the
story API (`src/app/api/story/generate/route.ts`, server code in `src/server/`).

## Local development

Copy `.env.sample` to `.env.local` and set `OPENAI_API_KEY`. Leave the
`NEXT_PUBLIC_FIREBASE_*` keys empty to run fully local: no Firebase calls, and you're
signed in as a local dev user.

```sh
bun install
bun run dev      # http://localhost:3000
bun run build    # type-check + production build
bun run start
bun run lint
```

Deploy anywhere that runs `next start` as a long-lived Node server. Generation takes 1-2
minutes and uses an in-process lock, so run a single instance.

## Story pipeline tests

`bun run test:story test/story/cases/whatsapp-duo.json` runs a case through the same
`createStory` flow as `/api/story/generate` (one paid story generation, about
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
