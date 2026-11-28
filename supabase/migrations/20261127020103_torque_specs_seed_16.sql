-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 16
-- 20261127020103_torque_specs_seed_16.sql
--
-- Source: jimburkeford.com — Ford F-150 lug nut torque research (https://www.jimburkeford.com/ford-f-150-lug-nut-torque-research/)
-- Rows: 5 wheel lug-nut rows, copied by script exactly as the page
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
  ('Ford', 'F-150', 1975, 1979, 'Wheel lug nut — 1st-gen F-150', null, null, 100, null, 'https://www.jimburkeford.com/ford-f-150-lug-nut-torque-research/'),
  ('Ford', 'F-150', 1980, 1986, 'Wheel lug nut — 7th-gen F-150', null, null, 100, null, 'https://www.jimburkeford.com/ford-f-150-lug-nut-torque-research/'),
  ('Ford', 'F-150', 1987, 1991, 'Wheel lug nut — 8th-gen F-150', null, null, 100, null, 'https://www.jimburkeford.com/ford-f-150-lug-nut-torque-research/'),
  ('Ford', 'F-150 SVT Lightning', 1993, 1995, 'Wheel lug nut — 12 mm studs', null, null, 100, null, 'https://www.jimburkeford.com/ford-f-150-lug-nut-torque-research/'),
  ('Ford', 'F-150 SVT Lightning', 2000, 2004, 'Wheel lug nut — 14 mm studs', null, null, 150, null, 'https://www.jimburkeford.com/ford-f-150-lug-nut-torque-research/');
