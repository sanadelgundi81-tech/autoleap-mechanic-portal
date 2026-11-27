-- ============================================================
-- AutoLeap mechanic portal — prompt 14: job timer + labour rates
-- 20261126010000_prompt14_timer_rates.sql
--
-- A timer run on a service line now BILLS that line: when it stops,
-- the app adds the elapsed time (rounded to 0.1 h) to the service's
-- labor_hours and sets its labor_rate to the job's rate (small job
-- $50/hr, everything else $75/hr — src/lib/laborRates.ts). This
-- changes the rule stated in 20261116020000_timelogs.sql for runs
-- with a service attached only. Runs with no service (the existing
-- order-level timer) are unchanged: a record of time, not billing.
--
-- repair_order_service_id: which service line the run was on; null =
--   order-level run (every existing row stays valid as it is).
-- hourly_rate_cents: the rate that applied, frozen at stop time so a
--   later rate change never rewrites history. Null for order-level runs.
--
-- The existing partial unique index (one running timelog per order)
-- is kept: one mechanic, one job at a time.
--
-- Additive only. No DELETE/DROP of data. No seed rows. No secrets.
-- RLS: timelogs already has authenticated full access; unchanged.
-- ============================================================

alter table public.timelogs
  add column if not exists repair_order_service_id uuid null
    references public.repair_order_services (id) on delete set null;

alter table public.timelogs
  add column if not exists hourly_rate_cents integer null
    check (hourly_rate_cents is null or hourly_rate_cents >= 0);

create index if not exists timelogs_repair_order_service_id_idx
  on public.timelogs (repair_order_service_id);
