-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 23
-- 20261127020110_torque_specs_seed_23.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: cadillac-lug-nut-torque-specifications, chevrolet-lug-nut-torque-specifications
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
  ('Cadillac', 'XTS', 2018, 2018, 'Wheel lug nut — XTS 19″BASE / BASE', null, null, 125, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Aveo 5', 2008, 2008, 'Wheel lug nut — AVEO 5 14″BASE / SPCL VALUE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Beretta', 1987, 1996, 'Wheel lug nut — BERETTA 14-INCH / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C10', 1967, 1970, 'Wheel lug nut — C10 2WD / 235/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C10', 1971, 1987, 'Wheel lug nut — C10 2WD / 235/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C1500', 1988, 1995, 'Wheel lug nut — C1500 PICK-UP / 225/75R15', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C1500', 1996, 1999, 'Wheel lug nut — C1500 PICK-UP / 225/75R15', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C2500', 1988, 1995, 'Wheel lug nut — C2500 – 8-LUG 16″BASE / 8-LUG', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C2500', 1988, 1999, 'Wheel lug nut — C2500 – 6-LUG 16″BASE / 6-LUG', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C2500', 1992, 1995, 'Wheel lug nut — C2500 16″OPT / 8-LUG', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C2500', 1996, 1999, 'Wheel lug nut — C2500 16″BASE / 8-LUG', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'C3500', 1988, 2002, 'Wheel lug nut — C3500 ALL CABS / DUALLY', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Camaro', 1967, 1981, 'Wheel lug nut — CAMARO COUPE / BERLINETTA', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Camaro', 1982, 2002, 'Wheel lug nut — CAMARO ALL / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Camaro', 2010, 2011, 'Wheel lug nut — CAMARO 18″BASE / LS COUPE', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Camaro', 2013, 2015, 'Wheel lug nut — CAMARO 18″BASE / LS', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Caprice', 1985, 1990, 'Wheel lug nut — CAPRICE – 215/75R15 SDN/HD / 215/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Caprice', 1985, 1990, 'Wheel lug nut — CAPRICE – 205/75R15 SDN/LD / 205/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Caprice', 1985, 1991, 'Wheel lug nut — CAPRICE – WAGON ALL / WAGON', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Caprice', 1991, 1996, 'Wheel lug nut — CAPRICE SEDAN / 215/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Caprice', 2011, 2014, 'Wheel lug nut — CAPRICE 18″BASE / V6', null, null, 125, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Captiva Sport', 2012, 2015, 'Wheel lug nut — CAPTIVA SPORT 17″BASE / LS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Celebrity', 1985, 1990, 'Wheel lug nut — CELEBRITY ALL / WAGON', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Chevelle', 1964, 1972, 'Wheel lug nut — CHEVELLE 402 V8 / COUPE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Chevette', 1981, 1987, 'Wheel lug nut — CHEVETTE ALL / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Citation', 1980, 1985, 'Wheel lug nut — CITATION 4 DOOR / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'City Express', 2015, 2015, 'Wheel lug nut — CITY EXPRESS 15″BASE / LS', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Cobalt', 2005, 2010, 'Wheel lug nut — COBALT 15″BASE / LS / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Corsica', 1987, 1996, 'Wheel lug nut — CORSICA 14-INCH / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Corvette', 1953, 1982, 'Wheel lug nut — CORVETTE 225/7015 / C3', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Equinox', 2005, 2009, 'Wheel lug nut — EQUINOX 18″BASE / SPORT', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Express', 2000, 2015, 'Wheel lug nut — EXPRESS DUALLY CHASSIS / UNFINISHED', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Express 1500', 1996, 2014, 'Wheel lug nut — EXPRESS 1500 17″STEEL / LS/LT/WORK', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Express 2500', 1996, 2016, 'Wheel lug nut — EXPRESS 2500 16″BASE / CARGO', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Express 3500', 1996, 2016, 'Wheel lug nut — EXPRESS 3500 16″BASE / CARGO', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/');
