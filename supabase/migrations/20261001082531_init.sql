-- Storybook schema: profiles, stories (drafts and books), reference photos, pages, storage.
-- Credits are not here: they live in RevenueCat (in-app currency CRED).

-- ── Profiles ────────────────────────────────────────────
create table public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  display_name    text,
  -- free starting credits deposited in RevenueCat (welcome-credits function)
  welcome_granted boolean not null default false,
  created_at      timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name) values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Stories (drafts and finished books in one table) ────
-- incomplete = every page settled, some failed with retries left (user can press "Retry page").
create type public.story_status as enum ('draft', 'generating', 'incomplete', 'completed', 'failed');

create table public.stories (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references public.profiles on delete cascade,
  status            public.story_status not null default 'draft',
  -- wizard input
  template          text not null default '',
  questionnaire     jsonb not null default '{}',
  custom_story      text not null default '',
  art_style         text not null default '',
  story_style       text not null default '',
  narration         text not null default '',
  story_length      int check (story_length between 1 and 20),
  wizard_step       int not null default 0,
  -- generation output
  generation        int not null default 0,       -- bumped per generate-story run; part of the credit idempotency keys
  title             text,
  subtitle          text,
  character_context text,                         -- shared by every page prompt
  error             text,                         -- user-facing message only
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index stories_user_updated on public.stories (user_id, updated_at desc);
-- One generation at a time per user.
create unique index one_generation_per_user on public.stories (user_id) where status = 'generating';

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger stories_touch before update on public.stories
  for each row execute function public.touch_updated_at();

-- ── Reference photos and generated character sheets ─────
create table public.story_photos (
  id             uuid primary key default gen_random_uuid(),
  story_id       uuid not null references public.stories on delete cascade,
  kind           text not null default 'photo' check (kind in ('photo', 'sheet')),
  character_name text not null check (char_length(character_name) between 1 and 80),
  description    text not null default '' check (char_length(description) <= 100),
  path           text not null,                   -- {uid}/{story_id}/photos/{file}
  position       int  not null default 0
);
create index story_photos_story on public.story_photos (story_id);

-- ── Pages ───────────────────────────────────────────────
create type public.page_status as enum ('pending', 'done', 'failed');

create table public.story_pages (
  story_id     uuid not null references public.stories on delete cascade,
  page         int  not null,
  text         text not null default '',
  image_prompt text not null,
  image_path   text,                              -- {uid}/{story_id}/pages/{page}-{attempt}.webp
  status       public.page_status not null default 'pending',
  attempts     int  not null default 0,
  primary key (story_id, page)
);

-- Story status follows its pages. Locking the story row serialises pages finishing at the same
-- time, so the last one always sees every other page's final status.
create function public.sync_story_status() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  next_status public.story_status;
begin
  perform 1 from public.stories where id = new.story_id for update;
  select case
           when bool_or(p.status = 'pending') then 'generating'
           when bool_and(p.status = 'done') then 'completed'
           when bool_or(p.status = 'failed' and p.attempts >= 3) then 'failed'
           else 'incomplete'
         end::public.story_status
    into next_status
    from public.story_pages p where p.story_id = new.story_id;
  update public.stories set status = next_status where id = new.story_id and status <> next_status;
  return null;
end $$;

create trigger story_pages_sync after update of status on public.story_pages
  for each row execute function public.sync_story_status();

-- ── Grants and RLS ──────────────────────────────────────
-- Clients only touch wizard input; status, output and credits bookkeeping are server-side.
revoke insert, update on public.profiles, public.stories, public.story_photos, public.story_pages from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;
grant insert (template, questionnaire, custom_story, art_style, story_style, narration, story_length, wizard_step)
  on public.stories to authenticated;
grant update (template, questionnaire, custom_story, art_style, story_style, narration, story_length, wizard_step)
  on public.stories to authenticated;
grant insert (story_id, character_name, description, path, position) on public.story_photos to authenticated;

alter table public.profiles     enable row level security;
alter table public.stories      enable row level security;
alter table public.story_photos enable row level security;
alter table public.story_pages  enable row level security;

create policy "own profile" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "update own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid()));

create policy "own stories" on public.stories for select to authenticated
  using (user_id = (select auth.uid()));
create policy "create drafts" on public.stories for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "edit drafts" on public.stories for update to authenticated
  using (user_id = (select auth.uid()) and status = 'draft')
  with check (status = 'draft');
create policy "delete own stories" on public.stories for delete to authenticated
  using (user_id = (select auth.uid()) and status <> 'generating');

create function public.owns_draft(story uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.stories s where s.id = story and s.user_id = auth.uid() and s.status = 'draft')
$$;

create policy "own photos" on public.story_photos for select to authenticated
  using (exists (select 1 from public.stories s where s.id = story_id and s.user_id = (select auth.uid())));
-- The path must be in the caller's own folder: functions download it with the service role.
create policy "add photos to drafts" on public.story_photos for insert to authenticated
  with check (kind = 'photo' and public.owns_draft(story_id)
              and path like (select auth.uid())::text || '/' || story_id::text || '/photos/%');
create policy "remove photos from drafts" on public.story_photos for delete to authenticated
  using (kind = 'photo' and public.owns_draft(story_id));

create policy "own pages" on public.story_pages for select to authenticated
  using (exists (select 1 from public.stories s where s.id = story_id and s.user_id = (select auth.uid())));

-- The book page listens for its story and pages changing.
alter publication supabase_realtime add table public.stories, public.story_pages;

-- ── Storage ─────────────────────────────────────────────
-- One private bucket; every path starts with the owner's user id.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('stories', 'stories', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']);

create policy "read own files" on storage.objects for select to authenticated
  using (bucket_id = 'stories' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "upload own files" on storage.objects for insert to authenticated
  with check (bucket_id = 'stories' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "delete own files" on storage.objects for delete to authenticated
  using (bucket_id = 'stories' and (storage.foldername(name))[1] = (select auth.uid())::text);
