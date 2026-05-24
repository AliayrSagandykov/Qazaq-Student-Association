-- Longer "about" text for the full profile page.
-- The short `bio` stays on directory cards; `about` is shown on the member page.
-- Run in the Supabase SQL editor after profiles_photo_contact.sql.

alter table public.profiles
  add column if not exists about text;
