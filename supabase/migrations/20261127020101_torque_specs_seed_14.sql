-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 14
-- 20261127020101_torque_specs_seed_14.sql
--
-- Source: fordmasterx.com — Ford Lug Nut Torque Chart (https://fordmasterx.com/ford-lug-nut-torque-chart/)
-- Rows: 6 wheel lug-nut rows, copied by script exactly as the page
-- states them; each row's source column is the page it came from. A unit
-- the source does not state is null (never converted or guessed).
-- Rows that overlap an existing (prompt 14) row for the same vehicle were
-- NOT added (existing rows are never changed). Reference only — always
-- verify against the vehicle's service manual.
--
-- Additive only: inserts rows, no DELETE/DROP. No secrets.
-- ============================================================

insert into public.torque_specs
  (make, model, year_from, year_to, job, torque_nm, torque_nm_max, torque_ftlb, torque_ftlb_max, source)
values
  ('Ford', 'Bronco', 2025, 2025, 'Wheel lug nut — M12 x 1.5 (excluding Raptor)', 135, null, 100, null, 'https://fordmasterx.com/ford-lug-nut-torque-chart/'),
  ('Ford', 'Bronco Raptor', 2025, 2025, 'Wheel lug nut — M14 x 1.5', 204, null, 150, null, 'https://fordmasterx.com/ford-lug-nut-torque-chart/'),
  ('Ford', 'Bronco Sport', 2022, 2024, 'Wheel lug nut — M12 x 1.5', 135, null, 100, null, 'https://fordmasterx.com/ford-lug-nut-torque-chart/'),
  ('Ford', 'Escape', 2026, 2026, 'Wheel lug nut — M12 x 1.5', 135, null, 100, null, 'https://fordmasterx.com/ford-lug-nut-torque-chart/'),
  ('Ford', 'Mustang', 2025, 2025, 'Wheel lug nut — M14 x 1.5', 204, null, 150, null, 'https://fordmasterx.com/ford-lug-nut-torque-chart/'),
  ('Ford', 'Transit', 2025, 2025, 'Wheel lug nut — M14 x 1.5', 204, null, 150, null, 'https://fordmasterx.com/ford-lug-nut-torque-chart/');
