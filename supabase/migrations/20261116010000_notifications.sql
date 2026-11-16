-- ============================================================
-- AutoLeap mechanic portal — Stage 2: in-app notifications
-- 20261116010000_notifications.sql
--
-- In-app only: a Notifications page and an unread count in the
-- navigation. There is no push, email or SMS provider.
--
-- Rows are written by the app at a fixed list of events
-- (appointment booked / cancelled / no-show, estimate sent /
-- approved / declined, invoice sent / paid / void, order moved to
-- a waiting status). related_type + related_id point at the record
-- a notification is about; there is no foreign key because the
-- target can be one of several tables, and a notification is kept
-- even if its record is later deleted (the page says so).
--
-- Single shop: same RLS as every other table — signed-in users
-- can read and write; anonymous users get nothing.
--
-- Additive only. No change to any existing table. No seed rows.
-- No secrets. No DELETE/DROP of existing data.
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null,
  title text not null,
  body text,
  related_type text check (
    related_type is null
    or related_type in ('repair_order', 'appointment', 'customer', 'estimate', 'invoice')
  ),
  related_id uuid,
  is_read boolean not null default false,
  read_at timestamptz
);

-- Unread first, newest first (the page's order and the unread count).
create index if not exists notifications_is_read_created_at_idx
  on public.notifications (is_read, created_at desc);

-- ---------- Row Level Security ----------

alter table public.notifications enable row level security;

drop policy if exists "authenticated_full_access" on public.notifications;
create policy "authenticated_full_access" on public.notifications
  for all to authenticated using (true) with check (true);
