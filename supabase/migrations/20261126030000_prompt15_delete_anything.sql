-- ============================================================
-- AutoLeap mechanic portal — prompt 15: delete anything (with warnings)
-- 20261126030000_prompt15_delete_anything.sql
--
-- Customers and vehicles with repair orders can now be deleted. Their
-- orders are DETACHED, not deleted: repair_orders.customer_id /
-- vehicle_id become nullable and their foreign keys change from
-- ON DELETE RESTRICT to ON DELETE SET NULL. The order and everything
-- under it (services, estimates, invoices, timelogs, inspection,
-- history) is kept; the app shows "Deleted customer" / "Deleted vehicle".
--
-- No other foreign key changes: vehicles still cascade with their
-- customer, appointments still cascade with the customer and clear the
-- vehicle / order, and an order's own children still cascade with it.
-- The existing indexes on both columns are kept.
--
-- No data is deleted or changed by this migration. No secrets.
-- The constraint names are Postgres's defaults from the foundation
-- migration (repair_orders_<column>_fkey).
-- ============================================================

alter table public.repair_orders
  alter column customer_id drop not null;

alter table public.repair_orders
  drop constraint if exists repair_orders_customer_id_fkey;

alter table public.repair_orders
  add constraint repair_orders_customer_id_fkey
    foreign key (customer_id) references public.customers (id) on delete set null;

alter table public.repair_orders
  alter column vehicle_id drop not null;

alter table public.repair_orders
  drop constraint if exists repair_orders_vehicle_id_fkey;

alter table public.repair_orders
  add constraint repair_orders_vehicle_id_fkey
    foreign key (vehicle_id) references public.vehicles (id) on delete set null;
