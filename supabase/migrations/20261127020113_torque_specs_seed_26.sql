-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 26
-- 20261127020113_torque_specs_seed_26.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: chrysler-lug-nut-torque-specifications, dodge-lug-nut-torque-specifications
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
  ('Chrysler', 'Sebring', 1999, 2006, 'Wheel lug nut — SEBRING 17-INCH / LXI COUPE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'T&C Van', 1990, 2007, 'Wheel lug nut — T&C VAN ALL / FWD', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'TC', 1989, 1991, 'Wheel lug nut — TC ALL / CONVERTBLE', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Dodge', 'Avenger', 1999, 2000, 'Wheel lug nut — AVENGER 14-INCH / BASE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Avenger', 2008, 2014, 'Wheel lug nut — AVENGER 16″BASE / SE', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Caravan', 1985, 1995, 'Wheel lug nut — CARAVAN 4-100 / 195/75R14', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Charger', 1985, 1987, 'Wheel lug nut — CHARGER ALL / SHELBY', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Colt', 1987, 1996, 'Wheel lug nut — COLT ALL / GT/TURBO', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Conquest', 1985, 1989, 'Wheel lug nut — CONQUEST 14-INCH / ALL 4-LUG', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'D150/D250', 1986, 1993, 'Wheel lug nut — D150/D250 2WD / 4WD', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'D350', 1986, 1993, 'Wheel lug nut — D350 2WD / 4WD', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'D350', 1986, 1993, 'Wheel lug nut — D350 DUALLY 2WD / 4WD', null, null, 160, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Dakota', 1988, 1994, 'Wheel lug nut — DAKOTA – 205/75R15 2WD / 205/75R15', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Daytona', 1987, 1993, 'Wheel lug nut — DAYTONA BASE / 185/70R14', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Dynasty', 1988, 1993, 'Wheel lug nut — DYNASTY 4 DOOR / ALL', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Intrepid', 1993, 1997, 'Wheel lug nut — INTREPID 15-INCH / BASE', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Intrepid', 1998, 2004, 'Wheel lug nut — INTREPID 15-INCH / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Lancer', 1985, 1989, 'Wheel lug nut — LANCER ALL / BASE/ES', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Magnum', 2005, 2008, 'Wheel lug nut — MAGNUM RWD / RT', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Monaco', 1989, 1992, 'Wheel lug nut — MONACO 2/4 DOOR / P195/70R14', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Omni', 1985, 1990, 'Wheel lug nut — OMNI ALL / GLH', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 150', 1986, 1993, 'Wheel lug nut — RAM 150 4WD / P235/75R15', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 1500', 1994, 2001, 'Wheel lug nut — RAM 1500 16″OPT / STD. CAB', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 1500', 2002, 2010, 'Wheel lug nut — RAM 1500 – 17 INCH 17″OPT / SLT/SLT+', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 1500', 2009, 2012, 'Wheel lug nut — RAM 1500 – 20 INCH 20″BASE / LARAMIE', null, null, 130, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 250', 1986, 1993, 'Wheel lug nut — RAM 250 16″BASE / 2WD', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 2500', 1994, 2012, 'Wheel lug nut — RAM 2500 – ST/SLT 16″BASE / ST/SLT', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 2500', 2005, 2007, 'Wheel lug nut — RAM 2500 – LARAMIE QUAD CAB / LARAMIE', null, null, 145, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 350', 1986, 1993, 'Wheel lug nut — RAM 350 16″BASE / SRW', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 350', 1986, 1993, 'Wheel lug nut — RAM 350 16″BASE / SRW', null, null, 160, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 3500', 1994, 2007, 'Wheel lug nut — RAM 3500 DUALLY / ST/SLT', null, null, 145, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 3500', 1994, 2002, 'Wheel lug nut — RAM 3500 DUALLY / ST/SLT', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 3500', 2000, 2012, 'Wheel lug nut — RAM 3500 2WD / ST/SLT', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 3500', 2008, 2012, 'Wheel lug nut — RAM 3500 DUALLY 17″BASE / ST/SLT', null, null, 145, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'RAM 50', 1988, 1993, 'Wheel lug nut — RAM 50 ALL / P205/75R14', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Ramcharger', 1988, 1993, 'Wheel lug nut — RAMCHARGER 2WD / P235/75R15', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Shadow', 1987, 1994, 'Wheel lug nut — SHADOW 13-INCH / BASE/L/H', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/');
