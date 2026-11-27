-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 18
-- 20261127020105_torque_specs_seed_18.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: bmw-lug-nut-torque-specifications
-- Rows: 38 wheel lug-nut rows, copied by script exactly as the page
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
  ('BMW', '4 Series', 2016, 2018, 'Wheel lug nut — 435IX GRAN COUP – 18 Inch 18″BASE / F36', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2016, 2018, 'Wheel lug nut — 435IX GRAN COUP – 19 Inch 19″BASE / F36', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2018, 2018, 'Wheel lug nut — 430 ALL /', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2018, 2018, 'Wheel lug nut — 440 ALL /', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '5 Series', 1975, 1978, 'Wheel lug nut — 530I /E12 2/4 DR / ALL', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '5 Series', 1979, 1988, 'Wheel lug nut — 528 – ALL 14-INCH / CPE/SDN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '5 Series', 1983, 1984, 'Wheel lug nut — 533I /E28 14-INCH / CPE/SDN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '5 Series', 1985, 1986, 'Wheel lug nut — 524TD /E28 14-INCH / ALL', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '5 Series', 1985, 1988, 'Wheel lug nut — 535/I/IS 15-INCH / ALL/E28', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '5 Series', 1989, 1993, 'Wheel lug nut — 535/I/IS 2/4 DR / ALL E34', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '6 Series', 1977, 1989, 'Wheel lug nut — CSI 633 14-INCH / E24', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '6 Series', 2012, 2018, 'Wheel lug nut — 640I – ALL 18″BASE / F12', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '6 Series', 2012, 2018, 'Wheel lug nut — 650IX – ALL 18″BASE / F12', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '6 Series', 2013, 2018, 'Wheel lug nut — 650I GRAN COUPE 19″BASE / F06', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 1978, 1984, 'Wheel lug nut — 733I 14-INCH / E23', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 1985, 1992, 'Wheel lug nut — 735 – ALL 2/4 DR / E32', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 1988, 1999, 'Wheel lug nut — 750/I/IL 4 DOOR / E38', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 1994, 2001, 'Wheel lug nut — 740/I/IL 18-INCH / E38', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 2000, 2001, 'Wheel lug nut — 750IL 16-INCH / E38', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 2002, 2005, 'Wheel lug nut — 745 – ALL 18-INCH / E65', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 2004, 2015, 'Wheel lug nut — 760 – ALL 20-INCH / E66', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 2006, 2015, 'Wheel lug nut — 750 – ALL 20″BASE / G11', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 2011, 2019, 'Wheel lug nut — 740I – ALL 18″BASE / G11', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '7 Series', 2012, 2015, 'Wheel lug nut — ACTIVE HYBRID 7 18″BASE / ALL', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '8 Series', 1991, 1997, 'Wheel lug nut — 850/I/CI 2 DOOR / ALL/E31', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '8 Series', 1994, 1997, 'Wheel lug nut — 840/I/IL 2/DOOR / ALL E31', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '8 Series', 1994, 1995, 'Wheel lug nut — 850CSI/E31 2 DOOR / SPT COUPE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'Alpina B6', 2007, 2018, 'Wheel lug nut — ALPINA 20″BASE / B6 GRAN CP', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'Alpina V8 Roadster', 2004, 2004, 'Wheel lug nut — ALPINA V8 2DR/ E52 / ROADSTER', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'Bavaria', 1971, 1973, 'Wheel lug nut — BAVARIA/E3 2/4DR / 3.0 SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'L6', 1987, 1987, 'Wheel lug nut — L6 /E24 2 DOOR / COUPE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'L7', 1987, 1987, 'Wheel lug nut — L7 /E23 4 DOOR / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M Coupe', 1998, 2002, 'Wheel lug nut — M COUPE COUPE / E40', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M Roadster', 1998, 2002, 'Wheel lug nut — M ROADSTER ROADSTER / E40', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M3', 1988, 1991, 'Wheel lug nut — M3 ALL / E30', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M3', 1995, 2002, 'Wheel lug nut — M3 ALL / E46', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M3', 2003, 2013, 'Wheel lug nut — M3 CONVERTIBLE 18″ BASE / E93', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M3', 2003, 2018, 'Wheel lug nut — M3 SEDAN 18’BASE / F80', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/');
