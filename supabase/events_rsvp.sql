-- Event RSVPs.
-- Run in the Supabase SQL editor after the earlier migrations.

create table if not exists public.event_rsvps (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (event_id, user_id)
);

create index if not exists idx_rsvps_event on public.event_rsvps (event_id);

alter table public.event_rsvps enable row level security;

-- Anyone can read RSVP rows (used to count attendees).
drop policy if exists "public read rsvps" on public.event_rsvps;
create policy "public read rsvps" on public.event_rsvps
  for select using (true);

-- A signed-in user manages only their own RSVP.
drop policy if exists "insert own rsvp" on public.event_rsvps;
create policy "insert own rsvp" on public.event_rsvps
  for insert with check (auth.uid() = user_id);

drop policy if exists "delete own rsvp" on public.event_rsvps;
create policy "delete own rsvp" on public.event_rsvps
  for delete using (auth.uid() = user_id);
