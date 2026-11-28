-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 31
-- 20261127020118_torque_specs_seed_31.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: mercedes-lug-nut-torque-specs, mercury-lug-nut-torque-specs, mitsubishi-lug-nut-torque-specs
-- Rows: 42 wheel lug-nut rows, copied by script exactly as the page
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
  ('Mercedes-Benz', 'GLK-Class', 2010, 2015, 'Wheel lug nut — GLK350', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'GLK-Class', 2013, 2015, 'Wheel lug nut — GLK250', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'M-Class', 2001, 2015, 'Wheel lug nut — ML Class', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'Maybach S-Class', 2016, 2017, 'Wheel lug nut — Maybach S600', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'Maybach S-Class', 2017, 2017, 'Wheel lug nut — Maybach S550 (w/Code Z07)', null, null, 133, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'Maybach S-Class', 2017, 2017, 'Wheel lug nut — Maybach S550 (w/o Code Z07)', null, null, 111, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'Metris', 2016, 2017, 'Wheel lug nut — Metris (w/Aluminum wheels)', null, null, 133, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'Metris', 2016, 2017, 'Wheel lug nut — Metris (w/Steel wheels)', null, null, 148, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'R-Class', 2006, 2012, 'Wheel lug nut — R Class', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2001, 2004, 'Wheel lug nut — SLK230', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2001, 2004, 'Wheel lug nut — SLK320', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2002, 2004, 'Wheel lug nut — SLK32 AMG', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2005, 2005, 'Wheel lug nut — SLK55 AMG', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2005, 2005, 'Wheel lug nut — SLK350', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2006, 2010, 'Wheel lug nut — SLK55 AMG', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2006, 2008, 'Wheel lug nut — SLK280', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2006, 2008, 'Wheel lug nut — SLK350', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2009, 2009, 'Wheel lug nut — SLK300', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2009, 2009, 'Wheel lug nut — SLK350', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2010, 2011, 'Wheel lug nut — SLK300', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2010, 2011, 'Wheel lug nut — SLK350', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2012, 2016, 'Wheel lug nut — SLK55 AMG', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2012, 2015, 'Wheel lug nut — SLK250', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2012, 2016, 'Wheel lug nut — SLK350', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'SLK', 2016, 2016, 'Wheel lug nut — SLK300', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercury', 'Cougar', 2001, 2002, 'Wheel lug nut', null, null, 94, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Grand Marquis', 2001, 2002, 'Wheel lug nut', null, null, 85, 105, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Grand Marquis', 2003, 2011, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Marauder', 2003, 2004, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Mariner', 2005, 2007, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Mariner', 2008, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Mariner', 2011, 2011, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Milan', 2006, 2009, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Milan', 2011, 2011, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Montego', 2005, 2007, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Monterey', 2004, 2007, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Mountaineer', 2001, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Sable', 2001, 2005, 'Wheel lug nut', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Sable', 2008, 2009, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mercury', 'Villager', 2001, 2002, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/mercury-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Diamante', 2001, 2004, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Endeavor', 2004, 2008, 'Wheel lug nut', null, null, 66, 80, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/');
