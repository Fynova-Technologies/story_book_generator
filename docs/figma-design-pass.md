# Figma design pass: plan

Branch: `feat/figma-design-pass` (off `dev`). Source of truth: Figma "Final Designs" page
(`gbLdSjYqbGhAFZipNWKiqt`, node 398:2194). Nothing is implemented yet: tick what you approve,
strike or comment on the rest.

## How much of the design was actually compared

The Figma connection is on the **Starter plan and ran out of calls after about 6 screenshots per
audit**. Compared against Figma:

| Compared visually | Not compared (findings come from the code only) |
|---|---|
| Landing page | Login, Signup, 404, Contact, Pricing page, Stories, Templates (public) |
| Dashboard, My collection, Template (dashboard), How it works (dashboard) | **Purchase token** (buy credits) |
| Account settings (full page) + Personal info | Story style, Art style (both), art style cards, Voice narration |
| Select template, Template card, Upload image (both), Upload success, Questionnaire | Preview (both), **Sample_preview (finished book)**, custom-story frame 785:1617 |
| | Colour token frames (Text, Background, Primary, Secondary, Accent, on-colours) |

Code-only findings (dead buttons, fake data, broken links) hold whatever the design says. Pixel-level
matching of the right-hand column needs one of:
- a Figma seat with a higher MCP limit, or waiting for the quota to reset, **or**
- you export those frames as PNGs into `docs/figma/` and I compare from the files.

---

## Decisions I need from you

- [ ] **D1. Story style step.** Every stepper in Figma shows 6 steps (Template, Upload, Questionnaire,
  Art style, Voice, Generate). The code has a 7th, "Story style" (storybook/comic/manga), and a
  "Choose story style" frame exists. Keep it as step 4 (my default), or drop it from the wizard?
