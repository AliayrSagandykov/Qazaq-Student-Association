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
