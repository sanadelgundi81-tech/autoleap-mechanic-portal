-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 20
-- 20261127020107_torque_specs_seed_20.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: acura-lug-nut-torque-specifications, audi-lug-nut-torque-specifications, ford-lug-nut-torque-specifications
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
  ('Ford', 'E-450', 2003, 2015, 'Wheel lug nut — E-450 DUALLY CHASSIS / UNFINISHED', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Econoline', 1985, 1991, 'Wheel lug nut — ECONOLINE – E150 15″OPT / E150', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Econoline', 1985, 1991, 'Wheel lug nut — ECONOLINE – E250 15″BASE / E250', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Excursion', 2000, 2005, 'Wheel lug nut — EXCURSION 2WD / ALL', null, null, 165, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Expedition', 1997, 2000, 'Wheel lug nut — EXPEDITION – 12MM STUD 16-INCH / ALL 4WD', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Expedition', 1997, 2002, 'Wheel lug nut — EXPEDITION – 14MM STUD ALL / 6-IN. LIFT', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Expedition EL', 2007, 2018, 'Wheel lug nut — EXPEDITION EL 17-INCH / ALL 2WD', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'F-250', 1986, 1997, 'Wheel lug nut — F-250 16″OPT / 2WD', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'F-350', 1986, 1997, 'Wheel lug nut — F-350 ALL / 2WD', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Festiva', 1988, 1993, 'Wheel lug nut — FESTIVA ALL / L/LX/GL', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Flex', 2009, 2015, 'Wheel lug nut — FLEX 17″BASE / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Freestar', 2004, 2007, 'Wheel lug nut — FREESTAR VAN / BASE/S/SE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'GT', 2005, 2006, 'Wheel lug nut — GT ALL / COUPE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Probe', 1989, 1997, 'Wheel lug nut — PROBE 14-INCH / GL/LX', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Sport Trac', 2007, 2010, 'Wheel lug nut — SPORT TRAC BASE / XLT', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'T-Bird', 1985, 2005, 'Wheel lug nut — T-BIRD BASE/LX / P205/70R14', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Taurus', 2000, 2007, 'Wheel lug nut — TAURUS – 15 INCH 15-INCH / GL/SE/LX', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Taurus X', 2008, 2009, 'Wheel lug nut — TAURUS X 18″BASE / LIMITED', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Tempo', 1986, 1994, 'Wheel lug nut — TEMPO 2/4 DOOR / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Transit', 2015, 2018, 'Wheel lug nut — TRANSIT XL/XLT / 350', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Transit Connect', 2014, 2018, 'Wheel lug nut — TRANSIT CONNECT 16″BASE / CARGO VAN', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Ford', 'Windstar', 1995, 2003, 'Wheel lug nut — WINDSTAR VAN / P205/70R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/ford-lug-nut-torque-specifications/'),
  ('Acura', 'RL', 1996, 2004, 'Wheel lug nut — RL 3.5RL ALL / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Acura', 'SLX', 1996, 1999, 'Wheel lug nut — SLX 4 DOOR / SUV', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Acura', 'TL', 2004, 2008, 'Wheel lug nut — TL 17″BASE / BASE SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Acura', 'TL', 2009, 2014, 'Wheel lug nut — TL 17″BASE / BASE', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Acura', 'TL-S', 2001, 2003, 'Wheel lug nut — TL-S 3.2 ALL / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Acura', 'Vigor', 1992, 1994, 'Wheel lug nut — VIGOR CPE/SDN / ALL', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Acura', 'ZDX', 2010, 2013, 'Wheel lug nut — ZDX 19″BASE / ALL', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/acura-lug-nut-torque-specifications/'),
  ('Audi', '100', 1989, 1994, 'Wheel lug nut — 100 ALL / 195/65R15', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '200', 1989, 1991, 'Wheel lug nut — 200 ALL / 205/60R15', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '200', 1991, 1991, 'Wheel lug nut — 200 20V 4 DOOR / QUATTRO', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '4000', 1984, 1987, 'Wheel lug nut — 4000 BASE/S / 185/60R14', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '4000', 1984, 1987, 'Wheel lug nut — 4000 CS QUATTRO / 195/60R14', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '5000', 1984, 1988, 'Wheel lug nut — 5000 SEDAN / TURBO/QUAT', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '80', 1988, 1992, 'Wheel lug nut — 80 SEDAN / QUATTRO', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', '90', 1988, 1995, 'Wheel lug nut — 90 SEDAN / BASE/S', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'A3', 2015, 2016, 'Wheel lug nut — A3 17″BASE / CONVERTBLE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/');
