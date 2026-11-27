-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 1 of 13
-- 20261126020101_torque_specs_seed_01.sql
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
  ('Acura', 'TL', 1996, 1998, 'Wheel lug nut — Wheel nut', 108, null, 80, null, 'https://tighttorque.com/cars/acura/tl-1'),
  ('Audi', 'A3', 2020, null, 'Wheel lug nut — Wheel bolts 8YA (Sportback)', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a3-4'),
  ('Audi', 'A3', 2020, null, 'Wheel lug nut — Wheel bolts 8YS (Limousine)', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a3-4'),
  ('Audi', 'A3', 2003, 2012, 'Wheel lug nut — Wheel bolts type 8L only', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a3-2'),
  ('Audi', 'A3', 1996, 2002, 'Wheel lug nut — Wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a3-1'),
  ('Audi', 'A4', 2016, null, 'Wheel lug nut — Wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a4-5'),
  ('Audi', 'A4', 2008, 2015, 'Wheel lug nut — Wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a4-4'),
  ('Audi', 'A4', 2000, 2007, 'Wheel lug nut — Wheel bolts 8E2 (Saloon)', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a4-2'),
  ('Audi', 'A4', 2000, 2007, 'Wheel lug nut — Wheel bolts 8E5 (Avant)', 120, null, 89, null, 'https://tighttorque.com/cars/audi/a4-2'),
  ('BMW', '3 Series', 2018, null, 'Wheel lug nut — Wheel bolts M14/SW17 G20 (Sedan)', 140, null, 103, null, 'https://tighttorque.com/cars/bmw/3-series-7'),
  ('BMW', '3 Series', 2011, 2017, 'Wheel lug nut — Wheel bolts F30 F80 (F30, F80, Saloon)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Wheel lug nut — Wheel bolts F31 (Touring)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2004, 2010, 'Wheel lug nut — Wheel bolts E90 (Saloon)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-5'),
  ('BMW', '3 Series', 2004, 2010, 'Wheel lug nut — Wheel bolts E91 (Touring)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-5'),
  ('BMW', '3 Series', 2004, 2010, 'Wheel lug nut — Wheel bolts E92 (Coupe)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-5'),
  ('BMW', '3 Series', 2004, 2010, 'Wheel lug nut — Wheel bolts E93 (Convertible)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-5'),
  ('BMW', '3 Series', 1997, 2003, 'Wheel lug nut — Wheel bolts E46 (Coupe, Convertible)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/3-series-4'),
  ('BMW', '3 Series', 1992, 1999, 'Wheel lug nut — Wheel attachment (Sedan, Coupé, Convertible, Touring, Compact)', 110, 130, 81, 96, 'https://tighttorque.com/cars/bmw/3-series-3'),
  ('BMW', '5 Series', 2017, null, 'Wheel lug nut — Wheel bolts G30', 140, null, 103, null, 'https://tighttorque.com/cars/bmw/5-series-7'),
  ('BMW', '5 Series', 2010, 2017, 'Wheel lug nut — Wheel bolts F10 (Saloon)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/5-series-6'),
  ('BMW', '5 Series', 2010, 2017, 'Wheel lug nut — Wheel bolts F11 (Touring)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/5-series-6'),
  ('BMW', '5 Series', 2003, 2010, 'Wheel lug nut — Wheel bolts E60 (Saloon)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/5-series-5'),
  ('BMW', '5 Series', 2003, 2010, 'Wheel lug nut — Wheel bolts E61 (Touring)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/5-series-5'),
  ('BMW', '5 Series', 1995, 2004, 'Wheel lug nut — Wheel bolts E39 (Saloon, Touring)', 120, null, 89, null, 'https://tighttorque.com/cars/bmw/5-series-4'),
  ('BMW', '6 Series', 2003, 2010, 'Wheel lug nut — Wheel lug nut E63 4.4L Engine (Coupe)', 110, null, 81, null, 'https://tighttorque.com/cars/bmw/6-series-2'),
  ('BMW', '6 Series', 2003, 2010, 'Wheel lug nut — Wheel lug nut E63 4.4L Engine (Coupe)', 130, null, 96, null, 'https://tighttorque.com/cars/bmw/6-series-2'),
  ('BMW', 'F650 CS', 2002, 2005, 'Wheel lug nut — Rear wheel nut', 160, null, 118, null, 'https://tighttorque.com/motorcycles/bmw/f650cs'),
  ('Chevrolet', 'Astro', 1995, 2005, 'Wheel lug nut — Wheel lug nuts', 135.6, null, 100, null, 'https://tighttorque.com/vans/chevrolet/astro-2'),
  ('Chevrolet', 'Avalanche', 2002, 2006, 'Wheel lug nut — Wheel nut Nuts 8.1L Gasoline Engine 2WD', 190, null, 140, null, 'https://tighttorque.com/trucks/chevrolet/avalanche-1'),
  ('Chevrolet', 'Avalanche', 2002, 2006, 'Wheel lug nut — Wheel 8.1L Gasoline Engine 4WD', 115, null, 85, null, 'https://tighttorque.com/trucks/chevrolet/avalanche-1'),
  ('Chevrolet', 'Camaro', 2016, 2024, 'Wheel lug nut — Wheel nuts', 190, null, 140, null, 'https://tighttorque.com/cars/chevrolet/camaro-6'),
  ('Chevrolet', 'Cavalier', 1995, 2005, 'Wheel lug nut — Wheel nuts 2.4L Engine SFI', 140, null, 103, null, 'https://tighttorque.com/cars/chevrolet/cavalier-3'),
  ('Chevrolet', 'Colorado', 2015, null, 'Wheel lug nut — Wheel nuts', 118, null, 87, null, 'https://tighttorque.com/trucks/chevrolet/colorado-2'),
  ('Chevrolet', 'Colorado', 2004, 2012, 'Wheel lug nut — Wheel lug nut', 136, null, 100, null, 'https://tighttorque.com/trucks/chevrolet/colorado-1'),
  ('Chevrolet', 'Cruze', 2008, 2016, 'Wheel lug nut — Wheel nuts', 140, null, 103, null, 'https://tighttorque.com/cars/chevrolet/cruze-1'),
  ('Chevrolet', 'D-Max', 2011, null, 'Wheel lug nut — Wheel nut', 120, null, 89, null, 'https://tighttorque.com/trucks/chevrolet/d-max-2'),
  ('Chevrolet', 'D-Max', 2002, 2012, 'Wheel lug nut — Wheel nut Steel wheel', 118, null, 87, null, 'https://tighttorque.com/trucks/chevrolet/d-max-1'),
  ('Chevrolet', 'Equinox', 2010, 2017, 'Wheel lug nut — Wheel fastener 3.0L Gasoline Engine V6', 190, null, 140, null, 'https://tighttorque.com/cars/chevrolet/equinox-2'),
  ('Chevrolet', 'Impala', 2000, 2005, 'Wheel lug nut — Wheel nuts 3.8L Gasoline Engine V6', 140, null, 103, null, 'https://tighttorque.com/cars/chevrolet/impala-eighth'),
  ('Chevrolet', 'S10', 2012, null, 'Wheel lug nut — Wheel nuts', 118, null, 87, null, 'https://tighttorque.com/trucks/chevrolet/s10-3'),
  ('Chevrolet', 'S10', 1994, 2004, 'Wheel lug nut — Wheel lug nut', 130, null, 96, null, 'https://tighttorque.com/trucks/chevrolet/s10-2'),
  ('Chevrolet', 'Silverado', 2019, null, 'Wheel lug nut — Lug nut', 190, null, 140, null, 'https://tighttorque.com/trucks/chevy/silverado-4'),
  ('Chevrolet', 'Silverado', 2014, 2018, 'Wheel lug nut — Wheel nut', 190, null, 140, null, 'https://tighttorque.com/trucks/chevy/silverado-3'),
  ('Chevrolet', 'Silverado', 2007, 2014, 'Wheel lug nut — Wheel lug nut', 190, null, 140, null, 'https://tighttorque.com/trucks/chevy/silverado-2'),
  ('Chevrolet', 'Silverado', 1998, 2006, 'Wheel lug nut — Lug nuts', 190, null, 140, null, 'https://tighttorque.com/trucks/chevy/silverado-1'),
  ('Chrysler', 'Voyager', 1996, 2000, 'Wheel lug nut — Wheel mounting lug nut', 110, 135, 81, 100, 'https://tighttorque.com/vans/chrysler/voyager-3'),
  ('Chrysler', 'Voyager', 1996, 2000, 'Wheel lug nut — Lug nuts', 129, null, 95, null, 'https://tighttorque.com/vans/chrysler/voyager-3');
