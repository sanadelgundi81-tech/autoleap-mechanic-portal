-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 11 of 13
-- 20261126020111_torque_specs_seed_11.sql
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
  ('Audi', 'TT / TT RS / TTS', 1999, 2022, 'Wheel lug nut', null, null, 90, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Cadillac', 'ATS', 2013, 2019, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Cadillac', 'CT4/CT5', 2020, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Cadillac', 'CTS', 2003, 2019, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Cadillac', 'Escalade', 1999, 2022, 'Wheel lug nut', null, null, 140, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Cadillac', 'SRX', 2004, 2016, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Cadillac', 'XT4/XT5/XT6', 2017, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Aveo', 2004, 2006, 'Wheel lug nut', null, null, 88, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Geo Metro', 1990, 2001, 'Wheel lug nut', null, null, 45, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Geo Prizm', 1990, 2002, 'Wheel lug nut', null, null, 76, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Spark', 2013, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Volt', 2011, 2019, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Silverado 2500HD/3500HD', 1999, 2022, 'Wheel lug nut', null, null, 140, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Suburban/Tahoe', 1995, 2022, 'Wheel lug nut', null, null, 140, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Traverse', 2009, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chevrolet', 'Trailblazer', 2002, 2009, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chrysler', '200', 2011, 2017, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chrysler', '300', 2011, 2013, 'Wheel lug nut', null, null, 110, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chrysler', '300', 2014, 2022, 'Wheel lug nut', null, null, 130, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chrysler', 'Pacifica', 2017, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Chrysler', 'Town & Country', 1996, 2016, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Avenger', 1995, 1998, 'Wheel lug nut', null, null, 85, 100, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Challenger', 2008, 2022, 'Wheel lug nut', null, null, 110, 130, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Charger', 2006, 2022, 'Wheel lug nut', null, null, 110, 130, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Dart', 2013, 2016, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Neon', 1995, 2005, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Durango', 1998, 2022, 'Wheel lug nut', null, null, 130, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Grand Caravan', 1996, 2020, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Dodge', 'Journey', 2009, 2020, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Escort', 1990, 2003, 'Wheel lug nut', null, null, 65, 87, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Fiesta', 2011, 2019, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Five Hundred/Freestyle', 2005, 2007, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Focus', 2000, 2018, 'Wheel lug nut', null, null, 94, 100, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Fusion', 2006, 2020, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Bronco', 2021, 2022, 'Wheel lug nut', null, null, 150, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Edge', 2007, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'Expedition (6-lug)', 2003, 2022, 'Wheel lug nut', null, null, 150, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'F-250/F-350 Super Duty', 1999, 2005, 'Wheel lug nut', null, null, 155, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Ford', 'F-250/F-350 Super Duty', 2006, 2022, 'Wheel lug nut', null, null, 160, 165, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('GMC', 'Acadia', 2007, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('GMC', 'Sierra 2500HD/3500HD', 1999, 2022, 'Wheel lug nut', null, null, 140, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('GMC', 'Terrain', 2010, 2022, 'Wheel lug nut', null, null, 100, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('GMC', 'Yukon/Yukon XL', 1995, 2022, 'Wheel lug nut', null, null, 140, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'Element', 2003, 2011, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'Fit', 2007, 2020, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'HR-V', 2016, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'Insight', 2010, 2022, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'Passport', 2019, 2022, 'Wheel lug nut', null, null, 94, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'Pilot', 2003, 2022, 'Wheel lug nut', null, null, 94, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Honda', 'S2000', 1999, 2009, 'Wheel lug nut', null, null, 80, null, 'https://capritools.com/wheel-lug-nut-torque-specification/'),
  ('Hyundai', 'Accent', 1995, 2022, 'Wheel lug nut', null, null, 65, 80, 'https://capritools.com/wheel-lug-nut-torque-specification/');
