# Athena - Design System

A working reference for the "look and feel" decisions, so they're explicit
and easy to adjust rather than buried in component code.

## Design intent

Athena is used by people who are frightened or grieving. The UI should feel
warm, human, and calm under pressure - closer to a well-designed nonprofit
or editorial site than a corporate SaaS dashboard. Nothing about the visual
language should say "startup app"; it should say "someone cares about this."

## Type

- **Display / headings - Fraunces**: a warm serif with real personality
  (subtle ink-trap detailing, supports italic). Used for the wordmark, page
  titles, and section headings. This is what gives Athena an emotional,
  human register instead of a clinical one.
- **Body / UI - Manrope**: a clean geometric sans, highly legible at small
  sizes. Used for everything people have to read quickly under stress: form
  labels, case details, alerts, buttons.

Both load via `next/font/google` in `src/lib/fonts.ts` - swap the font names
there if you want to try alternatives (e.g. Fraunces -> Lora, Manrope -> Inter).

## Color

Defined as CSS variables in `src/app/globals.css` (HSL triples, consumed by
Tailwind via `tailwind.config.ts`), with a `.dark` override for dark mode.

| Token | Role | Feel |
|---|---|---|
| `--primary` | main CTAs, links | warm amber/terracotta - urgency with warmth, not alarm |
| `--secondary` | supporting actions, "safe/found" states | deep teal - calm, trustworthy |
| `--urgent` | lost-pet CTAs, behavioral alert badges | coral-red - reserved for genuine urgency |
| `--accent` | soft section backgrounds, highlighted cards | warm peach tint |
| `--background` / `--foreground` | page background / body text | warm off-white / warm charcoal, never pure white or black |

Rule of thumb: `--urgent` is reserved for things that are actually urgent
(a missing pet, a behavioral safety flag). Using it for anything else dilutes
it exactly where it matters most.

## Motion

Framer Motion, used sparingly and consistently:

- Page/section entrances: fade + slight upward slide (`fade-up`), staggered
  by ~80ms per item so groups of cards feel considered rather than instant.
- Hover on interactive cards: a small upward translate + shadow, not scale
  (scale reads as "toy-like" at this content density).
- Nothing blocks interaction - no animation gates a person from filing a
  report, per the emergency-first UX principle in the concept brief.

## Extending this system

- New UI primitives should follow the existing pattern in
  `src/components/ui/` (a `cva` variants object + `cn()` for merging classes)
  so behavioral-alert badges, verification badges, and donation-fund labels
  all feel like one family instead of one-off styles.
- If/when a real logo exists, drop it in `public/` and swap the text
  wordmark in `src/components/layout/header.tsx`.
