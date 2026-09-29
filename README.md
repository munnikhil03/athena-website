# Athena

Community-powered pet search, rescue & emergency assistance network.
See the full concept brief in the "Athena Website" Claude project for the
complete vision.

## Status

Hand-built, not yet run through `npm install` / `npm run build` anywhere -
the sandboxed environment that generated this doesn't have access to the
npm registry. Run it locally and report any errors so we fix them together.

Phase 0/1 (scaffold, design system, schema) and Phase 2 (LOST/SEEN/FOUND
report forms, wired to Supabase) are both built. Phase 3 (live case map +
timeline) is next.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** - Postgres (with PostGIS), Auth, Storage
- **Leaflet** + OpenStreetMap tiles for maps (no API key, no usage cap)
- **React Hook Form** + **Zod** for the report forms
- **Framer Motion** for animation
- **Vercel** for hosting (free tier)

## 1. Accounts to create (free)

1. **GitHub** - to hold the code and connect to Vercel.
2. **Vercel** - sign up with GitHub. This is where the site will be hosted.
3. **Supabase** - sign up, then "New project" (pick a region near West
   Virginia, e.g. US East). Save the generated database password somewhere safe.

## 2. Local setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase project's URL and anon key
(**Project Settings -> API**). Leave the Stripe values blank for now.

```bash
npm run dev
```

Visit http://localhost:3000.

## 3. Set up the database

In the Supabase dashboard, open **SQL Editor**, paste the contents of
`supabase/schema.sql`, and run it. This creates all tables, enables PostGIS,
and turns on Row Level Security.

**Reporting is intentionally anonymous-friendly** - per the concept brief's
"emergency-first UX" principle, nobody should have to create an account
before reporting a lost pet. The RLS policies allow inserts from
not-signed-in visitors as long as a row doesn't claim to belong to someone
else's account.

## 4. Set up photo storage

The report forms upload photos to a Supabase Storage bucket. In the
Supabase dashboard:

1. Go to **Storage** -> **New bucket**.
2. Name it exactly `case-media`.
3. Toggle it **Public** (so photo URLs work directly on the site without
   extra signing logic - fine for now since nothing sensitive is stored
   there yet).
4. Under that bucket's **Policies**, add a policy allowing `INSERT` for
   anyone (`anon` and `authenticated`) - by default a public bucket still
   requires an explicit policy to allow uploads, only reads are open.

## 5. Deploy to Vercel

1. Push this repo to a new GitHub repository.
2. In Vercel: "Add New Project" -> import that repo.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings.
4. Deploy.

## Project structure

```
src/app/                    routes (App Router)
src/app/report/lost|seen|found/   the three report forms
src/app/case/[id]/          case detail page (reads a real case from Supabase)
src/components/ui/          small reusable primitives (Button, Card, Input, ...)
src/components/layout/      Header, Footer
src/components/logo.tsx     the Athena mark (map pin + paw print)
src/components/forms/       LocationPicker (Leaflet), PhotoUpload, BehavioralFlags, the 3 report forms
src/lib/supabase/           Supabase client helpers (browser + server)
src/lib/validation/         Zod schemas for the report forms
src/lib/fonts.ts            the two Google Fonts used site-wide
supabase/schema.sql         full database schema, run once in Supabase
DESIGN.md                   the visual system - colors, type, motion, logo rationale
```

## What's next (see the phased plan)

- **Phase 0/1** - scaffold, design system, schema. Done.
- **Phase 2** - real LOST / SEEN / FOUND forms wired to Supabase, photo upload. Done, untested end-to-end.
- **Phase 3** - live case map (Leaflet + clustering, color-coded pins) and timeline on the case page.
- **Phase 4** - basic case communication / update notifications.
- **Phase 5** - donations (Stripe), with the fund-type separation from the brief.
- **Phase 6** - shareable case cards/QR codes, PWA polish, accessibility pass.
