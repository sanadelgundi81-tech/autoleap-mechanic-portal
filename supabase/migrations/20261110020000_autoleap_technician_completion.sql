-- ============================================================
-- AutoLeap mechanic portal — technician completion
-- 20261110020000_autoleap_technician_completion.sql
--
-- The Orders list tabs (Assigned / Completed) split on this
-- field, NOT on order status. In the reference app the
-- Completed tab holds orders with statuses like "Waiting For
-- Approval" and "Waiting For Parts", and the Assigned tab also
-- holds "Waiting For Approval" — no status rule reproduces the
-- tabs. The distinction is a per-order technician-completion
-- state: work marked complete (timestamp set) vs still in
-- progress (null). This is separate from the order status
-- workflow (Estimate → … → Invoice), which is unchanged.
--
-- This supersedes the tab rule stated in the Stage 1 migration
-- comment (Assigned = everything except 'invoice'). That file
-- is left exactly as reviewed; the rule now lives here.
--
-- Additive only. No secrets. No DELETE/DROP.
-- ============================================================

alter table public.repair_orders
  add column if not exists technician_completed_at timestamptz;

create index if not exists repair_orders_technician_completed_at_idx
  on public.repair_orders (technician_completed_at);
