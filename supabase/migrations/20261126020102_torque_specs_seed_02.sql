-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 2 of 13
-- 20261126020102_torque_specs_seed_02.sql
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
  ('Citroën', 'Berlingo', 2008, 2018, 'Wheel lug nut — Wheel bolts Diesel engine', 100, null, 74, null, 'https://tighttorque.com/vans/citroen/berlingo-2'),
  ('Citroën', 'Jumper', 2006, null, 'Wheel lug nut — Road wheels Steel rims, 15 inch wheels', 160, null, 118, null, 'https://tighttorque.com/vans/citroen/jumper-3'),
  ('Citroën', 'Jumpy', 2007, null, 'Wheel lug nut — Road wheels Steel rims', 100, null, 74, null, 'https://tighttorque.com/vans/citroen/jumpy-2'),
  ('Citroën', 'Relay', 2006, null, 'Wheel lug nut — Road wheels Steel rims, 15 inch wheels', 160, null, 118, null, 'https://tighttorque.com/vans/citroen/relay-3'),
  ('Dodge', 'Caliber', 2007, 2012, 'Wheel lug nut — Front wheel lug nuts', 128, null, 94, null, 'https://tighttorque.com/cars/dodge/caliber-1'),
  ('Dodge', 'Caliber', 2007, 2012, 'Wheel lug nut — Wheel mounting nuts AWD', 135, null, 100, null, 'https://tighttorque.com/cars/dodge/caliber-1'),
  ('Dodge', 'Caliber', 2007, 2012, 'Wheel lug nut — Wheel mounting nuts FWD', 135, null, 100, null, 'https://tighttorque.com/cars/dodge/caliber-1'),
  ('Dodge', 'Caravan', 1996, 2000, 'Wheel lug nut — Wheel mounting lug nut', 110, 135, 81, 100, 'https://tighttorque.com/vans/dodge/caravan-3'),
  ('Dodge', 'Dakota', 2005, 2011, 'Wheel lug nut — Wheel lug nut', 183, null, 135, null, 'https://tighttorque.com/trucks/dodge/dakota-3'),
  ('Dodge', 'Dakota', 1997, 2004, 'Wheel lug nut — Wheel lug nut', 115, 157, 85, 116, 'https://tighttorque.com/trucks/dodge/dakota-2'),
  ('Dodge', 'Nitro', 2007, 2012, 'Wheel lug nut — Wheel mounting nuts R/T', 129, null, 95, null, 'https://tighttorque.com/cars/dodge/nitro-1'),
  ('Dodge', 'Ram', 2009, 2019, 'Wheel lug nut — Lug nut M14 bolt Model 1500', 183, null, 135, null, 'https://tighttorque.com/trucks/dodge/ram-4'),
  ('Dodge', 'Ram', 2009, 2019, 'Wheel lug nut — Lug nut M14 bolt Model 2500 Model 3500 SRW (Model 2500, Model 3500)', 203, null, 150, null, 'https://tighttorque.com/trucks/dodge/ram-4'),
  ('Dodge', 'Ram', 2009, 2019, 'Wheel lug nut — Lug nut M14 bolt, with flat washer Model 3500 Model 4500 Model 5500 DRW (Model 3500, Model 4500, Model 5500)', 196, null, 145, null, 'https://tighttorque.com/trucks/dodge/ram-4'),
  ('Dodge', 'Ram', 2002, 2009, 'Wheel lug nut — Lug nut 9/16 x 18 with 60° cone 1500 (LD)', 129, null, 95, null, 'https://tighttorque.com/trucks/dodge/ram-3'),
  ('Dodge', 'Ram', 2002, 2009, 'Wheel lug nut — Lug nut 9/16 x 18 with 60° cone 2500 SRW (HD)', 197, null, 145, null, 'https://tighttorque.com/trucks/dodge/ram-3'),
  ('Dodge', 'Ram', 2002, 2009, 'Wheel lug nut — Lug nut 9/16 x 18 with flat washer 3500 DRW (HD)', 210, null, 155, null, 'https://tighttorque.com/trucks/dodge/ram-3'),
  ('Dodge', 'Ram', 1994, 2002, 'Wheel lug nut — Lug nut 5 stud wheel', 130, null, 96, null, 'https://tighttorque.com/trucks/dodge/ram-2'),
  ('Dodge', 'Sprinter', 2003, 2006, 'Wheel lug nut — Wheel lug nut 2500 Series', 240, null, 177, null, 'https://tighttorque.com/vans/dodge/sprinter-1'),
  ('Dodge', 'Sprinter', 2003, 2006, 'Wheel lug nut — Wheel lug nut 3500 Series', 190, null, 140, null, 'https://tighttorque.com/vans/dodge/sprinter-1'),
  ('Fiat', 'Ducato', 2006, null, 'Wheel lug nut — Road wheels Steel rims, 15 inch wheels', 160, null, 118, null, 'https://tighttorque.com/vans/fiat/ducato-3'),
  ('Fiat', 'Scudo', 2007, null, 'Wheel lug nut — Road wheels Steel rims', 100, null, 74, null, 'https://tighttorque.com/vans/fiat/scudo-2'),
  ('Ford', 'Crown Victoria', 1998, 2012, 'Wheel lug nut — Wheel nuts', 135, null, 100, null, 'https://tighttorque.com/cars/ford/crown-victoria-2'),
  ('Ford', 'E-Series', 2008, 2014, 'Wheel lug nut — Wheel nuts SRW DRW', 200, null, 148, null, 'https://tighttorque.com/vans/ford/e-series-4-2'),
  ('Ford', 'E-Series', 2003, 2007, 'Wheel lug nut — Wheel lug nut E-150, Bolt 1/2 -20', 135, null, 100, null, 'https://tighttorque.com/vans/ford/e-series-4-1'),
  ('Ford', 'Explorer', 2007, 2010, 'Wheel lug nut — Wheel nuts 4.0L V6 Engine', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/explorer-sport-trac-2-2007'),
  ('Ford', 'Explorer', 2007, 2010, 'Wheel lug nut — Wheel lug nuts 4.6L V8 Engine', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/explorer-sport-trac-2-2007'),
  ('Ford', 'Explorer', 2001, 2005, 'Wheel lug nut — Wheel nuts 4.0L SOHC Engine 2WD', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/explorer-sport-trac-1-2001'),
  ('Ford', 'F-150', 2021, null, 'Wheel lug nut — Wheel nuts', 204, null, 150, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2015, 2020, 'Wheel lug nut — Wheel nuts', 204, null, 150, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2009, 2014, 'Wheel lug nut — Wheel nuts', 204, null, 150, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2004, 2008, 'Wheel lug nut — Wheel nuts', 204, null, 150, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 1997, 2004, 'Wheel lug nut — Wheel lug nut 12mm', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1992, 1997, 'Wheel lug nut — Wheel lug nuts', 112, null, 83, null, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('Ford', 'F-150', 1992, 1997, 'Wheel lug nut — Wheel lug nuts', 152, null, 112, null, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('Ford', 'F-150', 1992, 1997, 'Wheel lug nut — Wheel lug nuts 7.3L Engine', 190, null, 140, null, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('Ford', 'F-150 Raptor', 2017, 2020, 'Wheel lug nut — Lug nut', 204, null, 150, null, 'https://tighttorque.com/trucks/ford/f150-2-raptor'),
  ('Ford', 'F-150 Raptor', 2010, 2014, 'Wheel lug nut — Lug nuts', 203, null, 150, null, 'https://tighttorque.com/trucks/ford/f150-1-raptor'),
  ('Ford', 'Falcon', 2008, 2016, 'Wheel lug nut — Wheel nuts', 135, null, 100, null, 'https://tighttorque.com/cars/ford/falcon-7'),
  ('Ford', 'Falcon', 1998, 2008, 'Wheel lug nut — Front wheel nut BA Model', 125, null, 92, null, 'https://tighttorque.com/cars/ford/falcon-6'),
  ('Ford', 'Falcon', 1998, 2008, 'Wheel lug nut — Rear wheel nut BA Model Beam Axle', 125, null, 92, null, 'https://tighttorque.com/cars/ford/falcon-6'),
  ('Ford', 'Falcon', 1988, 1998, 'Wheel lug nut — Wheel lug nuts', 135, null, 100, null, 'https://tighttorque.com/cars/ford/falcon-5'),
  ('Ford', 'Maverick', 2022, null, 'Wheel lug nut — Wheel nuts 2.0L EcoBoost Engine', 204, null, 150, null, 'https://tighttorque.com/trucks/ford/maverick-2022'),
  ('Ford', 'Ranger', 2019, null, 'Wheel lug nut — Wheel nuts', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-4-usa'),
  ('Ford', 'Ranger', 2006, 2011, 'Wheel lug nut — Wheel nuts 2WD 3.0L Diesel Engine', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-2'),
  ('Ford', 'Ranger', 2006, 2011, 'Wheel lug nut — Wheel nuts 4WD 4.0L Diesel Engine', 135, null, 100, null, 'https://tighttorque.com/trucks/ford/ranger-2');
