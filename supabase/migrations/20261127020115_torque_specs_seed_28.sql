-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 28
-- 20261127020115_torque_specs_seed_28.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: hyundai-lug-nut-torque-specifications, infiniti-lug-nut-torque-specifications, isuzu-lug-nut-torque-specs, jeep-lug-nut-torque-specs, kia-lug-nut-torque-specs
-- Rows: 43 wheel lug-nut rows, copied by script exactly as the page
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
  ('Hyundai', 'Ioniq', 2016, 2018, 'Wheel lug nut — IONIQ 16″BASE / BASE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Scoupe', 1991, 1995, 'Wheel lug nut — SCOUPE 13-INCH / COUPE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Tiburon', 1997, 2008, 'Wheel lug nut — TIBURON 14-INCH / BASE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Veracruz', 2007, 2012, 'Wheel lug nut — VERACRUZ 18-INCH / ALL', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'XG300', 2001, 2001, 'Wheel lug nut — XG300 ALL / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'XG350', 2002, 2005, 'Wheel lug nut — XG350 – ALL ALL / SEDAN', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Infiniti', 'EX35', 2008, 2012, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'EX37', 2013, 2013, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'FX37', 2013, 2013, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'FX45', 2003, 2008, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'G20', 2001, 2001, 'Wheel lug nut', null, null, 72, 87, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'G20', 2002, 2002, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'G25', 2011, 2012, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'I30', 2001, 2001, 'Wheel lug nut', null, null, 72, 87, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'I35', 2002, 2004, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'JX35', 2013, 2013, 'Wheel lug nut', null, null, 83, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'M35', 2006, 2010, 'Wheel lug nut', null, null, 83, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'M35h', 2012, 2013, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'M37', 2011, 2013, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'M45', 2003, 2010, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'M56', 2011, 2013, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'Q40', 2015, 2015, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'Q45', 2001, 2006, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'Q60', 2014, 2015, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'Q60', 2017, 2017, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'Q70/Q70L', 2014, 2017, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'QX30', 2017, 2017, 'Wheel lug nut', null, null, 96, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'QX4', 2001, 2003, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'QX50', 2014, 2017, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Infiniti', 'QX56', 2004, 2013, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/infiniti-lug-nut-torque-specifications/'),
  ('Isuzu', 'Ascender', 2003, 2004, 'Wheel lug nut', null, null, 103, null, 'https://ricksfreeautorepairadvice.com/isuzu-lug-nut-torque-specs/'),
  ('Isuzu', 'Axiom/Rodeo/Rodeo Sport', 2001, 2004, 'Wheel lug nut — (w/Aluminum wheels)', null, null, 87, null, 'https://ricksfreeautorepairadvice.com/isuzu-lug-nut-torque-specs/'),
  ('Isuzu', 'Axiom/Rodeo/Rodeo Sport', 2001, 2004, 'Wheel lug nut — (w/Steel wheels)', null, null, 65, null, 'https://ricksfreeautorepairadvice.com/isuzu-lug-nut-torque-specs/'),
  ('Isuzu', 'Trooper', 2001, 2002, 'Wheel lug nut', null, null, 87, null, 'https://ricksfreeautorepairadvice.com/isuzu-lug-nut-torque-specs/'),
  ('Isuzu', 'Vehicross', 2001, 2001, 'Wheel lug nut', null, null, 87, null, 'https://ricksfreeautorepairadvice.com/isuzu-lug-nut-torque-specs/'),
  ('Jeep', 'Commander', 2007, 2010, 'Wheel lug nut', null, null, 85, 115, 'https://ricksfreeautorepairadvice.com/jeep-lug-nut-torque-specs/'),
  ('Jeep', 'Grand Cherokee', 2007, 2010, 'Wheel lug nut', null, null, 85, 115, 'https://ricksfreeautorepairadvice.com/jeep-lug-nut-torque-specs/'),
  ('Jeep', 'Grand Cherokee', 2011, 2013, 'Wheel lug nut', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/jeep-lug-nut-torque-specs/'),
  ('Jeep', 'Liberty', 2007, 2012, 'Wheel lug nut', null, null, 85, 115, 'https://ricksfreeautorepairadvice.com/jeep-lug-nut-torque-specs/'),
  ('Kia', 'Amanti', 2004, 2006, 'Wheel lug nut', null, null, 65, 86, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Amanti', 2007, 2009, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Borrego', 2009, 2009, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/'),
  ('Kia', 'Cadenza', 2017, 2017, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/kia-lug-nut-torque-specs/');
