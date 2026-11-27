-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 5 of 13
-- 20261126020105_torque_specs_seed_05.sql
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
  ('Mitsubishi', 'Outlander', 2003, 2006, 'Wheel lug nut — Wheel nuts ±10 Nm', 98, null, 72, null, 'https://tighttorque.com/cars/mitsubishi/outlander-1'),
  ('Mitsubishi', 'Triton', 2015, 2022, 'Wheel lug nut — Steel Wheels Lug Nuts ± 10 N·m 2WD & 4WD All Variant', 147, null, 108, null, 'https://tighttorque.com/trucks/mitsubishi/triton-5th-gen'),
  ('Mitsubishi', 'Triton', 2015, 2022, 'Wheel lug nut — Aluminum Wheels Lug Nuts ± 9 N·m 2WD & 4WD All Variant', 128, null, 94, null, 'https://tighttorque.com/trucks/mitsubishi/triton-5th-gen'),
  ('Mitsubishi', 'Triton', 2005, 2015, 'Wheel lug nut — Wheel nuts Steel wheel', 147, null, 108, null, 'https://tighttorque.com/trucks/mitsubishi/triton-4'),
  ('Nissan', '350Z', 2002, 2008, 'Wheel lug nut — Wheel nut', 98, 127, 72, 94, 'https://tighttorque.com/cars/nissan/z-series-5'),
  ('Nissan', 'Altima', 2019, null, 'Wheel lug nut — Wheel nut', 113, null, 83, null, 'https://tighttorque.com/cars/nissan/altima-6'),
  ('Nissan', 'Altima', 2013, 2019, 'Wheel lug nut — Wheel nut', 113, null, 83, null, 'https://tighttorque.com/cars/nissan/altima-5'),
  ('Nissan', 'Altima', 2007, 2013, 'Wheel lug nut — Wheel nut', 112, null, 83, null, 'https://tighttorque.com/cars/nissan/altima-4'),
  ('Nissan', 'Altima', 2002, 2007, 'Wheel lug nut — Wheel nut', 98, 117, 72, 86, 'https://tighttorque.com/cars/nissan/altima-3'),
  ('Nissan', 'Frontier', 2014, null, 'Wheel lug nut — Wheel nut', 133, null, 98, null, 'https://tighttorque.com/trucks/nissan/frontier-3'),
  ('Nissan', 'Navara', 2004, 2021, 'Wheel lug nut — Wheel nut', 133, null, 98, null, 'https://tighttorque.com/trucks/nissan/navara-2'),
  ('Nissan', 'Navara', 1997, 2004, 'Wheel lug nut — Wheel nuts', 118, 147, 87, 108, 'https://tighttorque.com/trucks/nissan/navara-1'),
  ('Nissan', 'NV200', 2010, null, 'Wheel lug nut — Wheel nut', 113, null, 83, null, 'https://tighttorque.com/vans/nissan/nv200-1'),
  ('Nissan', 'NV250', 2019, null, 'Wheel lug nut — Wheel lug nuts Steel', 110, null, 81, null, 'https://tighttorque.com/vans/nissan/nv250'),
  ('Nissan', 'NV300', 2014, 2018, 'Wheel lug nut — Wheel bolts Pre-tighten', 30, null, 22, null, 'https://tighttorque.com/vans/nissan/nv300-3'),
  ('Nissan', 'NV300', 2014, 2018, 'Wheel lug nut — Wheel lug nuts Steel', 160, null, 118, null, 'https://tighttorque.com/vans/nissan/nv300-3'),
  ('Nissan', 'Rogue', 2014, 2020, 'Wheel lug nut — Wheel nut', 113, null, 83, null, 'https://tighttorque.com/cars/nissan/rogue-2'),
  ('Nissan', 'Sentra', 2012, 2019, 'Wheel lug nut — Wheel nut', 113, null, 83, null, 'https://tighttorque.com/cars/nissan/sentra-7'),
  ('Nissan', 'Sentra', 2006, 2012, 'Wheel lug nut — Wheel nut', 108, null, 80, null, 'https://tighttorque.com/cars/nissan/sentra-6'),
  ('Nissan', 'Sentra', 1990, 1994, 'Wheel lug nut — Wheel lug nuts', 98, 118, 72, 87, 'https://tighttorque.com/cars/nissan/sentra-3'),
  ('Nissan', 'Titan', 2016, null, 'Wheel lug nut — Wheel nut', 177, null, 131, null, 'https://tighttorque.com/trucks/nissan/titan-2'),
  ('Nissan', 'Titan', 2003, 2015, 'Wheel lug nut — Wheel nut', 133, null, 98, null, 'https://tighttorque.com/trucks/nissan/titan-1'),
  ('Nissan', 'Versa', 2006, 2013, 'Wheel lug nut — Wheel nut', 113, null, 83, null, 'https://tighttorque.com/cars/nissan/versa-1'),
  ('Nissan', 'Xterra', 2005, null, 'Wheel lug nut — Wheel nut', 133, null, 98, null, 'https://tighttorque.com/cars/nissan/xterra-2'),
  ('Peugeot', 'Boxer', 2006, null, 'Wheel lug nut — Road wheels Steel rims, 15 inch wheels', 160, null, 118, null, 'https://tighttorque.com/vans/peugeot/boxer-3'),
  ('Peugeot', 'Expert', 2007, null, 'Wheel lug nut — Road wheels Steel rims', 100, null, 74, null, 'https://tighttorque.com/vans/peugeot/expert-2'),
  ('Peugeot', 'Partner', 2008, 2018, 'Wheel lug nut — Wheel bolts Diesel engine', 100, null, 74, null, 'https://tighttorque.com/vans/peugeot/partner-2'),
  ('Peugeot', 'Partner Tepee', 2008, 2018, 'Wheel lug nut — Wheel bolts Diesel engine', 100, null, 74, null, 'https://tighttorque.com/vans/peugeot/partner-2-tepee'),
  ('Ram', 'ProMaster', 2013, null, 'Wheel lug nut — Road wheels Steel rims, 15 inch wheels', 160, null, 118, null, 'https://tighttorque.com/vans/ram/promaster'),
  ('Renault', 'Clio', 2019, null, 'Wheel lug nut — Wheel bolts BF (Hatchback)', 90, null, 66, null, 'https://tighttorque.com/cars/renault/clio-5'),
  ('Renault', 'Clio', 2012, 2020, 'Wheel lug nut — Wheel bolts BH (Hatchback)', 90, null, 66, null, 'https://tighttorque.com/cars/renault/clio-4'),
  ('Renault', 'Clio', 2012, 2020, 'Wheel lug nut — Wheel bolts KH (Grandtour)', 110, null, 81, null, 'https://tighttorque.com/cars/renault/clio-4'),
  ('Renault', 'Clio', 2005, 2014, 'Wheel lug nut — Wheel bolts Use wheel impact socket #17. Use a torque wrench.', 105, null, 77, null, 'https://tighttorque.com/cars/renault/clio-3'),
  ('Renault', 'Clio', 1998, 2005, 'Wheel lug nut — Front wheel bolts (Hatchback)', 90, null, 66, null, 'https://tighttorque.com/cars/renault/clio-2'),
  ('Renault', 'Clio', 1998, 2005, 'Wheel lug nut — Rear wheel bolts (Hatchback)', 90, null, 66, null, 'https://tighttorque.com/cars/renault/clio-2'),
  ('Renault', 'Clio', 1990, 1998, 'Wheel lug nut — Wheel lug nuts Steel wheels - cross order - impact socket #19', 110, null, 81, null, 'https://tighttorque.com/cars/renault/clio-1'),
  ('Renault', 'Kangoo', 2007, null, 'Wheel lug nut — Wheel lug nuts Steel wheel', 110, null, 81, null, 'https://tighttorque.com/vans/renault/kangoo-2'),
  ('SEAT', 'Ibiza', 2017, null, 'Wheel lug nut — Wheel bolts KJ1', 120, null, 89, null, 'https://tighttorque.com/cars/seat/ibiza-5'),
  ('SEAT', 'Ibiza', 2002, 2008, 'Wheel lug nut — Wheel bolts Use wheel impact socket #17. Use a torque wrench. Hatchback', 120, null, 89, null, 'https://tighttorque.com/cars/seat/ibiza-3'),
  ('SEAT', 'Ibiza', 1993, 2002, 'Wheel lug nut — Wheel bolts', 140, null, 103, null, 'https://tighttorque.com/cars/seat/ibiza-2'),
  ('Skoda', 'Octavia', 2012, 2019, 'Wheel lug nut — Wheel bolt', 120, null, 89, null, 'https://tighttorque.com/cars/skoda/octavia-3'),
  ('Skoda', 'Octavia', 2004, 2013, 'Wheel lug nut — Wheel bolts Use wheel impact socket #17. Use a torque wrench.', 120, null, 89, null, 'https://tighttorque.com/cars/skoda/octavia-2'),
  ('Skoda', 'Octavia', 1996, 2010, 'Wheel lug nut — Front wheel bolt', 120, null, 89, null, 'https://tighttorque.com/cars/skoda/octavia-1'),
  ('Skoda', 'Octavia', 1996, 2010, 'Wheel lug nut — Rear wheel bolt', 120, null, 89, null, 'https://tighttorque.com/cars/skoda/octavia-1'),
  ('Ssangyong', 'Musso', 2018, null, 'Wheel lug nut — Wheel bolt Steel', 80, 120, 59, 89, 'https://tighttorque.com/trucks/ssangyong/musso'),
  ('Ssangyong', 'Musso Sports', 2002, 2005, 'Wheel lug nut — Wheel bolt Steel', 80, 120, 59, 89, 'https://tighttorque.com/trucks/ssangyong/musso-sports-p100'),
  ('Subaru', 'Forester', 1998, 2002, 'Wheel lug nut — Wheel nut', 88, null, 65, null, 'https://tighttorque.com/cars/subaru/forester-1');
