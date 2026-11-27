-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 7 of 13
-- 20261126020107_torque_specs_seed_07.sql
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
  ('Toyota', 'Land Cruiser', 1998, 2007, 'Wheel lug nut — Rear wheels', 131, null, 97, null, 'https://tighttorque.com/trucks/toyota/land-cruiser-j100'),
  ('Toyota', 'Mirai', 2016, 2020, 'Wheel lug nut — Wheel lug nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/mirai-jpd10'),
  ('Toyota', 'Prius', 2004, 2009, 'Wheel lug nut — Front wheel set nut', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/prius-2'),
  ('Toyota', 'Prius', 2004, 2009, 'Wheel lug nut — Rear wheel set nut', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/prius-2'),
  ('Toyota', 'Prius', 2000, 2003, 'Wheel lug nut — Wheel attachment', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/prius-1-nhw11'),
  ('Toyota', 'ProAce', 2013, 2016, 'Wheel lug nut — Road wheels Steel rims', 100, null, 74, null, 'https://tighttorque.com/vans/toyota/proace-2'),
  ('Toyota', 'RAV4', 2012, 2018, 'Wheel lug nut — Wheel bolts Use a criss-cross pattern. Use a torque wrench. (Off-road)', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/rav4-xa40'),
  ('Toyota', 'RAV4', 2005, 2012, 'Wheel lug nut — Front wheel', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/rav4-xa30'),
  ('Toyota', 'RAV4', 2005, 2012, 'Wheel lug nut — Rear wheel', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/rav4-xa30'),
  ('Toyota', 'RAV4', 2001, 2005, 'Wheel lug nut — Wheel lug nut', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/rav4-2'),
  ('Toyota', 'Sienna', 2010, 2020, 'Wheel lug nut — Wheel nut', 103, null, 76, null, 'https://tighttorque.com/vans/toyota/sienna-3'),
  ('Toyota', 'Sienna', 1997, 2003, 'Wheel lug nut — Wheel lug nuts', 108, null, 80, null, 'https://tighttorque.com/vans/toyota/sienna-1'),
  ('Toyota', 'Tacoma', 2005, 2015, 'Wheel lug nut — Front wheel 2WD', 113, null, 83, null, 'https://tighttorque.com/trucks/toyota/tacoma-2'),
  ('Toyota', 'Tacoma', 2005, 2015, 'Wheel lug nut — Front wheel 4WD Pre-Runner (4WD, Pre-Runner)', 113, null, 83, null, 'https://tighttorque.com/trucks/toyota/tacoma-2'),
  ('Toyota', 'Tacoma', 2005, 2015, 'Wheel lug nut — Rear wheel 2WD', 113, null, 83, null, 'https://tighttorque.com/trucks/toyota/tacoma-2'),
  ('Toyota', 'Tacoma', 2005, 2015, 'Wheel lug nut — Rear wheel 4WD Pre-Runner (4WD, Pre-Runner)', 113, null, 83, null, 'https://tighttorque.com/trucks/toyota/tacoma-2'),
  ('Toyota', 'Tacoma', 1994, 2005, 'Wheel lug nut — Front wheel 2WD 4WD (2WD, 4WD)', 110, null, 81, null, 'https://tighttorque.com/trucks/toyota/tacoma-1'),
  ('Toyota', 'Tacoma', 1994, 2005, 'Wheel lug nut — Rear wheel', 110, null, 81, null, 'https://tighttorque.com/trucks/toyota/tacoma-1'),
  ('Toyota', 'Tundra', 2007, 2021, 'Wheel lug nut — Front wheel Aluminium wheel', 131, null, 97, null, 'https://tighttorque.com/trucks/toyota/tundra-2'),
  ('Toyota', 'Tundra', 2007, 2021, 'Wheel lug nut — Rear wheel Aluminium wheel', 131, null, 97, null, 'https://tighttorque.com/trucks/toyota/tundra-2'),
  ('Toyota', 'Tundra', 2000, 2006, 'Wheel lug nut — Front wheel', 113, null, 83, null, 'https://tighttorque.com/trucks/toyota/tundra-1'),
  ('Toyota', 'Tundra', 2000, 2006, 'Wheel lug nut — Rear wheel', 113, null, 83, null, 'https://tighttorque.com/trucks/toyota/tundra-1'),
  ('Toyota', 'Yaris', 2013, null, 'Wheel lug nut — Wheel lug nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/yaris-xp150'),
  ('Toyota', 'Yaris', 2005, 2012, 'Wheel lug nut — Front wheel', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/yaris-xp90'),
  ('Toyota', 'Yaris', 2005, 2012, 'Wheel lug nut — Rear wheel', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/yaris-xp90'),
  ('Volkswagen', 'Amarok', 2010, null, 'Wheel lug nut — Wheel bolt to Wheel hub', 180, null, 133, null, 'https://tighttorque.com/trucks/volkswagen/amarok-1'),
  ('Volkswagen', 'Crafter', 2017, null, 'Wheel lug nut — Wheel bolt to wheel hub Single wheel', 200, null, 148, null, 'https://tighttorque.com/vans/volkswagen/crafter-2'),
  ('Volkswagen', 'Crafter', 2017, null, 'Wheel lug nut — Wheel nut to wheel hub Twin wheels', 180, null, 133, null, 'https://tighttorque.com/vans/volkswagen/crafter-2'),
  ('Volkswagen', 'Crafter', 2006, 2017, 'Wheel lug nut — Wheel bolt to Wheel hub Steel wheels', 240, null, 177, null, 'https://tighttorque.com/vans/volkswagen/crafter-1'),
  ('Volkswagen', 'Crafter', 2006, 2017, 'Wheel lug nut — Wheel nuts to Wheel bolts/studs', 180, null, 133, null, 'https://tighttorque.com/vans/volkswagen/crafter-1'),
  ('Volkswagen', 'Golf', 2012, 2017, 'Wheel lug nut — Wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/volkswagen/golf-mk7'),
  ('Volkswagen', 'Golf', 2012, 2017, 'Wheel lug nut — Rear wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/volkswagen/golf-mk7'),
  ('Volkswagen', 'Golf', 2008, 2012, 'Wheel lug nut — Wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/volkswagen/golf-mk6'),
  ('Volkswagen', 'Golf', 2004, 2008, 'Wheel lug nut — Wheel bolts', 120, null, 89, null, 'https://tighttorque.com/cars/volkswagen/golf-mk5'),
  ('Volkswagen', 'Golf', 1997, 2003, 'Wheel lug nut — Wheel lug bolts M12x1.5 FWD', 110, null, 81, null, 'https://tighttorque.com/cars/volkswagen/golf-mk4'),
  ('Volkswagen', 'Golf', 1991, 1997, 'Wheel lug nut — Roadwheel bolts Petrol Engines', 110, null, 81, null, 'https://tighttorque.com/cars/volkswagen/golf-mk3'),
  ('Volkswagen', 'Golf', 1991, 1997, 'Wheel lug nut — Roadwheel bolts Diesel Engines', 110, null, 81, null, 'https://tighttorque.com/cars/volkswagen/golf-mk3'),
  ('Volkswagen', 'Saveiro', 2009, null, 'Wheel lug nut — Wheel bolts', 110, null, 81, null, 'https://tighttorque.com/trucks/volkswagen/saveiro-2009'),
  ('Volkswagen', 'Transporter', 2015, null, 'Wheel lug nut — Wheel bolt to Wheel hub', 180, null, 133, null, 'https://tighttorque.com/vans/volkswagen/transporter-t6'),
  ('Volkswagen', 'Transporter', 2003, 2015, 'Wheel lug nut — Wheel bolts', 180, null, 133, null, 'https://tighttorque.com/vans/volkswagen/transporter-t5'),
  ('Volkswagen', 'Transporter', 1990, 2003, 'Wheel lug nut — Wheel lug nuts', 120, null, 89, null, 'https://tighttorque.com/vans/volkswagen/transporter-t4'),
  ('BMW', '3 Series', 2011, 2017, 'Oil drain plug — Drainage plug F30 (Saloon)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Oil drain plug — Drainage plug F80 (Saloon)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Oil drain plug — Drainage plug F31 (Touring)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '3 Series', 2011, 2017, 'Oil drain plug — Drainage plug F34 (GT)', 30, null, 22, null, 'https://tighttorque.com/cars/bmw/3-series-6'),
  ('BMW', '5 Series', 2017, null, 'Oil drain plug — Oil drain plug M12x16 G30', 25, null, 18, null, 'https://tighttorque.com/cars/bmw/5-series-7'),
  ('Ford', 'F-150', 2015, 2020, 'Oil drain plug — Oil pan drain plug 3.5L Duratec Engine', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-13');
