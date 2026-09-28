# Story Book Generator

One Next.js app: the React Router UI (`src/app/[[...slug]]`, rendered client-side) and the
story API (`src/app/api/story/generate/route.ts`, server code in `src/server/`).

## Local development

Copy `.env.sample` to `.env.local` and set `GEMINI_API_KEY` (and `OPENAI_API_KEY` for the
test judge). Leave the `NEXT_PUBLIC_FIREBASE_*` keys empty to run fully local: no Firebase
calls, and you're signed in as a local dev user.

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
`createStory` flow as `/api/story/generate` and saves everything to
`test-runs/<timestamp>-<case>/`:

- `trace.jsonl`: every model call with prompt, output, latency and token usage
- `metrics.json`: seconds per stage, tokens and estimated cost per model
- `pages/`, `story.json`, `judge.json`, `summary.json`

An OpenAI vision judge (`OPENAI_JUDGE_MODEL`, default `gpt-5.5`) scores likeness to the
reference photos, cross-page consistency, cast, and text artifacts. Every summary is
appended to `test-runs/index.jsonl`. Re-score an old run with
`bun run test:story --judge test-runs/<run-dir>`.

Browse results at http://localhost:3000/test-runs (with `bun run dev`): every run with its
headline numbers, a page per run (images beside the reference photos, judge notes, cost per
model, full trace), and a compare view that shows each metric's change against a chosen
baseline with the pages side by side.
