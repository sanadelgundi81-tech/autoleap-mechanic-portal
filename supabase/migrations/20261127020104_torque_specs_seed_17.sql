-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 17
-- 20261127020104_torque_specs_seed_17.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: bmw-lug-nut-torque-specifications
-- Rows: 37 wheel lug-nut rows, copied by script exactly as the page
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
  ('BMW', '1 Series', 2008, 2013, 'Wheel lug nut — 135I /E88 17″OPT / CONVERTIBLE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '1 Series', 2008, 2013, 'Wheel lug nut — 128I /E88 17″BASE / CONVERTIBLE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '1 Series', 2013, 2013, 'Wheel lug nut — 135IS /E82 18″BASE / COUPE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '1 Series', 2013, 2013, 'Wheel lug nut — 135IS /E88 18″BASE / CONVERTIBLE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '1M', 2011, 2012, 'Wheel lug nut — E82 1M / 19″BASE / COUPE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2016, 'Wheel lug nut — 228I CONVERTIBLE 17″BASE / F22', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2016, 'Wheel lug nut — 228I COUPE 17″BASE / F22', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2014, 'Wheel lug nut — 235I F22 18″BASE / M-SPORT', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2016, 'Wheel lug nut — M235I CONVERTIBLE 18″BASE / F22', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2014, 'Wheel lug nut — M235I CONVERTIBLE – X DRIVE 18″BASE / F22 XDRIVE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2018, 'Wheel lug nut — M235I COUPE 18″BASE / F22', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2 Series', 2014, 2014, 'Wheel lug nut — M235I COUPE – X DRIVE 18″BASE / F22 XDRIVE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2002', 1973, 1976, 'Wheel lug nut — E12 2002 / 2 DOOR / 165/80R13', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2500', 1971, 1973, 'Wheel lug nut — 2500/A /E3 4 DOOR / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '2800', 1969, 1973, 'Wheel lug nut — E3 2800 / ALL / A/CS/CSA', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3 Series', 1977, 1983, 'Wheel lug nut — 320I ALL / E21', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3 Series', 1984, 1985, 'Wheel lug nut — 318I ALL / E30', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3 Series', 1984, 1988, 'Wheel lug nut — 325I/IS/E 2/4 DR / E30', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3 Series', 1988, 1988, 'Wheel lug nut — 325IC CONVERTIBLE ALL / E30', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3 Series', 1988, 1991, 'Wheel lug nut — 325IX ALL / E30', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3 Series', 1989, 1991, 'Wheel lug nut — 325I/IS/E 2/4 DR / E30', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3.0 CS/CSi', 1973, 1975, 'Wheel lug nut — CS/CSI 3.0 ALL / E9', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '3.0 S/Si', 1973, 1976, 'Wheel lug nut — SI 3.0S/ ALL / E3', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2014, 2018, 'Wheel lug nut — 428I COUPE 19″STGGR / TRACK PKG', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2014, 2018, 'Wheel lug nut — 428IX COUPE 19″STGGR / TRACK PKG', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2014, 2018, 'Wheel lug nut — 435I COUPE 18″BASE / F32', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2014, 2018, 'Wheel lug nut — 435IX COUPE 18″BASE / F32', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2015, 2018, 'Wheel lug nut — 428I CONVERTIBLE 17″BASE / F33', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2015, 2018, 'Wheel lug nut — 428I GRAN COUPE 17″BASE / F36', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2015, 2018, 'Wheel lug nut — 428IX CONVERTIBLE 19″STGGR / TRACK PKG', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2015, 2018, 'Wheel lug nut — 428IX GRAN COUP 17″BASE / F36', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2015, 2018, 'Wheel lug nut — 435I CONVERTIBLE 18″BASE / F33', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2015, 2018, 'Wheel lug nut — 435IX CONVERTIBLE 18″BASE / F33', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2016, 2018, 'Wheel lug nut — 428I GRAN COUPE – TRACK PKG 18″STGGR / TRACK PKG', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2016, 2018, 'Wheel lug nut — 428IX GRAN COUP – TRACK PKG 18″STGGR / TRACK PKG', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2016, 2018, 'Wheel lug nut — 435I GRAN COUPE – 18 Inch 18″BASE / F36', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', '4 Series', 2016, 2018, 'Wheel lug nut — 435I GRAN COUPE – 19 Inch 19″BASE / F36', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/');
