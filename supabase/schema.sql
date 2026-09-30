-- Athena database schema (Phase 1/2)
-- Run this in the Supabase SQL editor after creating your project.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where practical.
-- NOTE: this project has not been deployed anywhere yet, so this file is
-- still edited in place rather than through migrations.

create extension if not exists postgis;
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, mirrors auth.users
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pets: the animal at the center of a case (optional - a FOUND case may not
-- know the pet's identity yet, so pet_id on cases is nullable)
-- ---------------------------------------------------------------------------
create table if not exists pets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles (id) on delete set null,
  name text,
  species text,
  breed text,
  sex text,
  color text,
  distinctive_markings text,
  collar_description text,
  photo_urls text[] default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- cases: the core record for LOST / SEEN / FOUND / HELP
-- ---------------------------------------------------------------------------
create table if not exists cases (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('lost', 'seen', 'found', 'help')),
  status text not null default 'open' check (status in ('open', 'resolved', 'closed')),
  verification_level text not null default 'unverified'
    check (verification_level in ('unverified', 'identity_verified', 'rescue_verified', 'vet_verified')),

  pet_id uuid references pets (id) on delete set null,
  reporter_id uuid references profiles (id) on delete set null,

  title text not null,
  description text,

  -- e.g. {DO_NOT_CHASE, SKITTISH, INJURED, MAY_BITE, FOOD_MOTIVATED}
  behavioral_flags text[] default '{}',

  last_known_location geography(point, 4326),
  location_label text,
  photo_urls text[] default '{}',

  contact_preference text,
  special_instructions text,

  -- FOUND-specific fields; left null for other case types
  found_contained boolean,
  found_taken_to text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds these columns if the table already existed
-- from an earlier version of this schema.
alter table cases add column if not exists photo_urls text[] default '{}';
alter table cases add column if not exists found_contained boolean;
alter table cases add column if not exists found_taken_to text;

create index if not exists cases_location_idx on cases using gist (last_known_location);
create index if not exists cases_type_status_idx on cases (type, status);

-- ---------------------------------------------------------------------------
-- case_events: the timeline + map markers for a case
-- ---------------------------------------------------------------------------
create table if not exists case_events (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid not null references cases (id) on delete cascade,

  event_type text not null check (event_type in (
    'last_known', 'possible_sighting', 'confirmed_sighting', 'tracks_clues',
    'bedding', 'food_trap_station', 'accident_origin', 'found_contained',
    'update', 'note'
  )),

  location geography(point, 4326),
  occurred_at timestamptz not null default now(),
  description text,
  photo_urls text[] default '{}',

  reported_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists case_events_case_id_idx on case_events (case_id);
create index if not exists case_events_location_idx on case_events using gist (location);

-- ---------------------------------------------------------------------------
-- case_media: uploaded files, linked to a case and optionally one event
-- (storage_path points into the Supabase Storage bucket "case-media")
-- Not used by the Phase 2 forms yet (they store URLs directly on
-- pets.photo_urls / cases.photo_urls) - kept for a future structured-media
-- pass (e.g. per-event photo galleries).
-- ---------------------------------------------------------------------------
create table if not exists case_media (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid not null references cases (id) on delete cascade,
  event_id uuid references case_events (id) on delete set null,
  storage_path text not null,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- donations: scaffolded now, not wired to the app until Phase 5.
-- case_id null = a platform-level "Support Athena" donation.
-- ---------------------------------------------------------------------------
create table if not exists donations (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid references cases (id) on delete set null,
  fund_type text not null check (fund_type in ('help_this_pet', 'emergency_fund', 'support_athena')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  donor_email text,
  stripe_payment_intent_id text,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security.
--
-- Reporting is anonymous-friendly on purpose: per the concept brief's
-- "emergency-first UX" principle, nothing should gate someone from filing a
-- LOST/SEEN/FOUND report, including a login wall. reporter_id / reported_by
-- are nullable, and inserts are allowed for the public (anon) role as long
-- as the row doesn't claim to belong to a different signed-in user than the
-- one making the request.
--
-- TODO before Phase 2 ships publicly: decide whether last_known_location /
-- case_events.location should be fuzzed for public display (see brief
-- section 12 on privacy). Right now these policies expose exact coordinates
-- to anyone, which is fine for local dev but should be revisited before
-- real addresses ever get entered.
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table pets enable row level security;
alter table cases enable row level security;
alter table case_events enable row level security;
alter table case_media enable row level security;
alter table donations enable row level security;

drop policy if exists "profiles are self-manageable" on profiles;
create policy "profiles are self-manageable" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "pets are publicly readable" on pets;
create policy "pets are publicly readable" on pets
  for select using (true);

drop policy if exists "anyone can register a pet on a report" on pets;
create policy "anyone can register a pet on a report" on pets
  for insert to public with check (owner_id is null or auth.uid() = owner_id);

drop policy if exists "open cases are publicly readable" on cases;
create policy "open cases are publicly readable" on cases
  for select using (true);

drop policy if exists "anyone can file a report" on cases;
create policy "anyone can file a report" on cases
  for insert to public with check (reporter_id is null or auth.uid() = reporter_id);

drop policy if exists "reporters can update their own cases" on cases;
create policy "reporters can update their own cases" on cases
  for update using (auth.uid() = reporter_id);

drop policy if exists "case events are publicly readable" on case_events;
create policy "case events are publicly readable" on case_events
  for select using (true);

drop policy if exists "anyone can add a case event" on case_events;
create policy "anyone can add a case event" on case_events
  for insert to public with check (reported_by is null or auth.uid() = reported_by);

drop policy if exists "case media is publicly readable" on case_media;
create policy "case media is publicly readable" on case_media
  for select using (true);

drop policy if exists "anyone can attach case media" on case_media;
create policy "anyone can attach case media" on case_media
  for insert to public with check (uploaded_by is null or auth.uid() = uploaded_by);

-- ---------------------------------------------------------------------------
-- Map views (Phase 3): flatten the PostGIS geography columns into plain
-- lat/lng numbers so the Supabase JS client can select them directly for
-- Leaflet, without a raw-SQL/RPC round trip. These read through to the same
-- rows the public select policies above already expose, so no new access is
-- granted - they're a convenience projection, not a security boundary.
-- ---------------------------------------------------------------------------
create or replace view public.case_pins as
select
  c.id,
  c.type,
  c.status,
  c.title,
  c.created_at,
  st_y(c.last_known_location::geometry) as lat,
  st_x(c.last_known_location::geometry) as lng
from public.cases c
where c.last_known_location is not null
  and c.status in ('open', 'resolved');

create or replace view public.case_event_pins as
select
  e.id,
  e.case_id,
  e.event_type,
  e.description,
  e.occurred_at,
  st_y(e.location::geometry) as lat,
  st_x(e.location::geometry) as lng
from public.case_events e
where e.location is not null;

grant select on public.case_pins to anon, authenticated;
grant select on public.case_event_pins to anon, authenticated;
