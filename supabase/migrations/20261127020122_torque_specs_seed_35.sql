-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 35
-- 20261127020122_torque_specs_seed_35.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: volvo-lug-nut-torque-specs
-- Rows: 20 wheel lug-nut rows, copied by script exactly as the page
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
  ('Volvo', 'S40', 2001, 2007, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S40', 2008, 2008, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S40', 2009, 2009, 'Wheel lug nut — (w/Recessed flange)', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S40', 2009, 2009, 'Wheel lug nut — (w/o Recessed flange)', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S40', 2010, 2011, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S60R', 2004, 2007, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S80', 2001, 2006, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'S80', 2007, 2016, 'Wheel lug nut — final Stage 2 (tighten in stages; Stage 1: 15 ft-lbs)', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V40', 2001, 2002, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V40', 2003, 2004, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V50', 2005, 2007, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V50', 2008, 2008, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V50', 2009, 2009, 'Wheel lug nut — (w/Recessed flange)', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V50', 2009, 2009, 'Wheel lug nut — (w/o Recessed flange)', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V50', 2010, 2011, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V70', 2001, 2007, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V70', 2008, 2010, 'Wheel lug nut — final Stage 2 (tighten in stages; Stage 1: 15 ft-lbs)', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'V70R', 2004, 2007, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'XC70', 2003, 2007, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'XC70', 2008, 2016, 'Wheel lug nut — final Stage 2 (tighten in stages; Stage 1: 15 ft-lbs)', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/');
