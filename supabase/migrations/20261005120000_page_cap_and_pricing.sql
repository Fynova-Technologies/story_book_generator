-- Books are priced by page count (supabase/functions/_shared/pricing.ts). Each run stores what it
-- charged so a refund returns exactly that. Server-side only: no client grant.
alter table public.stories add column credits_spent int;
update public.stories set credits_spent = 5 where generation > 0; -- runs before per-page pricing cost a flat 5

-- Books are at most 12 pages. NOT VALID: older drafts above 12 stay readable; new writes are checked.
-- Added after the backfill above, since NOT VALID still checks rows that get updated.
alter table public.stories drop constraint stories_story_length_check;
alter table public.stories add constraint stories_story_length_check check (story_length between 1 and 12) not valid;
