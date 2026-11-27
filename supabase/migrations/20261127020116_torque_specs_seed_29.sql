-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 29
-- 20261127020116_torque_specs_seed_29.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: kia-lug-nut-torque-specs, lexus-lug-nut-torque-specs, lincoln-lug-nut-torque-specs, mini-lug-nut-torque-specs
-- Rows: 45 wheel lug-nut rows, copied by script exactly as the page
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
  ('Kia', 'K900', 2017, 2017, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Niro', 2017, 2017, 'Wheel lug nut', null, null, 80, 94, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rio', 2001, 2005, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rio', 2006, 2008, 'Wheel lug nut', null, null, 65, 79, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rio', 2009, 2009, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rio', 2017, 2017, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rio Cinco', 2002, 2005, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rio5', 2006, 2009, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Rondo', 2007, 2009, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Sedona', 2002, 2006, 'Wheel lug nut', null, null, 65, 79, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Sedona', 2007, 2009, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Sedona', 2017, 2017, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Sephia', 2001, 2001, 'Wheel lug nut', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Sorento', 2003, 2009, 'Wheel lug nut', null, null, 65, 86, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Spectra', 2001, 2004, 'Wheel lug nut — (w/1.8L)', null, null, 65, 87, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Spectra', 2004, 2009, 'Wheel lug nut — (w/2.0L)', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Spectra5', 2005, 2007, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Spectra5', 2008, 2009, 'Wheel lug nut', null, null, 65, 86, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Sportage', 2001, 2002, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Lexus', 'CT', 2011, 2017, 'Wheel lug nut — CT200h', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'HS', 2010, 2012, 'Wheel lug nut — HS250h', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'LS', 2001, 2006, 'Wheel lug nut — LS430', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'LS', 2007, 2017, 'Wheel lug nut — LS460', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'LS', 2008, 2009, 'Wheel lug nut — LS600h L', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'LS', 2010, 2015, 'Wheel lug nut — LS600h L', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'LS', 2016, 2016, 'Wheel lug nut — LS600h', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lexus', 'SC', 2002, 2010, 'Wheel lug nut — SC430', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/lexus-lug-nut-torque-specs/'),
  ('Lincoln', 'Aviator', 2003, 2005, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'Blackwood', 2002, 2002, 'Wheel lug nut', null, null, 148, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'LS', 2001, 2006, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'MKS', 2009, 2011, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'MKS', 2012, 2016, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'MKT', 2010, 2012, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'MKT', 2013, 2017, 'Wheel lug nut — (Standard Body)', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'Mark LT', 2006, 2008, 'Wheel lug nut', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'Navigator L', 2007, 2007, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'Navigator L', 2008, 2015, 'Wheel lug nut', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('Lincoln', 'Zephyr', 2006, 2006, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/lincoln-lug-nut-torque-specs/'),
  ('MINI', 'Cooper', 2002, 2002, 'Wheel lug nut', null, null, 72, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper', 2003, 2006, 'Wheel lug nut', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper', 2007, 2017, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper Clubman', 2016, 2017, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper Countryman', 2011, 2013, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper Countryman', 2014, 2016, 'Wheel lug nut', null, null, 96, 111, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/'),
  ('MINI', 'Cooper Countryman', 2017, 2017, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/mini-lug-nut-torque-specs/');
