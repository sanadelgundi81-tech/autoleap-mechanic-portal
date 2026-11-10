-- ============================================================
-- AutoLeap mechanic portal — Stage 1 foundation schema
-- 20261110010000_autoleap_foundation.sql
--
-- Functional spec: ~/workspace/autoleap/reference-spec-2026-11-10.md
-- (11 screenshots of the real AutoLeap technician app; fields and
-- workflow only — the app's teal branding is NOT copied.)
--
-- Tables: customers, vehicles, repair_orders, estimates,
-- invoices, appointments, inspection_templates,
-- inspection_template_items, inspections, inspection_results.
--
-- Single shop for now. Row Level Security is ON for every
-- table: only authenticated (signed-in) users can read or
-- write. There is no public/anonymous access.
--
-- The inspection checklist is data-driven: the "Comprehensive
-- Inspection" template (56 items in 7 sections) lives in
-- inspection_templates / inspection_template_items, seeded by
-- supabase/seed.sql. Adding, renaming or removing a checklist
-- item is a row edit, not a code change. Unmarked = no
-- inspection_results row for that item.
--
-- Additive only. No secrets in this file. No DELETE/DROP
-- of existing data. Safe to apply to a fresh project.
-- ============================================================

-- gen_random_uuid() is a core function since Postgres 13, so no
-- extension is needed for UUID defaults.

-- ---------- Enums ----------

-- Order statuses as seen in the reference app. The Orders list
-- splits on these: Assigned = everything except 'invoice';
-- Completed = 'invoice' (job done and billed).
create type public.repair_order_status as enum (
  'estimate',
  'waiting_for_approval',
  'waiting_for_parts',
  'appointment_confirmed',
  'invoice'
);

create type public.repair_order_priority as enum (
  'low',
  'medium',
  'high'
);

create type public.estimate_status as enum (
  'draft',
  'sent',
  'approved',
  'declined'
);

create type public.invoice_status as enum (
  'draft',
  'sent',
  'paid',
  'void'
);

create type public.appointment_status as enum (
  'booked',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

create type public.inspection_status as enum (
  'in_progress',
  'complete'
);

-- Per-item marking. There is no 'unmarked' value: an item with
-- no inspection_results row is unmarked.
create type public.inspection_result_state as enum (
  'good',
  'attention',
  'failed'
);

-- ---------- Number sequences ----------
-- Repair order numbers continue from RO-20841 / RO-20842,
-- which are the two sample orders in supabase/seed.sql.

create sequence if not exists public.ro_number_seq start with 20843;
create sequence if not exists public.invoice_number_seq start with 1001;

-- ---------- updated_at helper ----------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- customers ----------

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- vehicles ----------

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  year integer check (year is null or (year between 1900 and 2100)),
  make text not null,
  model text not null,
  trim text,
  transmission text,
  engine text,
  vin text,
  license_plate text,
  mileage_km integer check (mileage_km is null or mileage_km >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_customer_id_idx on public.vehicles (customer_id);

-- ---------- repair_orders ----------

create table if not exists public.repair_orders (
  id uuid primary key default gen_random_uuid(),
  ro_number text not null unique
    default ('RO-' || lpad(nextval('public.ro_number_seq')::text, 5, '0')),
  customer_id uuid not null references public.customers (id) on delete restrict,
  vehicle_id uuid not null references public.vehicles (id) on delete restrict,
  status public.repair_order_status not null default 'estimate',
  priority public.repair_order_priority not null default 'medium',
  concern text,
  technician text,
  bay text,
  odometer_km integer check (odometer_km is null or odometer_km >= 0),
  labor_hours numeric(6, 2) not null default 0 check (labor_hours >= 0),
  labor_rate numeric(10, 2) not null default 0 check (labor_rate >= 0),
  parts_total numeric(10, 2) not null default 0 check (parts_total >= 0),
  shop_notes text,
  customer_recommendations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists repair_orders_customer_id_idx on public.repair_orders (customer_id);
create index if not exists repair_orders_vehicle_id_idx on public.repair_orders (vehicle_id);
create index if not exists repair_orders_status_idx on public.repair_orders (status);

-- ---------- estimates ----------

create table if not exists public.estimates (
  id uuid primary key default gen_random_uuid(),
  repair_order_id uuid not null references public.repair_orders (id) on delete cascade,
  status public.estimate_status not null default 'draft',
  labor_total numeric(10, 2) not null default 0 check (labor_total >= 0),
  parts_total numeric(10, 2) not null default 0 check (parts_total >= 0),
  tax numeric(10, 2) not null default 0 check (tax >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists estimates_repair_order_id_idx on public.estimates (repair_order_id);

-- ---------- invoices ----------

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  repair_order_id uuid not null references public.repair_orders (id) on delete cascade,
  invoice_number text not null unique
    default ('INV-' || lpad(nextval('public.invoice_number_seq')::text, 4, '0')),
  status public.invoice_status not null default 'draft',
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  tax numeric(10, 2) not null default 0 check (tax >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_repair_order_id_idx on public.invoices (repair_order_id);

-- ---------- appointments ----------

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  repair_order_id uuid references public.repair_orders (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  service text,
  status public.appointment_status not null default 'booked',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create index if not exists appointments_customer_id_idx on public.appointments (customer_id);
create index if not exists appointments_starts_at_idx on public.appointments (starts_at);

-- ---------- inspection_templates ----------
-- Data-driven checklist definitions. One row per inspection
-- type (e.g. "Comprehensive Inspection"). Items live in
-- inspection_template_items below.

create table if not exists public.inspection_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- inspection_template_items ----------

create table if not exists public.inspection_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.inspection_templates (id) on delete cascade,
  section text not null,
  section_order integer not null,
  position integer not null,
  name text not null,
  is_free_text boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, section_order, position)
);

create index if not exists inspection_template_items_template_id_idx
  on public.inspection_template_items (template_id);

-- ---------- inspections ----------
-- One inspection per repair order per template.

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  repair_order_id uuid not null references public.repair_orders (id) on delete cascade,
  template_id uuid not null references public.inspection_templates (id) on delete restrict,
  status public.inspection_status not null default 'in_progress',
  assigned_to text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (repair_order_id, template_id)
);

create index if not exists inspections_repair_order_id_idx on public.inspections (repair_order_id);

-- ---------- inspection_results ----------
-- One row per marked item. No row = unmarked.

create table if not exists public.inspection_results (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  template_item_id uuid not null references public.inspection_template_items (id) on delete cascade,
  state public.inspection_result_state not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (inspection_id, template_item_id)
);

create index if not exists inspection_results_inspection_id_idx
  on public.inspection_results (inspection_id);

-- ---------- updated_at triggers ----------

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

drop trigger if exists set_repair_orders_updated_at on public.repair_orders;
create trigger set_repair_orders_updated_at
  before update on public.repair_orders
  for each row execute function public.set_updated_at();

drop trigger if exists set_estimates_updated_at on public.estimates;
create trigger set_estimates_updated_at
  before update on public.estimates
  for each row execute function public.set_updated_at();

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

drop trigger if exists set_inspection_templates_updated_at on public.inspection_templates;
create trigger set_inspection_templates_updated_at
  before update on public.inspection_templates
  for each row execute function public.set_updated_at();

drop trigger if exists set_inspection_template_items_updated_at on public.inspection_template_items;
create trigger set_inspection_template_items_updated_at
  before update on public.inspection_template_items
  for each row execute function public.set_updated_at();

drop trigger if exists set_inspections_updated_at on public.inspections;
create trigger set_inspections_updated_at
  before update on public.inspections
  for each row execute function public.set_updated_at();

drop trigger if exists set_inspection_results_updated_at on public.inspection_results;
create trigger set_inspection_results_updated_at
  before update on public.inspection_results
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
-- Single shop: every signed-in user can read and write all
-- shop data. Anonymous (not signed in) users get nothing.

alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.repair_orders enable row level security;
alter table public.estimates enable row level security;
alter table public.invoices enable row level security;
alter table public.appointments enable row level security;
alter table public.inspection_templates enable row level security;
alter table public.inspection_template_items enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_results enable row level security;

drop policy if exists "authenticated_full_access" on public.customers;
create policy "authenticated_full_access" on public.customers
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.vehicles;
create policy "authenticated_full_access" on public.vehicles
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.repair_orders;
create policy "authenticated_full_access" on public.repair_orders
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.estimates;
create policy "authenticated_full_access" on public.estimates
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.invoices;
create policy "authenticated_full_access" on public.invoices
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.appointments;
create policy "authenticated_full_access" on public.appointments
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.inspection_templates;
create policy "authenticated_full_access" on public.inspection_templates
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.inspection_template_items;
create policy "authenticated_full_access" on public.inspection_template_items
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.inspections;
create policy "authenticated_full_access" on public.inspections
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_full_access" on public.inspection_results;
create policy "authenticated_full_access" on public.inspection_results
  for all to authenticated using (true) with check (true);
