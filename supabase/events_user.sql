-- Let any signed-in user create events; owners can edit/delete their own.
-- Run in the Supabase SQL editor after the earlier migrations.

alter table public.events
  add column if not exists owner_id uuid references auth.users (id) on delete set null;

-- public read is already enabled in schema.sql.

drop policy if exists "insert own event" on public.events;
create policy "insert own event" on public.events
  for insert with check (auth.uid() = owner_id);

drop policy if exists "update own event" on public.events;
create policy "update own event" on public.events
  for update using (auth.uid() = owner_id or public.is_moderator())
  with check (auth.uid() = owner_id or public.is_moderator());

drop policy if exists "delete own event" on public.events;
create policy "delete own event" on public.events
  for delete using (auth.uid() = owner_id or public.is_moderator());
