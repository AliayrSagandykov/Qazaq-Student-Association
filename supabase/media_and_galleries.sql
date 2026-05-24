-- Banners, galleries, and campaign media.
-- Run in the Supabase SQL editor after the earlier migrations.

-- Profile banner (shown behind the avatar on the profile + directory cards).
alter table public.profiles
  add column if not exists banner_url text;

-- Campaign gallery (up to 10 images, enforced in the UI) + an optional video.
alter table public.campaigns
  add column if not exists images text[] not null default '{}',
  add column if not exists video_url text;

-- News gallery. cover_url stays the "main" banner image; images is the gallery.
alter table public.news_posts
  add column if not exists images text[] not null default '{}';

-- Public bucket for user-uploaded media (banners, campaign + news galleries).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can view media; a user may manage files only inside their own folder
-- (path convention: "<user_id>/<filename>").
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media owner write" on storage.objects;
create policy "media owner write" on storage.objects
  for insert with check (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "media owner update" on storage.objects;
create policy "media owner update" on storage.objects
  for update using (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "media owner delete" on storage.objects;
create policy "media owner delete" on storage.objects
  for delete using (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );
