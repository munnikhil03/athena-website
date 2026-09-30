# Athena - Design System

A working reference for the "look and feel" decisions, so they're explicit
and easy to adjust rather than buried in component code.

## Design intent

Athena is used by people who are frightened or grieving. The UI should feel
warm, human, and calm under pressure - closer to a well-designed nonprofit
or editorial site than a corporate SaaS dashboard.

## Logo

The mark is a teal map-pin silhouette with a cream paw print cut out of the
head, set beside "Athena" in Fraunces (`src/components/logo.tsx`, favicon at
`src/app/icon.svg`). It was picked over nine other directions (an owl, a
guiding star, an abstract "connection" mark, badges/crests, wordmark-only)
specifically because it isn't just decorative - it's the same pin glyph the
live case map uses for LOST/SEEN/FOUND reports, so the logo and the product
reinforce each other. See the project's build-plan notes for the full
review history if you want to revisit this.

## Type

- **Display / headings - Fraunces**: a warm serif with real personality
  (subtle ink-trap detailing, supports italic). Used for the wordmark, page
  titles, and section headings.
- **Body / UI - Manrope**: a clean geometric sans, highly legible at small
  sizes. Used for everything people have to read quickly under stress: form
  labels, case details, alerts, buttons.

Both load via `next/font/google` in `src/lib/fonts.ts`.

## Color

Defined as CSS variables in `src/app/globals.css` (HSL triples, consumed by
Tailwind via `tailwind.config.ts`), with a `.dark` override for dark mode
(not currently switched on anywhere in the UI, but ready).

| Token | Hex | Role |
|---|---|---|
| `--primary` | `#176B6B` deep teal | signature color - wordmark, main CTAs, links |
| `--secondary` | `#8FB9A8` muted sage | supporting actions, calmer accents |
| `--accent` | `#E5A93D` warm gold | highlights, the paw print, restrained "hope" accent |
| `--urgent` | `#C94C4C` warm red | reserved almost entirely for genuine urgency (LOST alerts, behavioral flags) |
| `--found` | `#3D7A57` deep green | reunited / safe states |
| `--clue` | `#7B5EA7` muted violet | clue / bedding location markers |
| `--background` | `#FAF7F0` soft cream | page background - never sterile white |
| `--foreground` | `#263238` deep charcoal | body text |

Rule of thumb: `--urgent` is reserved for things that are actually urgent.
Using it for anything else dilutes it exactly where it matters most.

### Map pin color semantics (Phase 3, live)

The live case map (`/map`, and the map on every case page) uses color as
information, not decoration - implemented in `src/lib/map/pin-colors.ts`:

- Red (`--urgent`) - LOST
- Gold/orange (`--accent`) - SIGHTING
- Teal (`--primary`) - FOUND PET / unknown owner
- Green (`--found`) - REUNITED (any case marked `resolved`)
- Purple (`--clue`) - CLUE / bedding location (from a case's timeline events)

So a panicked owner can read what's happening on the map without opening
every marker. The `MapLegend` component renders this same legend anywhere
the map appears.

## Motion

Framer Motion, used sparingly and consistently:

- Page/section entrances: fade + slight upward slide (`fade-up`), staggered
  by ~80ms per item.
- Hover on interactive cards: a small upward translate + shadow, not scale.
- Nothing blocks interaction - no animation gates a person from filing a
  report, per the emergency-first UX principle in the concept brief.

## Extending this system

- New UI primitives should follow the existing pattern in
  `src/components/ui/` (a `cva` variants object + `cn()` for merging classes).
- The logo's exact SVG paths live in `src/components/logo.tsx` and
  `src/app/icon.svg` - keep them in sync if the mark is refined further.