- [ ] **D2. Pricing.** The landing and pricing pages sell monthly subscriptions ($29/$49/$189, "unlimited
  stories"), and the account page has a fake "Storyteller Premium $15/month". The real model is credits
  (5 per story). My default is to rework pricing as **credit packs** and remove the subscription UI
  until there's a subscription product. OK?
- [ ] **D3. Background colour.** Figma pages are warm cream (~#F4F1ED) with grey panels (~#E5E2DE). Code
  uses blue-grey `#C5D0E2` everywhere, so the whole app reads blue. Change the token to the Figma
  cream (my default)?
- [ ] **D4. Dark mode.** It can never turn on today: nothing adds the `.dark` class. Options:
  (a) follow the OS setting (small change, but every page then needs its dark styles checked);
  (b) remove the dead `dark:` classes and ship light only for now. My default is (b), unless the
  designs include dark screens.
- [ ] **D5. Name fields.** Figma's Personal info has First/Last name; signup stores one display name.
  Keep one "Name" field (my default)?
- [ ] **D6. Photo rules.** Figma says "Upload 5–10 photos" with an N/5 counter and a 20-character
  description. Code allows 1–5 photos, 100 characters, and needs a character name per photo (no design
  shows that field). My default is to keep 1–5 photos and the name field, styled to match the card,
  and show an N/5 counter instead of the MB counter.
- [ ] **D7. Things that need content or assets from you:** the real logo (every screen says "Logo"),
  the contact details (currently placeholder "+977 9800000000 / Kathmandu"), the explainer video,
  and the footer pages (About, Privacy, Terms, Cookies). My default until then is to hide the links that 404.

- [x] **D8. Features in code that Figma doesn't have: keep them all** (your call, 2026-10-01). Each one
  gets a design in the same design language:
  - the book progress states (generating, retry pages, failed with refund, not generated)
  - the character name on each photo
  - the story style step
  - credit and generation errors, Google "coming soon", and "check your email" after signup
  - the photo-size counter and limit banner
  - the template-questionnaire progress bar and "Save Answers" step
  - the "X selected" pills, the page-length input, and the generate loading overlay and error alert
  - the book's playback toolbar
  - the reviews rating row and the delete-draft button

  **Designs deferred** (2026-10-01): Figma's Starter plan MCP quota (20 calls a month) is used up and
  there's no budget to upgrade. These features stay as they are in code until there's Figma quota or exported frames.
  This overrides the "remove" suggestions for these items in the phases below (Phase 1.7, Phase 3.5, Phase 3.8).

---

## Progress

- **Phase 1 and Phase 2: done** (2026-10-01, uncommitted), with the D1–D7 defaults and D8.
  `tsc` and `next build` pass. Not yet clicked through in a browser.
- **Left over from them:**
  - Login/Signup still show Supabase's own error text, e.g. "Invalid login credentials".
  - Avatar upload and Delete Account are hidden; both need storage or a server function.
  - Notification preferences are saved on the device only.
  - Production needs `https://<domain>/reset-password` added to the redirect URLs in the Supabase dashboard.
- **Phase 3 waits for read access to the duplicated Figma file** (`K7bzSNWR3QW7tNPXRIzyuN`) through
  a personal access token in `FIGMA_TOKEN`.

## Phase 1: broken flows and dead buttons (no design questions, highest value)

1. **Public pages bounce logged-in users to the dashboard.** `/pricing`, `/templates`, `/contact`,
   `/stories`, `/samples`, `/how-it-works` use the login-page guard (`client.tsx`, `AuthLayout`). Only
   `/login` and `/signup` should redirect. Also remove the duplicate `/` route (`App.tsx` logs on every render).
2. **Stray dev text on live pages:** "👉 Uncomment when image is ready:" (`TemplateHero.tsx:21`,
   `FeaturedStoryPage.tsx:34`).
3. **"Use Template"** (public and dashboard templates) only logs: it should set the template, reset the
   wizard and open `/create-story` (via signup if logged out).
4. **Landing CTAs:**
   - The "Start your adventure" cards (Explore themes / Start creation / Open editor) only log.
   - The hero and "Start for free" buttons go to `/login`; send new visitors to `/signup`.
   - The mobile "Start now" goes to `/start`, which is a 404.
   - Logged-in visitors still see "Sign up".
5. **Wizard:**
   - Start at **Select Template**, not Upload.
   - Make the custom-story path reachable with a "Write my own story" option on the template step.
   - The "Create Story" buttons on the dashboard must reset the wizard, so an old story's data doesn't leak in.
   - Clicking the stepper must not skip validation or skip the draft save.
   - Remove the bottom "Generate Story" button that only logs, keeping the real one in the Generate step.
   - Show Back on step 1, going to the dashboard.
6. **Generate step:**
   - Replace the hardcoded summary ("The Adventures of Leo", "Created by Mom", "Leo (Bear)") with the
     real template, characters, art style and story style.
   - The copy says "1 credit will be deducted"; the real cost is 5.
   - Block Generate when the balance is under 5, and point to buying credits.
   - "Edit details" should jump back to a step; today it fakes a 4-second spinner.
   - "12 high-res illustrations" should follow the chosen page count.
7. **Questionnaire:**
   - Drop the extra "Save Answers" confirm step (Next is the save).
   - Keep progress when returning to the step.
   - Show the minimum-length hint on the custom story textarea.
8. **Voice narration:**
   - It sets "storyteller" on every render even with narration off.
   - The on/off toggle isn't saved with the draft, so it resets on Back and on restoring a draft.
9. **Signup and login:**
   - A successful signup with email confirmation shows a red error; show a "check your email" success state.
   - "Forgot password?" does nothing; wire it to Supabase's reset email and a reset page.
   - Signup has a copied subtitle and a "Remember me / Forgot password" row that doesn't belong there.
   - The shared `Button` defaults to `disabled` and ignores `type`.
   - The auth error carries over between Login and Signup.
   - Google: show "Coming soon" on the button itself instead of an error after clicking.
10. **Account settings:**
    - Save/Cancel on Personal info and "Update password" only log; wire them to `supabase.auth.updateUser`
      (re-check the current password first), and prefill the real email and name.
    - The header "Create Story" button and the "Logo" do nothing; make the logo link to `/dashboard`.
11. **Contact form** only logs. My default is a `mailto:` fallback until there's a backend, plus a
    success message. A `contact` Edge Function would be the alternative.
12. **Dashboard odds and ends:**
    - The Drafts "View all" does nothing; send it to `/dashboard/collection`.
    - Collection search and sort do nothing; wire them to the stories list.
    - The All/Favorites/Shared and All/Premium/Free tabs filter nothing; hide them until favorites and
      sharing exist (D2 covers "Premium/Free").
13. **Footer** links to `/about`, `/privacy`, `/terms`, `/cookies`, which 404; the social links are `#`
    (see D7). Copyright reads "© 2025 Storyboard".

## Phase 2: real data instead of fake data

1. **Sidebar:**
   - The user row is hardcoded "Sarah Storyteller / sarah@example.com"; use the signed-in user.
   - Add the Figma **credits card**, showing the real balance and how many stories it buys
     (not "monthly limit / resets in 18 days", which doesn't fit credits).
   - Remove the hardcoded "FREE PLAN".
2. **Dashboard hero:** the hardcoded "Sarah", "3 free stories" and "2/5 used" bar should come from the user and credits.
3. **Usage page:** every number is hardcoded. Show the credit balance, stories created and stories left;
   no monthly reset.
4. **Subscription page:** a fake plan, card and invoices. Replace it with the balance and a "Buy credits"
   button (D2); RevenueCat purchase history comes later.
5. **Draft cards:**
   - The title is the template name and the image a placeholder; use the template image and a better title.
   - Add loading, empty ("No stories yet") and error states to Drafts, Completed and Collection.
6. **Stories / samples pages:** 8 identical fake stories. My default is to keep them as static samples
   but make "Read story" open a real sample book. Public sharing of user books isn't built.
7. **Avatars:** `sampleavatar.png` everywhere; use the user's initial until avatar upload exists.

## Phase 3: visuals against Figma

1. **Tokens:**
   - Background cream and a grey surface token (D3).
   - Load Playfair Display and Pacifico; today they're never loaded, so headings fall back to Georgia.
   - Fix `font-display`, which is used 16 times but undefined, and the `font-hading` typo.
   - Primary-30 is `33` hex (20%) where the name implies 30%.
   - Check the rest against the token frames when I can see them.
2. **Dark mode** per D4.
3. **Wizard shell:**
   - Stepper with icons and the active step in blue with an underline bar.
   - Each step in a tinted rounded panel with the large serif heading.
   - The "Draft saved" pill on every step, reflecting real save status (today it shows even when a save failed).
   - A lightning icon on the credits pill.
   - Mobile stepper: today 7 buttons overflow and hide the first steps.
4. **Template card:** the selected state should have a blue border and dimmed image, as in Figma.
   Remove the stray divider line in the wizard.
5. **Upload cards:**
   - Highlight the next empty slot and dim the later ones.
   - Show the photo inset and filling the top of the card.
   - Use the Figma copy and N/5 counter (D6).
   - Add a remove-photo action.
6. **Art style and story style cards:**
   - All five art style descriptions are the same Watercolor text.
   - They lack dark styles, and the selected accent bar is broken (no `relative` parent, off-brand brown).
7. **Dashboard:**
   - Hero and section headings are about half the Figma size.
   - The CTA should be a white pill with a sparkle icon.
   - The Premium card should be light with a solid blue button, not a purple gradient.
   - The sidebar uses raw hex colours instead of tokens.
8. **Landing:**
   - Grey panels instead of blue tint.
   - Reviews as the two-row marquee from Figma, without the extra "4.9 from 2,400+" row and the 2-star review.
9. **404 page:** primary token and pill button instead of `bg-blue-500`; fix the "worrry" typo.
10. **Mobile:**
    - The dashboard sidebar is fixed at 300px with no drawer.
    - The book is a fixed ~900px two-page spread that overflows phones; use single-page portrait on small screens.

## Phase 4: merge duplicated components

- **Cards:** `DraftCard` and `StoryCard` are about 90% the same markup, and `StoryCard` and
  `FeaturedStoryCard` are both story cards. Make one `BookCard` with variants.
- **Data:** the 12 templates are defined twice with different categories (`TemplateSection`,
  `TemplateSelection`). Move them to one data module next to `templateQuestions.ts`.
- **Step list:** defined twice (`CreateStory.tsx`, `StoryStepperNav.tsx`), and the stepper ignores its
  `currentStep` prop. Make it one list.
- **Repeated UI:**
  - Segmented pill tabs, section pill badges and the hero search box are copy-pasted. Extract them only
    where Phase 1–3 touch them anyway.
  - Settings inputs repeat long class strings instead of using `InputField`.
- **Headers:** the account header and the landing navbar duplicate each other; share one.

## Phase 5: new screens (need design or products first)

1. **Buy credits ("Purchase token" frame 1406:1517).** Not built, and I couldn't see the frame.
   - Plan: RevenueCat Web Billing products that grant `CRED` (ideally multiples of 5), in one Offering.
   - Flow: `getOfferings()` → pack cards with RevenueCat's price string → `purchase()` → refresh the balance.
   - Entry points: the sidebar card, "Upgrade now", "Get more credits", Account, and Generate when the balance is low.
   - **Needs:** the frame (or a PNG) and the products created in RevenueCat.
2. **Book progress states.** Generating (x of N pages), retry pages, failed with refund, and not
   generated are plain centred text today, with no design. My default is to style them with the
   existing card, heading and button components and show page thumbnails as they land, unless design
   wants to provide frames.
3. **Finished book (Sample_preview):**
   - Not compared yet.
   - Edit and Audio are dead; Share fails silently without `navigator.share`; "Download" is print.
   - My default is to hide Edit and Audio, add a back-to-dashboard header, and fall back to copy-link
     for Share.

## Phase 6: cleanup

- **Dead files:** `views/DashboardPage.tsx` (all commented out), `section/Dashboard/DashboardSection.tsx`
  (unused copy of Dashboard), `layouts/AccountLayout.tsx` (empty).
- **Leftovers:** remove `console.log`s left in handlers and fix "Choose a story them". The Firebase
  comment in `AuthLayout` and its unstyled "Loading..." go too.
- **Dashboard routes:** `/dashboard/videosection` → `/dashboard/how-it-works`; `/dashboard/sample-gallery`
  duplicates `/samples`, so drop it unless the sidebar needs it.

---

## Proposed order

The phases above are listed by priority. Each phase is one PR into `dev`. Phase 1 and Phase 2 don't
depend on the missing Figma frames and can start as soon as you approve. Phase 3's remaining
comparisons wait for Figma access or PNG exports. Phase 5.1 waits for the RevenueCat products.
