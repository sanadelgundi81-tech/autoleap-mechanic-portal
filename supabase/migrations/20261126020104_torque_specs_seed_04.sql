-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 4 of 13
-- 20261126020104_torque_specs_seed_04.sql
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
  ('Honda', 'Civic', 2005, 2010, 'Wheel lug nut — Rear wheel nuts Disc brake type GX', 108, null, 80, null, 'https://tighttorque.com/cars/honda/civic-8th-gen'),
  ('Honda', 'CR-V', 2011, 2015, 'Wheel lug nut — Front wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/cr-v-4th-gen'),
  ('Honda', 'CR-V', 2011, 2015, 'Wheel lug nut — Rear wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/honda/cr-v-4th-gen'),
  ('Honda', 'Odyssey', 2005, 2010, 'Wheel lug nut — Wheel nuts', 127, null, 94, null, 'https://tighttorque.com/vans/honda/odyssey-us-3'),
  ('Honda', 'Odyssey', 1999, 2004, 'Wheel lug nut — Wheel nut', 108, null, 80, null, 'https://tighttorque.com/vans/honda/odyssey-us-2'),
  ('Honda', 'Ridgeline', 2017, null, 'Wheel lug nut — Wheel lug nuts', 128, null, 94, null, 'https://tighttorque.com/trucks/honda/ridgeline-2'),
  ('Honda', 'Ridgeline', 2006, 2016, 'Wheel lug nut — Wheel nuts', 127, null, 94, null, 'https://tighttorque.com/trucks/honda/ridgeline-1'),
  ('Hummer', 'H2', 2003, 2009, 'Wheel lug nut — Single wheel nuts', 190, null, 140, null, 'https://tighttorque.com/trucks/hummer/h2'),
  ('Hyundai', 'Elantra', 2010, 2015, 'Wheel lug nut — Wheel nut', 90, 110, 66, 81, 'https://tighttorque.com/cars/hyundai/elantra-5'),
  ('Hyundai', 'Elantra', 1996, 2000, 'Wheel lug nut — Wheel lug nuts', 88, 108, 65, 80, 'https://tighttorque.com/cars/hyundai/elantra-ii'),
  ('Hyundai', 'Santa Fe', 2001, 2006, 'Wheel lug nut — Wheel nut', 90, 110, 66, 81, 'https://tighttorque.com/cars/hyundai/santa-fe-1'),
  ('Hyundai', 'Sonata', 2005, 2009, 'Wheel lug nut — Wheel Lug Nuts', 90, 110, 66, 81, 'https://tighttorque.com/cars/hyundai/senota-5'),
  ('Isuzu', 'D-Max', 2011, null, 'Wheel lug nut — Wheel nut', 120, null, 89, null, 'https://tighttorque.com/trucks/isuzu/d-max-2'),
  ('Isuzu', 'D-Max', 2002, 2012, 'Wheel lug nut — Wheel nut Steel wheel', 118, null, 87, null, 'https://tighttorque.com/trucks/isuzu/d-max-1'),
  ('Jaguar', 'XK', 2006, 2014, 'Wheel lug nut — Wheel nuts', 125, null, 92, null, 'https://tighttorque.com/cars/jaguar/x150'),
  ('Jaguar', 'XK', 1997, 2006, 'Wheel lug nut — Lug nuts Steel wheel', 68, 82, 50, 60, 'https://tighttorque.com/cars/jaguar/xk-1'),
  ('Jeep', 'Gladiator', 2020, null, 'Wheel lug nut — Lug nut/bolt', 176, null, 130, null, 'https://tighttorque.com/trucks/jeep/gladiator-1-2020'),
  ('Kia', 'Optima', 2011, 2015, 'Wheel lug nut — Front wheel nut T-GDI 2.0 Gasoline Engine', 88, 108, 65, 80, 'https://tighttorque.com/cars/kia/optima-3'),
  ('Kia', 'Optima', 2011, 2015, 'Wheel lug nut — Front wheel nut Theta-II 2.4 GDI Gasoline Engine', 88, 108, 65, 80, 'https://tighttorque.com/cars/kia/optima-3'),
  ('Kia', 'Optima', 2011, 2015, 'Wheel lug nut — Rear wheel nut T-GDI 2.0 Gasoline Engine', 88, 108, 65, 80, 'https://tighttorque.com/cars/kia/optima-3'),
  ('Kia', 'Optima', 2011, 2015, 'Wheel lug nut — Rear wheel nut Theta-II 2.4 GDI Gasoline Engine', 88, 108, 65, 80, 'https://tighttorque.com/cars/kia/optima-3'),
  ('Kia', 'Optima', 2006, 2010, 'Wheel lug nut — Wheel fastener wheel nut 2.4L Gasoline Engine L4', 90, 110, 66, 81, 'https://tighttorque.com/cars/kia/optima-2'),
  ('Kia', 'Optima', 2001, 2005, 'Wheel lug nut — Wheel Fastener Wheel Nut', 90, 110, 66, 81, 'https://tighttorque.com/cars/kia/optima-1'),
  ('Land Rover', 'Defender', 1990, 2016, 'Wheel lug nut — Road wheels Alloy wheels', 130, null, 96, null, 'https://tighttorque.com/trucks/land-rover/defender'),
  ('Land Rover', 'Range Rover', 1994, 2002, 'Wheel lug nut — Road wheel nuts', 108, null, 80, null, 'https://tighttorque.com/cars/land-rover/range-rover-2'),
  ('Mazda', 'BT-50', 2011, 2020, 'Wheel lug nut — Wheel nuts', 88, 118, 65, 87, 'https://tighttorque.com/trucks/mazda/bt-50-2'),
  ('Mazda', 'BT-50', 2006, 2011, 'Wheel lug nut — Wheels', 88, 118, 65, 87, 'https://tighttorque.com/trucks/mazda/bt-50-1'),
  ('Mazda', 'CX-7', 2006, 2012, 'Wheel lug nut — Wheel nuts', 88, 118, 65, 87, 'https://tighttorque.com/cars/mazda/cx-7'),
  ('Mazda', 'RX-8', 2003, 2012, 'Wheel lug nut — Wheel nuts', 88, 118, 65, 87, 'https://tighttorque.com/cars/mazda/rx-8'),
  ('Mazda', 'Tribute', 2001, 2006, 'Wheel lug nut — Wheel lug nuts', 133, null, 98, null, 'https://tighttorque.com/cars/mazda/tribute-1'),
  ('Mercedes-Benz', 'Citan', 2012, null, 'Wheel lug nut — Wheel lug nuts Steel', 110, null, 81, null, 'https://tighttorque.com/vans/mercedes-benz/citan-1'),
  ('Mercedes-Benz', 'Sprinter', 2019, null, 'Wheel lug nut — Wheel bolts Steel wheel', 200, null, 148, null, 'https://tighttorque.com/vans/mercedes-benz/sprinter-3'),
  ('Mercedes-Benz', 'Sprinter', 2019, null, 'Wheel lug nut — Wheel nuts', 180, null, 133, null, 'https://tighttorque.com/vans/mercedes-benz/sprinter-3'),
  ('Mercedes-Benz', 'Sprinter', 2006, 2018, 'Wheel lug nut — Wheel bolt Steel rim, with code RH9 super single tires Model 906.11 Model 906.13 Model 906.21 Model 906.23 Model 906.61 Model 906.63 Model 906.71 Model 906.73 Model 906.15 Model 906.25 Model 906.65 (Model 906.11, Model 906.13, Model 906.21, Model 906.23, Model 906.61, Model 906.63, Model 906.71, Model 906.73, Model 906.15, Model 906.25, Model 906.65)', 240, null, 177, null, 'https://tighttorque.com/vans/mercedes-benz/sprinter-2'),
  ('Mercedes-Benz', 'Sprinter', 2006, 2018, 'Wheel lug nut — Wheel nut Without code RH9 super single tires Model 906.15 Model 906.25 Model 906.65 (Model 906.15, Model 906.25, Model 906.65)', 180, null, 133, null, 'https://tighttorque.com/vans/mercedes-benz/sprinter-2'),
  ('Mercedes-Benz', 'Sprinter', 1995, 2006, 'Wheel lug nut — Wheel lug nut 2500 Series', 240, null, 177, null, 'https://tighttorque.com/vans/mercedes-benz/sprinter-1'),
  ('Mercedes-Benz', 'Sprinter', 1995, 2006, 'Wheel lug nut — Wheel lug nut 3500 Series', 190, null, 140, null, 'https://tighttorque.com/vans/mercedes-benz/sprinter-1'),
  ('Mercedes-Benz', 'Vito', 2003, 2014, 'Wheel lug nut — Wheel lug nuts Steel', 180, null, 133, null, 'https://tighttorque.com/vans/mercedes-benz/vito-2'),
  ('Mitsubishi', 'Express', 2020, null, 'Wheel lug nut — Wheel bolts Pre-tighten', 30, null, 22, null, 'https://tighttorque.com/vans/mitsubishi/express-3'),
  ('Mitsubishi', 'Express', 2020, null, 'Wheel lug nut — Wheel lug nuts Steel', 160, null, 118, null, 'https://tighttorque.com/vans/mitsubishi/express-3'),
  ('Mitsubishi', 'Galant', 2004, 2012, 'Wheel lug nut — Wheel nut ±10 Nm', 98, null, 72, null, 'https://tighttorque.com/cars/mitsubishi/galant-9'),
  ('Mitsubishi', 'Galant', 1996, 2006, 'Wheel lug nut — Wheel nut', 98, null, 72, null, 'https://tighttorque.com/cars/mitsubishi/galant-8'),
  ('Mitsubishi', 'Lancer', 2008, 2017, 'Wheel lug nut — Wheel nuts ±10 Nm', 98, null, 72, null, 'https://tighttorque.com/cars/mitsubishi/lancer-9'),
  ('Mitsubishi', 'Lancer', 2000, 2007, 'Wheel lug nut — Wheel Nut', 98, 118, 72, 87, 'https://tighttorque.com/cars/mitsubishi/lancer-8'),
  ('Mitsubishi', 'Outlander', 2007, 2013, 'Wheel lug nut — Wheel nuts ±10 Nm', 98, null, 72, null, 'https://tighttorque.com/cars/mitsubishi/outlander-2');
