-- ============================================================
-- AutoLeap mechanic portal — Stage 2: shop settings
-- 20261117010000_shop_settings.sql
--
-- One row of shop-wide settings (single shop, single login).
-- The only setting so far: the default WhatsApp country code,
-- used to build wa.me links from phones stored without one.
--
-- whatsapp_country_code holds digits only, without "+": 1 to 3
-- digits, not starting with 0 (e.g. '44', '1', '971').
-- NULL = not set: phones are used exactly as stored.
--
-- id is fixed at 1 so there can never be a second row. The row is
-- created here with the code NOT set, so the app only ever reads
-- and updates it.
--
-- Single shop: same RLS as every other table — signed-in users
-- can read and write; anonymous users get nothing.
--
-- Additive only. No change to any existing table. No secrets.
-- No DELETE/DROP of existing data.
-- ============================================================

create table if not exists public.shop_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_country_code text
    check (whatsapp_country_code is null or whatsapp_country_code ~ '^[1-9][0-9]{0,2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The single settings row, with nothing set.
insert into public.shop_settings (id) values (1) on conflict (id) do nothing;

-- ---------- updated_at trigger ----------

drop trigger if exists set_shop_settings_updated_at on public.shop_settings;
create trigger set_shop_settings_updated_at
  before update on public.shop_settings
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------

alter table public.shop_settings enable row level security;

drop policy if exists "authenticated_full_access" on public.shop_settings;
create policy "authenticated_full_access" on public.shop_settings
  for all to authenticated using (true) with check (true);
