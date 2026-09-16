# Athena

Community-powered pet search, rescue & emergency assistance network.
See the full concept brief in the "Athena Website" Claude project for the
complete vision - this repo is Phase 0/1 of that: the app scaffold, design
system, and database schema.

## Status

This is a hand-built scaffold. It has **not** been run through `npm install`
or `npm run build` yet - the sandboxed environment that generated it doesn't
have access to the npm registry, so the very first thing to do is run it
locally and tell me about any errors so we fix them together immediately.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** - Postgres (with PostGIS for geospatial queries), Auth, Storage
- **Leaflet** + OpenStreetMap tiles for maps (no API key, no usage cap)
- **Framer Motion** for animation
- **Vercel** for hosting (free tier)

Why this stack: everything above has a genuinely free tier suitable for an
MVP with modest traffic, it's one language (TypeScript) front-to-back, and
none of it locks you into a paid plan before Athena has real usage to justify
one.

## 1. Accounts to create (free)

1. **GitHub** - github.com - to hold the code and connect to Vercel.
2. **Vercel** - vercel.com - sign up with GitHub. This is where the site
   will be hosted.
3. **Supabase** - supabase.com - sign up, then "New project". Pick a region
   close to West Virginia (e.g. US East). Save the database password it
   generates somewhere safe.

## 2. Local setup

```bash
# from inside this folder
npm install
cp .env.local.example .env.local
```

Open `.env.local` and fill in the two `NEXT_PUBLIC_SUPABASE_*` values from
your Supabase project: **Project Settings -> API**. Leave the Stripe values
blank for now - those come in the donations phase.

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the Athena landing page.

## 3. Set up the database

In the Supabase dashboard, open **SQL Editor**, paste the contents of
`supabase/schema.sql`, and run it. This creates all tables (profiles, pets,
cases, case_events, case_media, donations), enables PostGIS, and turns on
Row Level Security with starter policies.

## 4. Deploy to Vercel

1. Push this repo to a new GitHub repository.
2. In Vercel: "Add New Project" -> import that repo.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings (Settings -> Environment Variables).
4. Deploy. Vercel gives you a free `*.vercel.app` URL immediately; a custom
   domain can be added later whenever you register one.

## Project structure

```
src/app/                 routes (App Router) - each folder is a URL
src/components/ui/       small reusable primitives (Button, Card)
src/components/layout/   Header, Footer
src/lib/supabase/        Supabase client helpers (browser + server)
src/lib/fonts.ts         the two Google Fonts used site-wide
supabase/schema.sql      full database schema, run once in Supabase
DESIGN.md                the visual system - colors, type, motion
```

## What's next (see the phased plan)

- **Phase 1** (current): scaffold, design system, schema - you're here.
- **Phase 2**: real LOST / SEEN / FOUND forms wired to Supabase, photo upload.
- **Phase 3**: live case map (Leaflet + clustering) and timeline.
- **Phase 4**: basic case communication / update notifications.
- **Phase 5**: donations (Stripe), with the fund-type separation from the brief.
- **Phase 6**: shareable case cards/QR codes, PWA polish, accessibility pass.
