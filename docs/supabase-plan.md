# Supabase integration plan

Branch: `feat/supabase` (off `dev`). Supabase replaces Firebase (auth), localStorage (drafts) and
the Next.js API route (generation). Next.js stays as the frontend.

## Where things live today

| Concern | Today | After |
|---|---|---|
| Auth | Firebase Auth (email/password, Google), or a fake local user when no Firebase key | Supabase Auth (email/password, Google) |
| Drafts | `localStorage`, photos **not** saved (too big) | `stories` row with `status = 'draft'`, photos in Storage |
| Generation | `POST /api/story/generate`, in-process lock, 1-2 min, returns base64 images | Edge Functions, results written to DB + Storage |
| Finished books | Redux only, gone on refresh | `stories` + `story_pages`, flipbook loads by id |
| Credits | hardcoded `credits = 12` in the UI | RevenueCat in-app currency `CRED` (project "Storybook AI web"), spent by the function |

## Edge Function limits drive the design

Supabase Edge Functions: response must start within 150s, wall clock 150s (Free) / 400s (Pro),
2s CPU per request (awaited I/O doesn't count), 256MB memory, Deno runtime (no `sharp`).

A book takes 1-2 minutes, which a single invocation can't be trusted with, so generation is
split into short jobs that return `202` immediately and finish in `EdgeRuntime.waitUntil`:

1. **`generate-story`** `{ storyId }` (user JWT)
   - checks the story is the caller's draft with photos, spends the story's credits in RevenueCat (see Credits),
     sets `status = 'generating'` (a unique index allows one at a time per user, replacing the
     in-process lock), returns `202`.
   - background: photo notes + storyboard + one character sheet per person (same as
     `createStory` step 1), uploads sheets, inserts `story_pages` rows as `pending`, then calls
     `generate-page` once per page.
2. **`generate-page`** `{ storyId, page }` (service role, or the owner retrying a `failed` page)
   - background: one illustration with the photos + sheets, upload to Storage, set the page
     `done` / `failed`. A DB trigger marks the story `completed` when every page is `done`, or
     `failed` if any page failed; the function that sees `failed` refunds the credits.
3. Client subscribes to its story's `story_pages` via Realtime and fills the flipbook as pages
   land. Progress UI comes for free.

No other functions needed: drafts, profiles and listing are plain table reads/writes under RLS
from `supabase-js`, photo uploads go straight to Storage.

### Pipeline code sharing

Move `src/server/services/*` to `supabase/functions/_shared/` and keep it runtime-neutral
(`node:buffer`, API key passed in instead of `process.env`) so both Deno (functions) and Bun
(`test/story/run.ts`) import the same code. `shrink()` moves out of the pipeline: the browser
resizes photos to 1024px on a canvas before upload (also cuts upload size); the test harness
keeps `sharp` as a dev dependency. The `test-runs` viewer stays local, unchanged.

## Schema

The source of truth is `supabase/migrations/20261001082531_init.sql`. In short:

- `profiles`: `display_name`, `welcome_granted` (free credits deposited). Created by a trigger on signup.
- `stories`: drafts and books in one table. Wizard input, `wizard_step`, output (`title`,
  `subtitle`, `character_context`), `error` (user-facing only), `generation` (bumped per run, part
  of the credit idempotency keys) and `status`:
  `draft → generating → completed | incomplete | failed`.
  `incomplete` = every page settled, some failed with retries left.
  A partial unique index allows one `generating` story per user.
- `story_photos`: reference photos (`kind = 'photo'`) and generated character sheets (`'sheet'`).
- `story_pages`: `text`, `image_prompt`, `image_path`, `status` (`pending | done | failed`), `attempts`.
  A trigger keeps `stories.status` in step with its pages (it locks the story row, so pages
  finishing at the same time can't leave it stuck).
- RLS: owners read their own rows. Clients can only write wizard columns on drafts (column grants),
  and photo rows on drafts whose path is in their own folder. Everything else is written by the
  functions with the service role.
- Storage: one private bucket `stories`, paths `{uid}/{story_id}/photos|sheets|pages/...`,
  owner-only policies, 10MB, jpeg/png/webp. Pages are WebP.
- Realtime on `stories` and `story_pages` for the book page.

Verified with PGlite (stubbed `auth`/`storage`): RLS, grants, the one-at-a-time index and the
status trigger. Not yet run against real Supabase.

## Work, in order

Each step is one PR into `dev` and leaves the app working.

1. **Setup**: `supabase init`, link the Fynova project, local stack (`supabase start`) for dev,
   `@supabase/supabase-js` + one client module. `.env.sample` gets `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`; `OPENAI_API_KEY` moves to function secrets.
2. **Schema**: one migration with the tables, RLS, profile trigger, bucket and
   storage policies. Generate types (`supabase gen types typescript`).
3. **Auth**: swap `src/firebase/authService.ts` for Supabase Auth (same exported functions, so
   Login/Signup/AccountSettings barely change). Google provider in the dashboard. "Remember me"
   maps to the client's storage option. Drop the fake local user: local dev uses the local
   Supabase stack instead. Google buttons stay, disabled.
4. **Drafts**: replace `draftService` / `useDraftRestore` with `stories` reads/writes; upload
   photos (resized client-side) to Storage as they're added, so restored drafts keep their photos.
5. **Generation**: move the pipeline to `_shared`, write `generate-story` and `generate-page`,
   the completion trigger, and the Realtime subscription in `GenerateStorySection`. Delete
   `src/app/api/story/generate`. Verify with one paid run (~$0.45-0.70) after sign-off.
6. **Library**: Completed section and `/flipbook/:id` read from `stories` + `story_pages`
   instead of Redux; credits in the UI from the RevenueCat Web SDK (`getVirtualCurrencies()`).
7. **Cleanup**: remove `firebase`, `.firebaserc`, `src/firebase/`, `imageUploadService.ts` (calls
   an `/api/upload` that doesn't exist), `sharp` from prod deps.

## Not in this plan (add when the feature is built)

Credit packs/subscriptions (products granting `CRED` in RevenueCat, the paywall), narration audio, video, favorites, public share links,
notification settings, templates in the DB (they stay in `src/Data/templateQuestions.ts`).

## Decisions

- **Free plan, no automatic retries.** Each function makes one attempt per image and records
  the result. A failed page shows a "Retry page" button; the owner calls `generate-page` for
  their own `failed` page (user JWT, no extra credits). `story_pages.attempts` caps it at 3;
  past that the story is `failed` and the credits are refunded. A failed character sheet fails
  the story and refunds, and the user generates again from the draft.
  This keeps every invocation to one image (well under 150s) and means no OpenAI spend the user
  didn't ask for.
  Storage is 1GB and egress 5GB: request `output_format: 'webp'` from the image API (~10x
  smaller than PNG, and no `sharp` needed). Free projects pause after a week idle.

- **No Firebase user migration**: start fresh.
- **Auth**: email/password only for now. Google button stays and shows "coming soon" until the
  OAuth client exists.
- **Credits live in RevenueCat**, in-app currency `CRED` on project "Storybook AI web"
  (`proj364e7b22`, RC Billing app on Stripe). No balance in Supabase. RevenueCat app user id =
  Supabase `auth.uid()`.
  - Read: Web SDK `getVirtualCurrencies()` in the browser (SDK can only read).
  - Spend: `generate-story` calls `POST /v2/projects/proj364e7b22/customers/{uid}/virtual_currencies/transactions`
    with `-cost`, secret key in function secrets, `Idempotency-Key: spend-{storyId}`. RevenueCat
    rejects with 422 if the balance is too low (never goes negative), so the debit is atomic
    without our own lock. The story only moves to `generating` after the spend succeeds.
  - Refund: same endpoint with `+cost`, `Idempotency-Key: refund-{storyId}`, when a story fails.
  - Purchases: products granting `CRED` are configured in RevenueCat; it credits the balance
    itself, no webhook needed.
  - Free starting credits: RevenueCat has no signup grant. A `welcome-credits` function, called
    once after login, flips `profiles.welcome_granted` (conditional update, so only once) and
    deposits the free credits; resets the flag if the deposit fails.
