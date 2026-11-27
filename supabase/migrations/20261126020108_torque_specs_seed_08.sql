-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 8 of 13
-- 20261126020108_torque_specs_seed_08.sql
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
  ('Ford', 'F-150', 2015, 2020, 'Oil drain plug — Oil pan drain plug 3.5L EcoBoost Engine', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Oil drain plug — Oil pan drain plug 5.0L Engine', 26, null, 19, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2009, 2014, 'Oil drain plug — Oil pan drain plug 3.5L Engine', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Oil drain plug — Oil pan drain plug 3.7L Engine', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Oil drain plug — Oil pan drain plug 5.0L Engine', 26, null, 19, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Oil drain plug — Drain plug 6.2L Engine', 23, null, 17, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2004, 2008, 'Oil drain plug — Oil drain plug 4.2L Engine', 23, null, 17, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Oil drain plug — Oil pan drain plug 4.6L Engine', 14, null, 10, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Oil drain plug — Oil pan drain plug 5.4L Engine', 14, null, 10, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 1997, 2004, 'Oil drain plug — Drain plug 4.2L Engine 4x2', 14, null, 10, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Oil drain plug — Drain plug 4.6L Engine 4x2', 14, null, 10, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Oil drain plug — Oil pan drain plug 4.2L Engine', 26, null, 19, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1992, 1997, 'Oil drain plug — Oil pan drain plug 7.3L Turbo Diesel Engine', 37, null, 27, null, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('BMW', '3 Series', 2011, 2017, 'Spark plugs — Spark plugs F30 N20 (Saloon)', 23, null, 17, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '5 Series', 2017, null, 'Spark plugs — Spark plugs M12x1.25 G30', 23, null, 17, null, 'https://tighttorque.com/cars/bmw/5-series-7'),
  ('Ford', 'F-150', 2021, null, 'Spark plugs — Spark plugs 2.7L EcoBoost Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2021, null, 'Spark plugs — Spark plugs 3.3L Duratec Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2021, null, 'Spark plugs — Spark plugs 3.5L EcoBoost Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2021, null, 'Spark plugs — Spark plugs 5.0L Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2021, null, 'Spark plugs — Glow plugs 3.0L Power Stroke Diesel Engine', 11, null, 8.1, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2015, 2020, 'Spark plugs — Spark plugs 2.7L EcoBoost Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Spark plugs — Spark plugs 3.5L Duratec Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Spark plugs — Spark plugs 3.5L EcoBoost Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Spark plugs — Spark plugs 5.0L Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2009, 2014, 'Spark plugs — Spark plugs 3.5L Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Spark plugs — Spark plugs 3.7L Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Spark plugs — Spark plugs 5.0L Engine', 14, null, 10, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Spark plugs — Spark plugs 6.2L Engine', 18, null, 13, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2004, 2008, 'Spark plugs — Spark plugs 4.2L Engine', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Spark plugs — Spark plugs 4.6L Engine', 18, null, 13, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Spark plugs — Spark plugs 5.4L Engine', 34, null, 25, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 1992, 1997, 'Spark plugs — Glow plug 7.3L Turbo Diesel Engine', 19, null, 14, null, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper F30 (Saloon)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper F80 (Saloon)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper F31 (Touring)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper F34 (GT)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper guide pins F30 (Saloon)', 28, null, 21, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Rear brake caliper guide pins F30 (Saloon)', 28, null, 21, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Rear brake caliper F30 (Saloon)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper bracket F30 (Saloon)', 110, null, 81, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper bracket F80 (Saloon)', 110, null, 81, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper bracket F31 (Touring)', 110, null, 81, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Front brake caliper bracket F34 (GT)', 110, null, 81, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Brake caliper bolts — Rear brake caliper bracket F30 (Saloon)', 50, null, 37, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('Ford', 'F-150', 2021, null, 'Brake caliper bolts — Front brake caliper bolts', 36, null, 27, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2021, null, 'Brake caliper bolts — Rear brake caliper bolts', 32, null, 24, null, 'https://tighttorque.com/trucks/ford/f150-14');
