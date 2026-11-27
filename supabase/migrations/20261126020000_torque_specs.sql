-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs
-- 20261126020000_torque_specs.sql
--
-- A shop reference table of fastener torque values: one row per
-- vehicle generation × job (e.g. "Wheel lug nut", "Oil drain plug").
-- Reference only — always verify against the vehicle's service manual.
--
-- Every row carries its source. The seed rows (the
-- 202611260201NN_torque_specs_seed_NN.sql files) are copied from free
-- public charts exactly as stated; the shop adds, edits and deletes rows
-- in the app as it looks specs up.
--
-- torque_nm / torque_ftlb: the value in each unit, as the source states
--   it. A unit the source does not state is null (the app shows a
--   converted figure marked as converted; the stored data is never
--   converted). At least one unit is required.
-- torque_nm_max / torque_ftlb_max: upper end when the source gives a
--   range ("81–96 ft-lb"); null for a single value.
-- year_to null = "to present".
--
-- Single shop: same RLS as every other table — signed-in users can
-- read and write; anonymous users get nothing.
--
-- Additive only. New table, no change to any existing table.
-- No DELETE/DROP of existing data. No secrets.
-- ============================================================

create table if not exists public.torque_specs (
  id uuid primary key default gen_random_uuid(),
  make text not null check (length(trim(make)) > 0),
  model text not null check (length(trim(model)) > 0),
  year_from integer not null check (year_from between 1900 and 2100),
  year_to integer null check (year_to is null or year_to >= year_from),
  job text not null check (length(trim(job)) > 0),
  torque_nm numeric null check (torque_nm is null or torque_nm > 0),
  torque_nm_max numeric null,
  torque_ftlb numeric null check (torque_ftlb is null or torque_ftlb > 0),
  torque_ftlb_max numeric null,
  source text not null check (length(trim(source)) > 0),
  created_at timestamptz not null default now(),
  check (torque_nm is not null or torque_ftlb is not null),
  check (torque_nm_max is null or (torque_nm is not null and torque_nm_max >= torque_nm)),
  check (torque_ftlb_max is null or (torque_ftlb is not null and torque_ftlb_max >= torque_ftlb))
);

create index if not exists torque_specs_make_model_year_idx
  on public.torque_specs (make, model, year_from);

-- ---------- Row Level Security ----------

alter table public.torque_specs enable row level security;

drop policy if exists "authenticated_full_access" on public.torque_specs;
create policy "authenticated_full_access" on public.torque_specs
  for all to authenticated using (true) with check (true);
