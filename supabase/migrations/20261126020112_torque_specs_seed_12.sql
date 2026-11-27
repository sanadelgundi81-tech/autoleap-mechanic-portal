-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 12 of 13
-- 20261126020112_torque_specs_seed_12.sql
--
-- Values copied by script from free public charts (tighttorque.com,
-- checkfitment.com, revrated.com, capritools.com) exactly as stated;
-- each row's source column is the page it came from. A unit the source
-- does not state is null (never converted or guessed). Reference only —
-- always verify against the vehicle's service manual.
--
-- Additive only: inserts rows, no DELETE/DROP. No secrets.
-- ============================================================

insert into public.torque_specs
  (make, model, year_from, year_to, job, torque_nm, torque_nm_max, torque_ftlb, torque_ftlb_max, source)
values
  ('Hyundai', 'Ioniq 5', 2022, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Hyundai', 'Kona', 2018, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Hyundai', 'Palisade', 2020, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Hyundai', 'Veloster', 2012, 2021, 'Wheel lug nut', null, null, 65, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Infiniti', 'G35/G37/Q50', 2003, 2022, 'Wheel lug nut', null, null, 80, 83, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Infiniti', 'FX35/FX50/QX70', 2003, 2018, 'Wheel lug nut', null, null, 83, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Infiniti', 'QX60', 2013, 2022, 'Wheel lug nut', null, null, 83, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Infiniti', 'QX80', 2011, 2022, 'Wheel lug nut', null, null, 98, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Jeep', 'Cherokee', 1984, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Jeep', 'Compass', 2007, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Jeep', 'Renegade', 2015, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Kia', 'Forte', 2010, 2022, 'Wheel lug nut', null, null, 65, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Kia', 'Optima/K5', 2001, 2022, 'Wheel lug nut', null, null, 65, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Kia', 'Soul', 2010, 2022, 'Wheel lug nut', null, null, 65, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Kia', 'Sportage', 2005, 2022, 'Wheel lug nut', null, null, 65, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Kia', 'Telluride', 2020, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'ES', 1990, 2022, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'GS', 1993, 2020, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'GX', 2003, 2022, 'Wheel lug nut', null, null, 83, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'IS', 1999, 2022, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'LC', 2018, 2022, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'LX', 1996, 2022, 'Wheel lug nut', null, null, 97, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'NX', 2015, 2022, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'RC', 2015, 2022, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lexus', 'RX', 1999, 2022, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'Aviator', 2020, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'Continental', 1995, 2020, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'Corsair', 2020, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'MKC/MKX/MKZ', 2007, 2020, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'Navigator (M12 lugs)', 1997, 2002, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'Navigator (M14 lugs)', 2003, 2022, 'Wheel lug nut', null, null, 146, 150, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Lincoln', 'Town Car', 1990, 2011, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', '3', 2004, 2022, 'Wheel lug nut', null, null, 80, 100, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', '6', 2003, 2021, 'Wheel lug nut', null, null, 80, 100, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', 'CX-3', 2016, 2021, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', 'CX-30', 2020, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', 'CX-9', 2007, 2022, 'Wheel lug nut', null, null, 80, 100, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', 'CX-50', 2023, 2024, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mazda', 'Miata/MX-5', 1990, 2022, 'Wheel lug nut', null, null, 65, 87, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'A-Class', 2019, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'CLA', 2014, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'CLS', 2006, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'E-Class', 1990, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'G-Class', 2002, 2022, 'Wheel lug nut', null, null, 110, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'GLA/GLB/GLC', 2015, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'GLE/GLS', 2006, 2022, 'Wheel lug nut', null, null, 110, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'S-Class', 1992, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mercedes-Benz', 'SL/SLC', 1990, 2022, 'Wheel lug nut', null, null, 96, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mitsubishi', 'Eclipse', 1990, 2012, 'Wheel lug nut', null, null, 65, 100, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mitsubishi', 'Eclipse Cross', 2018, 2022, 'Wheel lug nut', null, null, 66, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Mitsubishi', 'Outlander Sport', 2011, 2022, 'Wheel lug nut', null, null, 66, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/');
