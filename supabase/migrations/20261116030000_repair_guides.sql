-- ============================================================
-- AutoLeap mechanic portal — Stage 2: repair guides
-- 20261116030000_repair_guides.sql
--
-- A library of the shop's own reference material, in four
-- categories: procedures, specs, wiring and bulletins. Every
-- guide is typed in by the shop. There is no external feed
-- (no ProDemand or any other source) and no seed content: the
-- table starts empty.
--
-- vehicle_make / vehicle_model / year_from / year_to say what a
-- guide applies to. All are optional; a guide with no make
-- applies to every vehicle.
--
-- The checks are a backstop for the app's own validation. The
-- upper year limit ("next year") moves with the calendar, so it
-- is enforced in the app, not here.
--
-- Single shop: same RLS as every other table — signed-in users
-- can read and write; anonymous users get nothing.
--
-- Additive only. No change to any existing table. No seed rows.
-- No secrets. No DELETE/DROP of existing data.
-- ============================================================

create type public.repair_guide_category as enum (
  'procedure',
  'spec',
  'wiring',
  'bulletin'
);

create table if not exists public.repair_guides (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  category public.repair_guide_category not null,
  content text not null check (length(btrim(content)) > 0),
  vehicle_make text,
  vehicle_model text,
  year_from integer check (year_from is null or year_from >= 1900),
  year_to integer check (year_to is null or year_to >= 1900),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (year_from is null or year_to is null or year_to >= year_from)
);

-- One list per category, by title.
create index if not exists repair_guides_category_title_idx
  on public.repair_guides (category, title);

-- ---------- updated_at trigger ----------

drop trigger if exists set_repair_guides_updated_at on public.repair_guides;
create trigger set_repair_guides_updated_at
  before update on public.repair_guides
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------

alter table public.repair_guides enable row level security;

drop policy if exists "authenticated_full_access" on public.repair_guides;
create policy "authenticated_full_access" on public.repair_guides
  for all to authenticated using (true) with check (true);
