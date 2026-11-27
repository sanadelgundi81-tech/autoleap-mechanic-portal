-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 25
-- 20261127020112_torque_specs_seed_25.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: chevrolet-lug-nut-torque-specifications, chrysler-lug-nut-torque-specifications
-- Rows: 35 wheel lug-nut rows, copied by script exactly as the page
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
  ('Chevrolet', 'Sonic', 2012, 2016, 'Wheel lug nut — SONIC – ALL 15″BASE / SEDAN', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Spectrum', 1985, 1989, 'Wheel lug nut — SPECTRUM ALL / 155/80R13', null, null, 65, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Sprint', 1985, 1988, 'Wheel lug nut — SPRINT ALL / 145/80R12', null, null, 50, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Suburban', 1973, 1991, 'Wheel lug nut — SUBURBAN – C1500 2WD/5LUG / C1500', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Suburban', 1973, 1991, 'Wheel lug nut — SUBURBAN – K1500 4WD/6LUG / K1500', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Suburban', 1983, 1991, 'Wheel lug nut — SUBURBAN – C2500 2WD/8LUG / C2500', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Suburban 1500', 2000, 2014, 'Wheel lug nut — SUBURBAN 1500 2WD / 245/75R16', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Suburban 2500', 2000, 2013, 'Wheel lug nut — SUBURBAN 2500 2WD/8LUG / LS/LT', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Tracker', 1998, 1998, 'Wheel lug nut — TRACKER 2WD / ALL', null, null, 60, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Tracker', 1999, 2004, 'Wheel lug nut — TRACKER 2WD / 195/75R15', null, null, 70, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Trax', 2015, 2016, 'Wheel lug nut — TRAX 18″BASE / LTZ', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Uplander', 2005, 2008, 'Wheel lug nut — UPLANDER SPORTVAN / BASE/LS/LT', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Venture', 1997, 2005, 'Wheel lug nut — VENTURE ALL / 205/70R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chrysler', 'Aspen', 2007, 2009, 'Wheel lug nut — ASPEN 18-INCH / LMTD 2WD', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Cirrus', 1995, 2000, 'Wheel lug nut — CIRRUS 4 DOOR / LX / LXI', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Concorde', 1993, 2004, 'Wheel lug nut — CONCORDE 15-INCH / SEDAN', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Conquest', 1985, 1989, 'Wheel lug nut — CONQUEST ALL / TSI/5-LUG', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Crossfire', 2004, 2008, 'Wheel lug nut — CROSSFIRE ROADSTER / 193-CHASIS', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Crossfire', 2005, 2006, 'Wheel lug nut — CROSSFIRE SRT-6 ALL / 193 CHASIS', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Fifth Ave', 1984, 1989, 'Wheel lug nut — FIFTH AVE 2/4 DOOR / ALL', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Fifth Ave', 1990, 1993, 'Wheel lug nut — FIFTH AVE 2/4 DOOR / ALL/FWD', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Grand Voyager', 1996, 2001, 'Wheel lug nut — GRAND VOYAGER FWD / P205/75R14', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Imperial', 1990, 1993, 'Wheel lug nut — IMPERIAL 2/4 DOOR / ALL/FWD', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'LHS', 1994, 1997, 'Wheel lug nut — LHS 4/DOOR / ALL', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'LHS', 1999, 2001, 'Wheel lug nut — LHS 16-INCH / SEDAN', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Laser', 1985, 1986, 'Wheel lug nut — LASER 14-INCH / ALL/5 LUG', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Le Baron', 1985, 1995, 'Wheel lug nut — LE BARON ALL / ALL/4LUG', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Neon', 2001, 2001, 'Wheel lug nut — NEON 14-INCH / BASE/LX', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'New Yorker', 1986, 1996, 'Wheel lug nut — NEW YORKER 2/4 DOOR / ALL', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'PT Cruiser', 2000, 2010, 'Wheel lug nut — PT CRUISER WAGON / TOURING', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Pacifica', 2004, 2008, 'Wheel lug nut — PACIFICA 17-INCH / ALL', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Prowler', 1999, 2002, 'Wheel lug nut — PROWLER 2 DOOR / ROADSTER', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Sebring', 1995, 2010, 'Wheel lug nut — SEBRING – 16 INCH 16-INCH / LXI COUPE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Sebring', 1996, 1998, 'Wheel lug nut — SEBRING 15-INCH / JX/JXI', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/'),
  ('Chrysler', 'Sebring', 1999, 2007, 'Wheel lug nut — SEBRING – 15 INCH 15-INCH / JX/JXI', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chrysler-lug-nut-torque-specifications/');
