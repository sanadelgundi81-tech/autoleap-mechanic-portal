-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 30
-- 20261127020117_torque_specs_seed_30.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: mazda-lug-nut-torque-specs, mercedes-lug-nut-torque-specs, mini-lug-nut-torque-specs
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
  ('MINI', 'Cooper Paceman', 2013, 2013, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper Paceman', 2014, 2016, 'Wheel lug nut', null, null, 96, 111, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('Mazda', '626', 2001, 2002, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'B2300/2500/3000/4000', 2001, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'CX-5', 2013, 2015, 'Wheel lug nut', null, null, 80, 108, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'MPV', 2001, 2006, 'Wheel lug nut', null, null, 80, 108, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Mazda2', 2011, 2014, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Mazda5', 2006, 2010, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Mazda5', 2012, 2015, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Millenia', 2001, 2001, 'Wheel lug nut', null, null, 65, 94, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Millenia', 2002, 2002, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Protege/Protege5', 2001, 2003, 'Wheel lug nut', null, null, 66, 88, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mazda', 'Tribute', 2009, 2011, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/mazda-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'AMG GT', 2016, 2017, 'Wheel lug nut — AMG GT/S', null, null, 133, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'B-Class', 2014, 2015, 'Wheel lug nut — B Electric Drive', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'B-Class', 2016, 2017, 'Wheel lug nut — B250e', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2001, 2005, 'Wheel lug nut — C240', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2001, 2005, 'Wheel lug nut — C320', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2002, 2004, 'Wheel lug nut — C32 AMG', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2002, 2007, 'Wheel lug nut — C230', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2005, 2006, 'Wheel lug nut — C55 AMG', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2006, 2007, 'Wheel lug nut — C280', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2006, 2007, 'Wheel lug nut — C350', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2008, 2012, 'Wheel lug nut — C300', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2012, 2012, 'Wheel lug nut — C250', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'C-Class', 2013, 2014, 'Wheel lug nut — C300 (w/o Code 98)', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2001, 2006, 'Wheel lug nut — CL55 AMG', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2001, 2006, 'Wheel lug nut — CL500', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2001, 2014, 'Wheel lug nut — CL600', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2005, 2006, 'Wheel lug nut — CL65 AMG', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2007, 2014, 'Wheel lug nut — CL550', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2008, 2014, 'Wheel lug nut — CL63 AMG', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CL-Class', 2008, 2014, 'Wheel lug nut — CL65 AMG', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2001, 2006, 'Wheel lug nut — CLK55 AMG', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2001, 2005, 'Wheel lug nut — CLK320', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2001, 2003, 'Wheel lug nut — CLK430', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2003, 2006, 'Wheel lug nut — CLK500', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2006, 2009, 'Wheel lug nut — CLK350', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2007, 2008, 'Wheel lug nut — CLK63 AMG', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2007, 2009, 'Wheel lug nut — CLK550', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'CLK-Class', 2009, 2009, 'Wheel lug nut — CLK63 AMG', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/'),
  ('Mercedes-Benz', 'GL-Class', 2007, 2016, 'Wheel lug nut — GL Class', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/mercedes-lug-nut-torque-specs/');
