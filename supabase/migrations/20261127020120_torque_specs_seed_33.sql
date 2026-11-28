-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 33
-- 20261127020120_torque_specs_seed_33.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: dodge-ram-trucks-lug-nut-torque-specs, pontiac-lug-nut-torque-specs, subaru-lug-nut-torque-specs, suzuki-lug-nut-torque-specs
-- Rows: 44 wheel lug-nut rows, copied by script exactly as the page
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
  ('Pontiac', 'Vibe', 2003, 2010, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Wave', 2005, 2007, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Ram', '1500 Pickup', 2011, 2011, 'Wheel lug nut', null, null, 130, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', '1500 Pickup', 2012, 2015, 'Wheel lug nut', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', '1500 Pickup', 2016, 2017, 'Wheel lug nut — (Cone style nut)', null, null, 130, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', '1500 Pickup', 2016, 2017, 'Wheel lug nut — (Flanged style nut)', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', '2500 Pickup', 2011, 2011, 'Wheel lug nut — Front', null, null, 130, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', '2500 Pickup', 2011, 2011, 'Wheel lug nut — Rear', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', '4500/5500 Pickup', 2011, 2017, 'Wheel lug nut', null, null, 145, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', 'Cargo Van', 2012, 2015, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', 'Dakota', 2011, 2011, 'Wheel lug nut', null, null, 125, 145, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', 'Promaster City', 2015, 2017, 'Wheel lug nut — (w/Aluminum wheels)', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Ram', 'Promaster City', 2015, 2017, 'Wheel lug nut — (w/Steel wheels)', null, null, 64, null, 'https://ricksfreeautorepairadvice.com/dodge-ram-trucks-lug-nut-torque-specs/'),
  ('Subaru', 'B9 Tribeca', 2006, 2007, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Baja', 2003, 2006, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Forester', 2003, 2003, 'Wheel lug nut', null, null, 58, 72, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Forester', 2004, 2009, 'Wheel lug nut', null, null, 65, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Forester', 2010, 2013, 'Wheel lug nut', null, null, 74, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Forester', 2014, 2015, 'Wheel lug nut', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Forester', 2016, 2017, 'Wheel lug nut', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Outback', 2003, 2003, 'Wheel lug nut', null, null, 58, 72, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Outback', 2004, 2005, 'Wheel lug nut', null, null, 65, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Outback', 2006, 2006, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Tribeca', 2008, 2010, 'Wheel lug nut — (Chrome Plated wheels)', null, null, 89, 111, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Tribeca', 2008, 2010, 'Wheel lug nut — (w/Aluminum wheels)', null, null, 74, 89, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Tribeca', 2011, 2012, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Tribeca', 2013, 2014, 'Wheel lug nut — (w/Chrome wheels)', null, null, 111, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'Tribeca', 2013, 2014, 'Wheel lug nut — (w/o Chrome wheels)', null, null, 88.5, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Subaru', 'XV Crosstrek', 2013, 2016, 'Wheel lug nut', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/subaru-lug-nut-torque-specs/'),
  ('Suzuki', 'Aerio', 2002, 2007, 'Wheel lug nut', null, null, 61.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Aerio SX', 2002, 2006, 'Wheel lug nut', null, null, 61.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Equator', 2009, 2012, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Esteem', 2001, 2002, 'Wheel lug nut', null, null, 61.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Forenza', 2004, 2004, 'Wheel lug nut', null, null, 74, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Forenza', 2005, 2008, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Grand Vitara', 2001, 2013, 'Wheel lug nut', null, null, 72.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Kizashi', 2010, 2013, 'Wheel lug nut', null, null, 103.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Reno', 2005, 2008, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'SX4', 2007, 2013, 'Wheel lug nut', null, null, 61.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Swift', 2001, 2001, 'Wheel lug nut', null, null, 47, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Verona', 2004, 2006, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'Vitara', 2001, 2004, 'Wheel lug nut', null, null, 72.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'XL 7', 2001, 2006, 'Wheel lug nut', null, null, 72.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Suzuki', 'XL 7', 2007, 2008, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/');
