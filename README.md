# Qazaq Students Association — Platform

A modern web platform uniting Kazakh students and alumni across the United States:
community networking, map-first event discovery, mentorship, and student crowdfunding.

This repository currently contains the **Phase 1 frontend MVP** built with the official
Next.js App Router. Data is served from a mock layer (`src/lib/data.ts`) and is designed to
be swapped for Supabase / a NestJS API without changing the UI.

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **TailwindCSS**
- **Framer Motion** (scroll reveal animations)

## What's implemented

| Module | Route | Notes |
| --- | --- | --- |
| Landing page | `/` | Hero, mission, stats, featured members, events, crowdfunding spotlight, sponsors, testimonials, CTA. SSR + SEO metadata. |
| Community directory | `/directory` | Live search + filters (university, major, state, degree, alumni-only). |
| Events | `/events` | Map-first view with projected pins over a stylized USA map + list toggle and RSVP. |
| Crowdfunding feed | `/crowdfunding` | Campaign cards with filters and sorting. |
| Campaign page | `/crowdfunding/[id]` | Story, goals, updates, donor wall, and a donate panel (one-time/recurring/anonymous). |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Without any environment variables the app serves the mock data in `src/lib/data.ts`,
so it builds and deploys out of the box.

## Connecting Supabase

The data layer (`src/lib/queries.ts`) reads from Supabase when configured and falls
back to mock data otherwise — so you can connect the database without touching the UI.

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run, in order: `supabase/schema.sql`, `supabase/seed.sql`,
   `supabase/profiles_auth.sql` (per-user editable profiles + RLS), and
   `supabase/profiles_photo_contact.sql` (avatar storage bucket + contact fields).
3. Copy `Project Settings → API → Project URL` and the `anon` key.
4. Locally: copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. On Vercel: add the same two variables under **Settings → Environment Variables**, then redeploy.

Once the variables are set, the directory, events, and crowdfunding pages read live
data from Postgres. Pages use ISR (`revalidate = 300`), so changes appear within ~5 minutes.

## Authentication

Auth uses **Supabase Auth** with cookie-based sessions (`@supabase/ssr`). The same two
env vars above enable it — no extra config for email/password.

- `/login` — email/password sign in & sign up, plus "Continue with Google".
- `/account` — signed-in user's profile editor (name, university, major, degree, etc.).
  Saving writes to the `profiles` table; once `university` is filled the member appears
  in the community directory.
- `src/middleware.ts` refreshes the session on every request.
- `/auth/callback` exchanges the OAuth / email-confirmation code for a session.

### Supabase dashboard setup

1. **Authentication → URL Configuration**: add your site URL and the redirect
   `https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback` for local dev).
2. **Email/password** works out of the box (toggle "Confirm email" as you prefer).
3. **Google** (optional): Authentication → Providers → Google → enable, then paste a
   Client ID / Secret from a Google Cloud OAuth credential whose authorized redirect URI is
   `https://<project-ref>.supabase.co/auth/v1/callback`.

When the env vars are absent, the login page shows a friendly "not configured" notice and
the rest of the site keeps working on mock data.

## Project structure

```
src/
  app/
    layout.tsx              # root layout: navbar + footer + global metadata
    page.tsx                # landing page
    directory/              # community directory (server page + client filters)
    events/                 # map-first events (server page + client map)
    crowdfunding/           # feed + [id] full campaign page + donate panel
  components/               # Navbar, Footer, Avatar, Progress, Reveal
  lib/data.ts               # mock data layer (replace with Supabase/API)
```

## Roadmap

These are scaffolded in the spec but not yet built in this MVP:

- Supabase Auth (Google OAuth, email, university verification) and role system
- NestJS backend for business logic, moderation, and donation processing
- Stripe / PayPal integration (the donate panel is a UI placeholder)
- Mapbox integration to replace the stylized map
- Clubs, mentorship, scholarship, news, and admin modules
