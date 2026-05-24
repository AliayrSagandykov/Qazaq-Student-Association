-- News & media posts.
-- Run in the Supabase SQL editor after campaigns_moderation.sql (uses is_moderator()).

create table if not exists public.news_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references auth.users (id) on delete set null,
  title       text not null,
  excerpt     text not null default '',
  body        text not null default '',
  cover_url   text,
  category    text not null check (category in ('News', 'Story', 'Press')),
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists idx_news_created on public.news_posts (created_at desc);

alter table public.news_posts enable row level security;

drop policy if exists "public read news" on public.news_posts;
create policy "public read news" on public.news_posts
  for select using (published or public.is_moderator());

drop policy if exists "moderator insert news" on public.news_posts;
create policy "moderator insert news" on public.news_posts
  for insert with check (public.is_moderator());

drop policy if exists "moderator update news" on public.news_posts;
create policy "moderator update news" on public.news_posts
  for update using (public.is_moderator()) with check (public.is_moderator());

drop policy if exists "moderator delete news" on public.news_posts;
create policy "moderator delete news" on public.news_posts
  for delete using (public.is_moderator());

-- Seed a couple of posts (safe to re-run).
insert into public.news_posts (id, title, excerpt, body, category) values
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'Association launches its national platform',
   'A single home for Kazakh students and alumni across the United States.',
   'Today we are launching the association''s platform — a permanent network connecting Kazakh students, graduates, founders, and professionals across the United States. The platform brings together a community directory, a map-first events system, student crowdfunding, and mentorship into one place. This is the first step toward building lasting infrastructure for the next generation of Kazakh talent.',
   'News'),
  ('aaaaaaaa-0000-0000-0000-000000000002',
   'From Almaty to Cornell: a first-generation story',
   'How community support helped one student close the tuition gap.',
   'When Aibek was admitted to Cornell, a significant tuition gap stood between him and his dream. Through the association''s crowdfunding community, donors large and small came together to help him enroll. His story is exactly why this network exists: talent should never be limited by geography or financial barriers.',
   'Story')
on conflict (id) do nothing;
