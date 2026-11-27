-- ============================================================
-- AutoLeap mechanic portal — prompt 16: repair guide links
-- 20261127010000_prompt16_guide_links.sql
--
-- The Repair Guides page becomes one library with two kinds of entry:
--   * the shop's own typed guides (public.repair_guides, unchanged), and
--   * curated EXTERNAL resources, stored here as links only — never copied.
--
-- Each link points at a real public page about one vehicle: an owner's
-- manual (the maker's own site), a parts diagram, an NHTSA recall /
-- bulletin document, a repair video, or an owner forum. `source` names the
-- site the link points to. No text from the linked page is stored.
--
-- vehicle_make / vehicle_model are required (a link is always about a
-- vehicle); year_from / year_to are optional (year_to null = to present).
--
-- The seed rows (20261127010101/02_guide_links_seed_NN.sql) were each
-- fetched and checked before they were added. The shop adds, edits and
-- deletes links in the app.
--
-- Single shop: same RLS as every other table — signed-in users can read
-- and write; anonymous users get nothing.
--
-- Additive only. New table, no change to any existing table.
-- No DELETE/DROP of existing data. No secrets.
-- ============================================================

create table if not exists public.repair_guide_links (
  id uuid primary key default gen_random_uuid(),
  vehicle_make text not null check (length(btrim(vehicle_make)) > 0),
  vehicle_model text not null check (length(btrim(vehicle_model)) > 0),
  year_from integer null check (year_from is null or year_from between 1900 and 2100),
  year_to integer null check (year_to is null or year_to between 1900 and 2100),
  kind text not null check (kind in ('manual', 'diagram', 'bulletin', 'video', 'forum')),
  title text not null check (length(btrim(title)) > 0),
  url text not null check (url ~* '^https?://[^\s]+$'),
  source text not null check (length(btrim(source)) > 0),
  created_at timestamptz not null default now(),
  check (year_from is null or year_to is null or year_to >= year_from)
);

create index if not exists repair_guide_links_vehicle_idx
  on public.repair_guide_links (vehicle_make, vehicle_model, year_from);

-- ---------- Row Level Security ----------

alter table public.repair_guide_links enable row level security;

drop policy if exists "authenticated_full_access" on public.repair_guide_links;
create policy "authenticated_full_access" on public.repair_guide_links
  for all to authenticated using (true) with check (true);
