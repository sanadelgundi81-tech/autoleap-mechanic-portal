-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 10 of 13
-- 20261126020110_torque_specs_seed_10.sql
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
  ('Volkswagen', 'Golf GTI', 2022, 2024, 'Wheel lug nut (M14x1.5 (bolts))', 140, null, 103, null, 'https://www.checkfitment.com/fitment/volkswagen/golf-gti/'),
  ('Subaru', 'Outback', 2015, 2025, 'Wheel lug nut (12mm × 1.25)', null, null, 89, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Subaru', 'Impreza', 2017, 2025, 'Wheel lug nut (12mm × 1.25)', null, null, 89, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Mazda', 'Mazda3', 2014, 2025, 'Wheel lug nut (12mm × 1.5)', null, null, 80, 108, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Mazda', 'CX-5', 2017, 2025, 'Wheel lug nut (12mm × 1.5)', null, null, 80, 108, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Hyundai', 'Tucson', 2016, 2025, 'Wheel lug nut (12mm × 1.5)', null, null, 79, 94, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Kia', 'Sorento', 2016, 2025, 'Wheel lug nut (12mm × 1.5)', null, null, 79, 94, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Volkswagen', 'Jetta', 2011, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 89, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Volkswagen', 'Tiguan', 2018, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 89, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Mercedes-Benz', 'C-Class', 2015, 2025, 'Wheel lug nut (M14 × 1.5)', null, null, 96, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Ford', 'F-250 / F-350', 2017, 2019, 'Wheel lug nut (14mm × 1.5)', null, null, 165, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Ford', 'F-250 / F-350', 2020, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 150, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Ford', 'Escape', 2013, 2025, 'Wheel lug nut (12mm × 1.5)', null, null, 100, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Chevrolet', 'Silverado 1500', 2014, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 140, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Chevrolet', 'Silverado 2500/3500 HD', 2011, 2025, 'Wheel lug nut (M14 × 1.5)', null, null, 140, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('GMC', 'Sierra 1500', 2014, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 140, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Ram', '2500 / 3500 (single rear wheel)', 2014, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 130, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Ram', '3500 dually (flanged nuts)', 2014, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 129, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Jeep', 'Wrangler JL', 2018, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 130, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Jeep', 'Wrangler JK', 2014, 2018, 'Wheel lug nut (1/2" × 20)', null, null, 100, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Jeep', 'Grand Cherokee', 2014, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 130, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Tesla', 'Model Y', 2020, 2025, 'Wheel lug nut (14mm × 1.5)', null, null, 129, null, 'https://revrated.com/lug-nut-torque-chart/'),
  ('Acura', 'CL (all)', 1997, 2003, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'ILX', 2013, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'Integra', 1986, 2001, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'Legend', 1986, 1995, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'MDX', 2001, 2006, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'MDX', 2007, 2013, 'Wheel lug nut', null, null, 95, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'MDX', 2014, 2016, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'MDX', 2018, 2022, 'Wheel lug nut', null, null, 95, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'NSX (NA1/NA2)', 1991, 2005, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'NSX', 2016, 2022, 'Wheel lug nut', null, null, 120, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'RDX', 2007, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'RL', 2005, 2012, 'Wheel lug nut', null, null, 95, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'RLX', 2014, 2018, 'Wheel lug nut', null, null, 95, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'RSX', 2002, 2006, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'TLX (2.4L)', 2016, 2019, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'TLX (all)', 2020, 2022, 'Wheel lug nut', null, null, 95, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'TSX', 2004, 2006, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Acura', 'TSX', 2007, 2014, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Alfa Romeo', '4C', 2015, 2018, 'Wheel lug nut', null, null, 75, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Alfa Romeo', 'Giulia', 2018, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Alfa Romeo', 'Stelvio', 2018, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'A5 (all)', 2008, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'A6 (all)', 1995, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'A7', 2012, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'A8/A8L', 1997, 2021, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'Q3', 2015, 2018, 'Wheel lug nut', null, null, 105, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'Q3', 2019, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'Q7', 2007, 2022, 'Wheel lug nut', null, null, 120, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'Q8', 2019, 2022, 'Wheel lug nut', null, null, 120, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Audi', 'R8', 2008, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/');
