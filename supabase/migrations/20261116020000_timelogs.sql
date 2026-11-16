-- ============================================================
-- AutoLeap mechanic portal — Stage 2: timelogs
-- 20261116020000_timelogs.sql
--
-- A timelog is a RECORD of time spent working on a repair order.
-- It is not billing: it never writes repair_orders.labor_hours or
-- any money total, and it never creates a notification. There is
-- no per-technician identity (single login), so timelogs belong to
-- the repair order only.
--
-- ended_at NULL = the timer is still running. At most one running
-- timelog per order, enforced here by a partial unique index.
-- Deleting a repair order deletes its timelogs (on delete cascade).
--
-- Single shop: same RLS as every other table — signed-in users
-- can read and write; anonymous users get nothing.
--
-- Additive only. No change to any existing table. No seed rows.
-- No secrets. No DELETE/DROP of existing data.
-- ============================================================

create table if not exists public.timelogs (
  id uuid primary key default gen_random_uuid(),
  repair_order_id uuid not null references public.repair_orders (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  check (ended_at is null or ended_at > started_at)
);

-- Newest first per order (the order card and the totals).
create index if not exists timelogs_repair_order_id_started_at_idx
  on public.timelogs (repair_order_id, started_at desc);

-- At most ONE running timelog per order.
create unique index if not exists timelogs_one_running_per_order_idx
  on public.timelogs (repair_order_id)
  where ended_at is null;

-- ---------- Row Level Security ----------

alter table public.timelogs enable row level security;

drop policy if exists "authenticated_full_access" on public.timelogs;
create policy "authenticated_full_access" on public.timelogs
  for all to authenticated using (true) with check (true);
