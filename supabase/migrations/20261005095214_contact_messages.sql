-- Contact Us form submissions. Anyone can insert; nobody can read via the API (view in dashboard).
create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (length(name) between 1 and 200),
  email text not null check (length(email) between 3 and 320),
  message text not null check (length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);
