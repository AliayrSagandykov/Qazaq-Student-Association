-- Profiles: enable per-user editable profiles.
-- Run this in the Supabase SQL editor after schema.sql / seed.sql.

-- Allow incomplete profiles (a fresh sign-up has no academic data yet).
alter table public.profiles
  alter column university drop not null,
  alter column major drop not null,
  alter column degree drop not null,
  alter column grad_year drop not null,
  alter column state drop not null,
  alter column city drop not null,
  alter column industry drop not null;

alter table public.profiles add column if not exists email text;

-- One profile per auth user (lets us upsert on user_id).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_user_id_key'
  ) then
    alter table public.profiles add constraint profiles_user_id_key unique (user_id);
  end if;
end $$;

-- A signed-in user may create and edit their own profile row.
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
