-- Allow moderators and admins to delete crowdfunding campaigns.
-- Related donations and campaign_updates cascade automatically via the
-- foreign keys defined in schema.sql.

drop policy if exists "delete campaigns" on public.campaigns;
create policy "delete campaigns" on public.campaigns
  for delete using (public.is_moderator());
