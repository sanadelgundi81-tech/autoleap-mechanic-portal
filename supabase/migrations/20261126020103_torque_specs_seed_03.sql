-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 3 of 13
-- 20261126020103_torque_specs_seed_03.sql
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
  ('Ford', 'Ranger', 1998, 2012, 'Wheel lug nut — Wheel nuts', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-3-usa'),
  ('Ford', 'Ranger', 1998, 2006, 'Wheel lug nut — Wheel fastener 4.0 Petrol Engine V6', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-1'),
  ('Ford', 'Ranger', 1993, 1997, 'Wheel lug nut — Lug nuts 2.3L Engine 4WD', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-2-usa'),
  ('Ford', 'Ranger', 1993, 1997, 'Wheel lug nut — Lug nuts 3.0L Engine 4WD', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-2-usa'),
  ('Ford', 'Ranger', 1993, 1997, 'Wheel lug nut — Lug nuts 4.0L Engine 2WD', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-2-usa'),
  ('Ford', 'Super Duty', 2017, null, 'Wheel lug nut — Wheel lug nuts F-250 6.2L Engine', 203, null, 150, null, 'https://tighttorque.com/trucks/ford/super-duty-4'),
  ('Ford', 'Super Duty', 2017, null, 'Wheel lug nut — Wheel lug nuts F-250 6.7L Engine', 203, null, 150, null, 'https://tighttorque.com/trucks/ford/super-duty-4'),
  ('Ford', 'Super Duty', 2017, null, 'Wheel lug nut — Wheel lug nuts F-350 Dually Suspension', 224, null, 165, null, 'https://tighttorque.com/trucks/ford/super-duty-4'),
  ('Ford', 'Super Duty', 2011, 2016, 'Wheel lug nut — Wheel nuts SRW DRW', 224, null, 165, null, 'https://tighttorque.com/trucks/ford/super-duty-3'),
  ('Ford', 'Super Duty', 2008, 2010, 'Wheel lug nut — Wheel nuts SRW DRW', 224, null, 165, null, 'https://tighttorque.com/trucks/ford/super-duty-2'),
  ('Ford', 'Super Duty', 1999, 2007, 'Wheel lug nut — 8-Lug M14 wheel bolts', 200, null, 148, null, 'https://tighttorque.com/trucks/ford/super-duty-1'),
  ('Ford', 'Taurus', 2008, 2009, 'Wheel lug nut — Wheel nuts', 133, null, 98, null, 'https://tighttorque.com/cars/ford/taurus-5'),
  ('Ford', 'Transit Connect', 2002, 2012, 'Wheel lug nut — Wheel nuts Alloy wheel 1.8L Engine', 120, null, 89, null, 'https://tighttorque.com/vans/ford/transit-connect-1'),
  ('Ford', 'Transit Connect', 2002, 2012, 'Wheel lug nut — Wheel nuts 2.0L Engine', 90, null, 66, null, 'https://tighttorque.com/vans/ford/transit-connect-1'),
  ('Ford', 'Transit Custom', 2012, null, 'Wheel lug nut — Lug nut', 200, null, 148, null, 'https://tighttorque.com/vans/ford/transit-custom-1'),
  ('GMC', 'Canyon', 2015, null, 'Wheel lug nut — Wheel nuts', 118, null, 87, null, 'https://tighttorque.com/trucks/gmc/canyon-2'),
  ('GMC', 'Canyon', 2004, 2012, 'Wheel lug nut — Wheel lug nut', 136, null, 100, null, 'https://tighttorque.com/trucks/gmc/canyon-1'),
  ('GMC', 'Safari', 1995, 2005, 'Wheel lug nut — Wheel lug nuts', 135.6, null, 100, null, 'https://tighttorque.com/vans/gmc/safari-2'),
  ('GMC', 'Sierra', 2019, null, 'Wheel lug nut — Lug nut', 190, null, 140, null, 'https://tighttorque.com/trucks/gmc/sierra-5'),
  ('GMC', 'Sierra', 2014, 2018, 'Wheel lug nut — Wheel nut', 190, null, 140, null, 'https://tighttorque.com/trucks/gmc/sierra-4'),
  ('GMC', 'Sierra', 2007, 2014, 'Wheel lug nut — Wheel lug nut', 190, null, 140, null, 'https://tighttorque.com/trucks/gmc/sierra-3'),
  ('GMC', 'Sierra', 1998, 2006, 'Wheel lug nut — Lug nuts', 190, null, 140, null, 'https://tighttorque.com/trucks/gmc/sierra-2'),
  ('Holden', 'Colorado', 2015, null, 'Wheel lug nut — Wheel nuts', 118, null, 87, null, 'https://tighttorque.com/trucks/holden/colorado-2'),
  ('Holden', 'Colorado', 2008, 2012, 'Wheel lug nut — Wheel lug nut', 136, null, 100, null, 'https://tighttorque.com/trucks/holden/colorado-1'),
  ('Holden', 'Rodeo', 2002, 2012, 'Wheel lug nut — Wheel nut Steel wheel', 118, null, 87, null, 'https://tighttorque.com/trucks/holden/rodeo-1'),
  ('Honda', 'Accord', 2017, 2022, 'Wheel lug nut — Wheel nuts 1.5L Engine', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-10'),
  ('Honda', 'Accord', 2017, 2022, 'Wheel lug nut — Wheel nuts 2.0L Engine', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-10'),
  ('Honda', 'Accord', 2017, 2022, 'Wheel lug nut — Wheel nuts Hybrid Model', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-10'),
  ('Honda', 'Accord', 2012, 2017, 'Wheel lug nut — Wheel nuts L4 Engine', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-9'),
  ('Honda', 'Accord', 2012, 2017, 'Wheel lug nut — Wheel nuts V6 Engine', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-9'),
  ('Honda', 'Accord', 2012, 2017, 'Wheel lug nut — Wheel nuts Plug-In Model', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-9'),
  ('Honda', 'Accord', 2012, 2017, 'Wheel lug nut — Wheel nuts Hybrid Model', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-9'),
  ('Honda', 'Accord', 2007, 2012, 'Wheel lug nut — Front wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-8'),
  ('Honda', 'Accord', 2007, 2012, 'Wheel lug nut — Rear wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-8'),
  ('Honda', 'Accord', 2002, 2007, 'Wheel lug nut — Wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-7'),
  ('Honda', 'Accord', 2002, 2007, 'Wheel lug nut — Wheel nuts V6 Engine', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-7'),
  ('Honda', 'Accord', 1994, 1997, 'Wheel lug nut — Wheel nut Front', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-5'),
  ('Honda', 'Accord', 1992, 2002, 'Wheel lug nut — Front wheel nuts Nuts 12x1.5mm', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-6'),
  ('Honda', 'Accord', 1992, 2002, 'Wheel lug nut — Rear wheel nuts Nuts 12x1.5mm, Disc brake', 108, null, 80, null, 'https://tighttorque.com/cars/honda/accord-6'),
  ('Honda', 'Civic', 2021, null, 'Wheel lug nut — Front wheel nuts', 127, null, 94, null, 'https://tighttorque.com/cars/honda/civic-11'),
  ('Honda', 'Civic', 2021, null, 'Wheel lug nut — Rear wheel nuts', 127, null, 94, null, 'https://tighttorque.com/cars/honda/civic-11'),
  ('Honda', 'Civic', 2015, 2020, 'Wheel lug nut — Front wheel nuts Si', 109, null, 80, null, 'https://tighttorque.com/cars/honda/civic-10th-gen'),
  ('Honda', 'Civic', 2015, 2020, 'Wheel lug nut — Front wheel nuts Type-R', 127, null, 94, null, 'https://tighttorque.com/cars/honda/civic-10th-gen'),
  ('Honda', 'Civic', 2015, 2020, 'Wheel lug nut — Rear wheel nuts Si', 109, null, 80, null, 'https://tighttorque.com/cars/honda/civic-10th-gen'),
  ('Honda', 'Civic', 2015, 2020, 'Wheel lug nut — Rear wheel nuts Type-R', 127, null, 94, null, 'https://tighttorque.com/cars/honda/civic-10th-gen'),
  ('Honda', 'Civic', 2011, 2014, 'Wheel lug nut — Front wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/civic-9th-gen'),
  ('Honda', 'Civic', 2011, 2014, 'Wheel lug nut — Rear wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/civic-9th-gen'),
  ('Honda', 'Civic', 2005, 2010, 'Wheel lug nut — Front wheel nuts GX', 108, null, 80, null, 'https://tighttorque.com/cars/honda/civic-8th-gen');
