-- QSA Platform — database schema
-- Run this in the Supabase SQL editor (or via the Supabase CLI) once per project.

-- Profiles: extends Supabase auth.users with community fields.
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete cascade,
  name        text not null,
  university  text not null,
  major       text not null,
  degree      text not null check (degree in ('Bachelor''s', 'Master''s', 'PhD')),
  grad_year   int  not null,
  state       text not null,
  city        text not null,
  industry    text not null,
  is_alumni   boolean not null default false,
  bio         text not null default '',
  initials    text not null default '',
  created_at  timestamptz not null default now()
);

-- Events shown on the map / list.
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  organizer   text not null,
  title       text not null,
  description text not null default '',
  date        timestamptz not null,
  city        text not null,
  state       text not null,
  venue       text not null,
  lat         double precision not null,
  lng         double precision not null,
  attendees   int not null default 0,
  category    text not null check (category in ('Meetup', 'Conference', 'Nauryz', 'Startup', 'Networking')),
  created_at  timestamptz not null default now()
);

-- Crowdfunding campaigns.
create table if not exists public.campaigns (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references auth.users (id) on delete set null,
  student_name text not null,
  initials     text not null default '',
  university   text not null,
  major        text not null,
  degree       text not null check (degree in ('Bachelor''s', 'Master''s', 'PhD')),
  state        text not null,
  short_bio    text not null default '',
  story        text not null default '',
  goals        text[] not null default '{}',
  target       numeric not null check (target > 0),
  raised       numeric not null default 0,
  urgency      text not null check (urgency in ('Low', 'Medium', 'High')),
  verified     boolean not null default false,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

-- Individual donations (donor wall + leaderboard).
create table if not exists public.donations (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  donor_id    uuid references auth.users (id) on delete set null,
  donor_name  text not null,
  amount      numeric not null check (amount > 0),
  anonymous   boolean not null default false,
  recurring   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Updates posted to a campaign.
create table if not exists public.campaign_updates (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  date        date not null default current_date,
  text        text not null
);

create index if not exists idx_donations_campaign on public.donations (campaign_id);
create index if not exists idx_updates_campaign on public.campaign_updates (campaign_id);
create index if not exists idx_events_date on public.events (date);

-- Row Level Security: public read access for the directory/feed; writes are
-- restricted (handle inserts via authenticated server actions or service role).
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.campaigns enable row level security;
alter table public.donations enable row level security;
alter table public.campaign_updates enable row level security;

create policy "public read profiles"   on public.profiles         for select using (true);
create policy "public read events"      on public.events           for select using (true);
create policy "public read campaigns"   on public.campaigns        for select using (true);
create policy "public read donations"   on public.donations        for select using (true);
create policy "public read updates"     on public.campaign_updates for select using (true);
