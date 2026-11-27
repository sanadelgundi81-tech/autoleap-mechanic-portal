-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 13 of 13
-- 20261126020113_torque_specs_seed_13.sql
--
-- Values copied by script from free public charts (tighttorque.com,
-- checkfitment.com, revrated.com, capritools.com) exactly as stated;
-- each row's source column is the page it came from. A unit the source
-- does not state is null (never converted or guessed). Reference only —
-- always verify against the vehicle's service manual.
--
-- Additive only: inserts rows, no DELETE/DROP. No secrets.
-- ============================================================

insert into public.torque_specs
  (make, model, year_from, year_to, job, torque_nm, torque_nm_max, torque_ftlb, torque_ftlb_max, source)
values
  ('Nissan', '350Z/370Z', 2003, 2020, 'Wheel lug nut', null, null, 80, 98, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Nissan', 'GT-R', 2009, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Nissan', 'Kicks', 2018, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Nissan', 'Leaf', 2011, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Nissan', 'Maxima', 1990, 2022, 'Wheel lug nut', null, null, 80, 98, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Nissan', 'Murano', 2003, 2022, 'Wheel lug nut', null, null, 80, 98, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Nissan', 'Pathfinder', 1996, 2022, 'Wheel lug nut', null, null, 98, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', '718 Boxster/Cayman', 2017, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', '911 (996/997)', 1999, 2012, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', '911 (991/992)', 2012, 2022, 'Wheel lug nut', null, null, 96, 118, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', 'Cayenne', 2003, 2022, 'Wheel lug nut', null, null, 118, 133, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', 'Macan', 2015, 2022, 'Wheel lug nut', null, null, 96, 118, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', 'Panamera', 2010, 2022, 'Wheel lug nut', null, null, 96, 118, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Porsche', 'Taycan', 2020, 2022, 'Wheel lug nut', null, null, 96, 118, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ram', '3500', 1994, 2022, 'Wheel lug nut', null, null, 135, 142, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ram', '3500 (DRW)', 2000, 2022, 'Wheel lug nut', null, null, 140, 165, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Subaru', 'BRZ', 2013, 2022, 'Wheel lug nut', null, null, 89, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Subaru', 'Crosstrek', 2013, 2022, 'Wheel lug nut', null, null, 89, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Subaru', 'Impreza/WRX/STI', 1993, 2022, 'Wheel lug nut', null, null, 65, 89, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Subaru', 'Legacy', 1990, 2022, 'Wheel lug nut', null, null, 65, 89, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Tesla', 'Model S', 2012, 2022, 'Wheel lug nut', null, null, 129, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Tesla', 'Model X', 2016, 2022, 'Wheel lug nut', null, null, 129, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Toyota', '86 / GR86', 2013, 2022, 'Wheel lug nut', null, null, 89, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Toyota', 'GR Supra', 2020, 2022, 'Wheel lug nut', null, null, 120, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Toyota', 'Sequoia', 2001, 2022, 'Wheel lug nut', null, null, 83, 97, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volkswagen', 'Atlas', 2018, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volkswagen', 'Beetle', 1998, 2019, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volkswagen', 'CC', 2009, 2017, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volkswagen', 'Golf/GTI/R', 1990, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volkswagen', 'Passat', 1990, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volkswagen', 'Touareg', 2004, 2017, 'Wheel lug nut', null, null, 120, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volvo', 'S60', 2001, 2022, 'Wheel lug nut', null, null, 81, 103, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volvo', 'S90', 2017, 2022, 'Wheel lug nut', null, null, 103, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volvo', 'V60/V90', 2015, 2022, 'Wheel lug nut', null, null, 103, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volvo', 'XC40', 2019, 2022, 'Wheel lug nut', null, null, 103, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volvo', 'XC60', 2010, 2022, 'Wheel lug nut', null, null, 103, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Volvo', 'XC90', 2003, 2022, 'Wheel lug nut', null, null, 103, null, 'https://capritools.com/wheel-lug-nut-torque-specification/');
