-- ============================================================
-- AutoLeap mechanic portal — Stage 2: order services
-- 20261113010000_order_services.sql
--
-- Services are the line items of a repair order (e.g. "Brake
-- pad replacement"). Each carries its own labour hours × rate
-- and parts total, and a done flag. The order card's wrench
-- counter is done services / total services for that order.
--
-- Deleting a repair order deletes its services (on delete
-- cascade), the same as estimates, invoices and inspections.
--
-- Single shop: same RLS as every other table — signed-in users
-- can read and write; anonymous users get nothing.
--
-- Additive only. No change to any existing table. No secrets.
-- No DELETE/DROP of existing data. Safe to apply to a fresh
-- project after the Stage 1 migrations.
-- ============================================================

create table if not exists public.repair_order_services (
  id uuid primary key default gen_random_uuid(),
  repair_order_id uuid not null references public.repair_orders (id) on delete cascade,
  name text not null,
  description text,
  labor_hours numeric(6, 2) not null default 0 check (labor_hours >= 0),
  labor_rate numeric(10, 2) not null default 0 check (labor_rate >= 0),
  parts_total numeric(10, 2) not null default 0 check (parts_total >= 0),
  is_done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists repair_order_services_repair_order_id_idx
  on public.repair_order_services (repair_order_id);

-- ---------- updated_at trigger ----------

drop trigger if exists set_repair_order_services_updated_at on public.repair_order_services;
create trigger set_repair_order_services_updated_at
  before update on public.repair_order_services
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------

alter table public.repair_order_services enable row level security;

drop policy if exists "authenticated_full_access" on public.repair_order_services;
create policy "authenticated_full_access" on public.repair_order_services
  for all to authenticated using (true) with check (true);
