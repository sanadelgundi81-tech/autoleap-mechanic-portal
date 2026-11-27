-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 22
-- 20261127020109_torque_specs_seed_22.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: buick-lug-nut-torque-specifications, cadillac-lug-nut-torque-specifications
-- Rows: 36 wheel lug-nut rows, copied by script exactly as the page
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
  ('Buick', 'Regal', 1984, 2004, 'Wheel lug nut — REGAL ALL / GS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Regal', 2011, 2018, 'Wheel lug nut — REGAL 18″BASE / BASE', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Regal T-Type', 1984, 1987, 'Wheel lug nut — REGAL T-TYPE ALL / COUPE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Rendezvous', 2001, 2006, 'Wheel lug nut — RENDEZVOUS 4WD / CX+/CXL+', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Riviera', 1986, 1999, 'Wheel lug nut — RIVIERA ALL / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Roadmaster', 1991, 1996, 'Wheel lug nut — ROADMASTER SDN/WGN / 225/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Skyhawk', 1984, 1989, 'Wheel lug nut — SKYHAWK 13-INCH / CPE/SDN', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Skylark', 1986, 1998, 'Wheel lug nut — SKYLARK 15-INCH / CPE/SDN', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Somerset', 1985, 1987, 'Wheel lug nut — SOMERSET 13″BASE / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Terraza', 2005, 2007, 'Wheel lug nut — TERRAZA SPORTVAN / CX/CX+/CXL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Verano', 2012, 2016, 'Wheel lug nut — VERANO 17″BASE / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Cadillac', 'ATS Coupe', 2015, 2015, 'Wheel lug nut — ATS COUPE 18″BASE / 2.0 TURBO', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'ATS Coupe', 2016, 2016, 'Wheel lug nut — ATS COUPE 18″BASE / ATS-V', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'ATS Sedan', 2013, 2016, 'Wheel lug nut — ATS SEDAN 17″BASE / 2.0 TURBO', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Allante', 1987, 1993, 'Wheel lug nut — ALLANTE 2 DOOR / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CT6', 2016, 2016, 'Wheel lug nut — CT6 20″BASE / 3.6L', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS Coupe', 2014, 2015, 'Wheel lug nut — CTS COUPE 19″BASE / CTS-V', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS Sedan', 2014, 2014, 'Wheel lug nut — CTS SEDAN – 2.0 Turbo 18″BASE / 2.0 TURBO', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS Sedan', 2014, 2014, 'Wheel lug nut — CTS SEDAN – CTS-V V8 19″BASE / CTS-V V8', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS Sedan', 2015, 2016, 'Wheel lug nut — CTS SEDAN 17″BASE / 2.0 TURBO', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS Sportwagon', 2010, 2010, 'Wheel lug nut — CTS SPORTWAGON 17″BASE / 3.0L', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS Wagon', 2014, 2014, 'Wheel lug nut — CTS WAGON 17″BASE / BASE', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS-V', 2004, 2007, 'Wheel lug nut — CTS-V SEDAN / V8', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'CTS-V', 2009, 2014, 'Wheel lug nut — CTS-V 19″BASE / COUPE', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Catera', 1997, 2001, 'Wheel lug nut — CATERA 16-INCH / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Cimarron', 1985, 1988, 'Wheel lug nut — CIMARRON 4/DOOR / 195/70R14', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'DTS', 2006, 2011, 'Wheel lug nut — DTS 17″BASE / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'DeVille', 1965, 2005, 'Wheel lug nut — DEVILLE SEDAN / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'ELR', 2014, 2016, 'Wheel lug nut — ELR 20″BASE / COUPE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Eldorado', 1986, 2002, 'Wheel lug nut — ELDORADO 2 DOOR / ESC', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Escalade ESV', 2014, 2014, 'Wheel lug nut — ESCALADE ESV 22″BASE / ALL', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Fleetwood', 1970, 1996, 'Wheel lug nut — FLEETWOOD ALL RWD / 235/70R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'STS', 2005, 2011, 'Wheel lug nut — STS – ALL 17″BASE / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'Seville', 1986, 2004, 'Wheel lug nut — SEVILLE ALL / SLS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'XLR', 2004, 2009, 'Wheel lug nut — XLR – ALL PLATINUM / CONVERTBLE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/'),
  ('Cadillac', 'XTS', 2013, 2016, 'Wheel lug nut — XTS 19″BASE / BASE', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/cadillac-lug-nut-torque-specifications/');
