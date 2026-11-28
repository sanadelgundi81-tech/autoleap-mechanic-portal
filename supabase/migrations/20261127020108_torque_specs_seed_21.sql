-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 21
-- 20261127020108_torque_specs_seed_21.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: audi-lug-nut-torque-specifications, buick-lug-nut-torque-specifications
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
  ('Audi', 'A3 Sportback', 2016, 2016, 'Wheel lug nut — A3 SPORTBACK 17″BASE / E-TRON', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'A4 allroad', 2018, 2018, 'Wheel lug nut — A4 ALLROAD 18″BASE / 2', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'A5 Convertible', 2013, 2018, 'Wheel lug nut — A5 CONVERTIBLE 18″BASE / 2', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'A5 Coupe', 2013, 2018, 'Wheel lug nut — A5 COUPE 18″BASE / 2', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'A6 FWD', 1998, 1999, 'Wheel lug nut — A6 FWD 16-INCH / ALL', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'Cabriolet', 1994, 1998, 'Wheel lug nut — CABRIOLET ALL / 195/65R15', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'Coupe', 1981, 1991, 'Wheel lug nut — COUPE ALL / QUATTRO', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'Quattro', 1984, 1987, 'Wheel lug nut — QUATTRO ALL / QUATTRO', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'RS4', 2007, 2008, 'Wheel lug nut — RS4 19-INCH / SEDAN', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'RS5', 2013, 2018, 'Wheel lug nut — RS5 19″BASE / COUPE/CONV', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'RS6', 2003, 2004, 'Wheel lug nut — RS6 ALL / SEDAN', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'RS7', 2014, 2018, 'Wheel lug nut — RS7 20″BASE / 4.0 TFSI', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S3', 2015, 2018, 'Wheel lug nut — S3 19″BASE / SEDAN', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S4', 1992, 2018, 'Wheel lug nut — S4 18″BASE / 3', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S4', 2004, 2009, 'Wheel lug nut — S4 4.2 QUATTRO 18-INCH / CABRIOLET', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S5', 2008, 2018, 'Wheel lug nut — S5 18″BASE / CONVERTBLE', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S6', 1995, 2018, 'Wheel lug nut — S6 19″BASE / 4', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S7', 2013, 2018, 'Wheel lug nut — S7 21″BASE / 4.0 TFSI', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'S8', 2001, 2018, 'Wheel lug nut — S8 21″BASE / 4', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'SQ5', 2014, 2018, 'Wheel lug nut — SQ5 20″BASE / PREM/PRSTG', null, null, 105, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'V8', 1990, 1994, 'Wheel lug nut — V8 ALL / QUATTRO', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Audi', 'allroad', 2001, 2016, 'Wheel lug nut — ALLROAD 18″BASE / 2', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/audi-lug-nut-torque-specifications/'),
  ('Buick', 'Cascada', 2016, 2018, 'Wheel lug nut — CASCADA 20″BASE / CONVERTIBLE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Century', 1986, 2005, 'Wheel lug nut — CENTURY 4 DOOR / CUSTOM/LIMITED', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Electra', 1980, 1990, 'Wheel lug nut — ELECTRA 14-INCH / BASE/ULTRA', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Enclave', 2008, 2018, 'Wheel lug nut — ENCLAVE 19″BASE / ALL', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Encore', 2013, 2018, 'Wheel lug nut — ENCORE 18″BASE / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Envision', 2016, 2016, 'Wheel lug nut — ENVISION 19″BASE / BASE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Grand National', 1984, 1987, 'Wheel lug nut — GRAND NATIONAL ALL / COUPE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'LaCrosse', 2005, 2009, 'Wheel lug nut — LACROSSE 17″OPT. / CX', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'LaCrosse', 2010, 2015, 'Wheel lug nut — LACROSSE 17″BASE / 2.4 4-CYL', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'LaCrosse', 2016, 2016, 'Wheel lug nut — LACROSSE 17″BASE / 2.4 4-CYL', null, null, 125, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'LaCrosse', 2018, 2018, 'Wheel lug nut — LACROSSE 18″BASE / 3.6 6-CYL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'LeSabre', 1986, 2005, 'Wheel lug nut — LESABRE BASE / BESTSELLER', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Lucerne', 2006, 2011, 'Wheel lug nut — LUCERNE 17″BASE / CX', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Park Ave', 1991, 2005, 'Wheel lug nut — PARK AVE SEDAN / BASE/PREST', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Rainier', 2004, 2007, 'Wheel lug nut — RAINIER 2WD / CXL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/'),
  ('Buick', 'Reatta', 1988, 1991, 'Wheel lug nut — REATTA 15-INCH / COUPE', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/buick-lug-nut-torque-specifications/');
