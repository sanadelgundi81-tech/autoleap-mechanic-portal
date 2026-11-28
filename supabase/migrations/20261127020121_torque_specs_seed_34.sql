-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 34
-- 20261127020121_torque_specs_seed_34.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: suzuki-lug-nut-torque-specs, toyota-lug-nut-torque-specs, volkswagen-lug-nut-torque-specs, volvo-lug-nut-torque-specs
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
  ('Suzuki', 'XL 7', 2009, 2009, 'Wheel lug nut', null, null, 72.5, null, 'https://ricksfreeautorepairadvice.com/suzuki-lug-nut-torque-specs/'),
  ('Toyota', 'Celica', 2001, 2005, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Corolla IM', 2017, 2017, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Echo', 2001, 2005, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'FJ Cruiser', 2007, 2010, 'Wheel lug nut', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'FJ Cruiser', 2011, 2014, 'Wheel lug nut', null, null, 82, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'MR2', 2001, 2005, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Matrix', 2003, 2014, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Prius C', 2012, 2017, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Prius Plug-in', 2012, 2015, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Prius Prime', 2017, 2017, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Prius V', 2012, 2017, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Sienna Van', 2001, 2009, 'Wheel lug nut', null, null, 77, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Sienna Van', 2010, 2017, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Solara', 2001, 2008, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Venza', 2009, 2015, 'Wheel lug nut', null, null, 76, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Toyota', 'Yaris IA', 2017, 2017, 'Wheel lug nut', null, null, 94, null, 'https://ricksfreeautorepairadvice.com/toyota-lug-nut-torque-specs/'),
  ('Volkswagen', 'Cabrio', 1994, 2002, 'Wheel lug nut', null, null, 87, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Eos', 2007, 2016, 'Wheel lug nut', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'EuroVan', 1999, 2001, 'Wheel lug nut', null, null, 116, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'EuroVan', 2002, 2003, 'Wheel lug nut', null, null, 125, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Jetta', 1994, 1996, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Jetta', 1997, 1998, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Jetta', 1999, 2007, 'Wheel lug nut', null, null, 87, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Jetta', 2008, 2008, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Phaeton', 2005, 2005, 'Wheel lug nut', null, null, 87, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Routan', 2009, 2009, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Routan', 2010, 2012, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Tiguan', 2009, 2010, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Tiguan', 2011, 2017, 'Wheel lug nut — FWD', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Tiguan', 2011, 2017, 'Wheel lug nut — AWD', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Tiguan Limited', 2018, 2018, 'Wheel lug nut — AWD', null, null, 89, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volkswagen', 'Tiguan Limited', 2018, 2018, 'Wheel lug nut — FWD', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/volkswagen-lug-nut-torque-specs/'),
  ('Volvo', 'C30', 2008, 2008, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C30', 2010, 2011, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C30', 2012, 2012, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C30', 2013, 2013, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C30/C70', 2009, 2009, 'Wheel lug nut — (w/Recessed flange)', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C30/C70', 2009, 2009, 'Wheel lug nut — (w/o Recessed flange)', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C70', 2001, 2004, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C70', 2006, 2008, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C70', 2010, 2011, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C70', 2012, 2012, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'C70', 2013, 2013, 'Wheel lug nut', null, null, 81, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/'),
  ('Volvo', 'Cross Country', 2001, 2002, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/volvo-lug-nut-torque-specs/');
