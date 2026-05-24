-- Stripe donations.
-- Run in the Supabase SQL editor after the earlier migrations.

-- Dedupe donations by Stripe Checkout session so a replayed webhook is idempotent.
alter table public.donations
  add column if not exists stripe_session_id text unique;

-- Donations are inserted by the Stripe webhook using the service role key,
-- which bypasses RLS. Public read (donor wall) is already enabled in schema.sql.
