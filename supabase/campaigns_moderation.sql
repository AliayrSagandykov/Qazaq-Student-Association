-- Campaign creation + moderation.
-- Run in the Supabase SQL editor after the earlier migrations.

-- Roles live on the profile. Promote a moderator with, e.g.:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
alter table public.profiles add column if not exists role text not null default 'user';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('user', 'moderator', 'admin'));
  end if;
end $$;

-- Helper used by policies. SECURITY DEFINER avoids recursive RLS on profiles.
create or replace function public.is_moderator()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role in ('moderator', 'admin')
  );
$$;

-- Campaigns are public only once approved; owners and moderators see their own/all.
drop policy if exists "public read campaigns" on public.campaigns;
drop policy if exists "read campaigns" on public.campaigns;
create policy "read campaigns" on public.campaigns
  for select using (
    status = 'approved' or owner_id = auth.uid() or public.is_moderator()
  );

drop policy if exists "insert own campaign" on public.campaigns;
create policy "insert own campaign" on public.campaigns
  for insert with check (owner_id = auth.uid());

drop policy if exists "update campaigns" on public.campaigns;
create policy "update campaigns" on public.campaigns
  for update using (owner_id = auth.uid() or public.is_moderator())
  with check (owner_id = auth.uid() or public.is_moderator());
