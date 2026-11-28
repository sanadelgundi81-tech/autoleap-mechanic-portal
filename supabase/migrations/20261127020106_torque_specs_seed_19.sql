-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 19
-- 20261127020106_torque_specs_seed_19.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: bmw-lug-nut-torque-specifications, ford-lug-nut-torque-specifications
-- Rows: 39 wheel lug-nut rows, copied by script exactly as the page
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
  ('BMW', 'M3', 2015, 2018, 'Wheel lug nut — M3 18″BASE / CONVERTIBLE', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M4', 2015, 2018, 'Wheel lug nut — M4 18″BASE / CONVERTIBLE', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M5', 1987, 1988, 'Wheel lug nut — M5 4 DOOR / E28', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M5', 1991, 2007, 'Wheel lug nut — M5 19-INCH- / E60', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M5', 2008, 2018, 'Wheel lug nut — M5 19″BASE / F10', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M6', 1987, 1989, 'Wheel lug nut — M6 2 DOOR / E24', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M6', 2006, 2018, 'Wheel lug nut — M6 COUPE 19″BASE / F13', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M6', 2009, 2018, 'Wheel lug nut — M6 CONVERTIBLE 19″BASE / F12', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'M6', 2014, 2018, 'Wheel lug nut — M6 GRAN COUPE 20″BASE / F06', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X1', 2013, 2015, 'Wheel lug nut — X1 28I 17″BASE / S DRIVE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X1', 2013, 2018, 'Wheel lug nut — X1 35I 18″BASE / X DRIVE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X1', 2016, 2018, 'Wheel lug nut — X1 28I 18″BASE / X DRIVE', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X3', 2004, 2010, 'Wheel lug nut — X3 /E83 17″BASE / 30I', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X3', 2011, 2014, 'Wheel lug nut — X3 /F25 18″BASE / 28I', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X3', 2015, 2018, 'Wheel lug nut — X3 18″BASE / SDRIVE 28I', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X4', 2015, 2018, 'Wheel lug nut — X4 19″BASE / 28I XDRIVE', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X5', 2000, 2018, 'Wheel lug nut — X5 – ALL 18″BASE / F15 35I', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'X6', 2008, 2018, 'Wheel lug nut — X6 – ALL 19″BASE / XDRIVE 35I', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'Z3', 1996, 2002, 'Wheel lug nut — Z3 – ALL ROADSTER / 3.0I', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'Z4', 2003, 2018, 'Wheel lug nut — Z4 – ALL 18-STGGR / M COUPE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'Z8', 2001, 2003, 'Wheel lug nut — Z8 /E52 ALL / COUPE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'i3', 2014, 2016, 'Wheel lug nut — I3 19″BASE / BASE', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('BMW', 'i8', 2014, 2016, 'Wheel lug nut — I8 20″BASE /', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/bmw-lug-nut-torque-specifications/'),
  ('Ford', '500', 2005, 2007, 'Wheel lug nut — 500 SEDAN / SE/SEL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Aerostar', 1985, 1997, 'Wheel lug nut — AEROSTAR ALL / P195/75R14', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Aspire', 1994, 1997, 'Wheel lug nut — ASPIRE ALL / BASE/SE', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Bronco', 1985, 1996, 'Wheel lug nut — BRONCO ALL / P235/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Bronco II', 1984, 1990, 'Wheel lug nut — BRONCO II ALL / 2WD', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'C-Max', 2013, 2016, 'Wheel lug nut — C-MAX 17″BASE / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Contour', 1995, 1997, 'Wheel lug nut — CONTOUR ALL / P185/70R14', null, null, 70, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Contour', 1998, 1998, 'Wheel lug nut — CONTOUR – SVT ALL / SVT', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Contour', 1998, 2000, 'Wheel lug nut — CONTOUR ALL / P185/70R14', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Crown Vic', 1987, 2011, 'Wheel lug nut — CROWN VIC 2/4 DOOR / P205/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'E-150', 1992, 2006, 'Wheel lug nut — E-150 15″OPT. / STEEL WHL.', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'E-150', 2007, 2014, 'Wheel lug nut — E-150 VAN / ALL', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'E-250', 1992, 2014, 'Wheel lug nut — E-250 16″BASE / ALL', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'E-350', 1992, 2009, 'Wheel lug nut — E-350 16″OPT. / ALL', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'E-350 SD', 2003, 2014, 'Wheel lug nut — E-350 SD 16″BASE / ECONOLINE', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'E-350 SD', 2003, 2015, 'Wheel lug nut — E-350 SD DUALLY CHASSIS / UNFINISHED', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/');
