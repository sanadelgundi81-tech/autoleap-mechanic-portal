-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 6 of 13
-- 20261126020106_torque_specs_seed_06.sql
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
  ('Suzuki', 'Swift', 2004, 2010, 'Wheel lug nut — Front wheel bolt', 85, null, 63, null, 'https://tighttorque.com/cars/suzuki/swift-1'),
  ('Suzuki', 'Swift', 2004, 2010, 'Wheel lug nut — Rear wheel bolt', 85, null, 63, null, 'https://tighttorque.com/cars/suzuki/swift-1'),
  ('Tesla', 'Model 3', 2017, null, 'Wheel lug nut — Front wheel lug nuts', 175, null, 129, null, 'https://tighttorque.com/cars/tesla/model-3'),
  ('Tesla', 'Model 3', 2017, null, 'Wheel lug nut — Rear wheel lug nuts', 175, null, 129, null, 'https://tighttorque.com/cars/tesla/model-3'),
  ('Toyota', '4Runner', 2003, 2009, 'Wheel lug nut — Front wheel', 112, null, 83, null, 'https://tighttorque.com/cars/toyota/4runner-4'),
  ('Toyota', '4Runner', 2003, 2009, 'Wheel lug nut — Rear wheel', 112, null, 83, null, 'https://tighttorque.com/cars/toyota/4runner-4'),
  ('Toyota', 'Avalon', 2019, 2022, 'Wheel lug nut — Rear lugnut', 149.1, null, 110, null, 'https://tighttorque.com/cars/toyota/avalon-xx50'),
  ('Toyota', 'Avalon', 2013, 2018, 'Wheel lug nut — Rear lugnut 2.5L Engine', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/avalon-xx40'),
  ('Toyota', 'Avalon', 2013, 2018, 'Wheel lug nut — Rear lugnut 3.5L Engine', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/avalon-xx40'),
  ('Toyota', 'Avalon', 2005, 2012, 'Wheel lug nut — Rear lugnut V6 3.5L Gasoline FWD/AWD 5-speed automatic Multi-link coil springs', 149.1, null, 110, null, 'https://tighttorque.com/cars/toyota/avalon-xx30'),
  ('Toyota', 'Avalon', 2005, 2012, 'Wheel lug nut — Front wheel set nut', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/avalon-xx30'),
  ('Toyota', 'Avalon', 2005, 2012, 'Wheel lug nut — Rear wheel set nut', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/avalon-xx30'),
  ('Toyota', 'Avalon', 2000, 2004, 'Wheel lug nut — Rear lugnut V6 3.0L Gasoline FWD/AWD 4-speed automatic', 149.1, null, 110, null, 'https://tighttorque.com/cars/toyota/avalon-xx20'),
  ('Toyota', 'Avalon', 2000, 2004, 'Wheel lug nut — Rear wheel', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/avalon-xx20'),
  ('Toyota', 'Camry', 2018, null, 'Wheel lug nut — Rear lugnut 2.5L I-4 DOHC Gasoline', 149.1, null, 110, null, 'https://tighttorque.com/cars/toyota/camry-xv70'),
  ('Toyota', 'Camry', 2012, 2017, 'Wheel lug nut — Rear lugnut 2.5L I-4 DOHC Gasoline', 149.1, null, 110, null, 'https://tighttorque.com/cars/toyota/camry-xv50'),
  ('Toyota', 'Camry', 2007, 2011, 'Wheel lug nut — Front wheel lug nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/camry-xv40'),
  ('Toyota', 'Camry', 2007, 2011, 'Wheel lug nut — Rear wheel lug nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/camry-xv40'),
  ('Toyota', 'Camry', 2002, 2006, 'Wheel lug nut — Wheel Lug nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/camry-xv30'),
  ('Toyota', 'Camry', 1996, 2002, 'Wheel lug nut — Front wheel S51 Manual Transaxle', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/camry-xv20'),
  ('Toyota', 'Camry', 1996, 2002, 'Wheel lug nut — Rear lug nuts', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/camry-xv20'),
  ('Toyota', 'Camry', 1992, 1996, 'Wheel lug nut — Front wheel A541E Automatic Transaxle', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/camry-xv10'),
  ('Toyota', 'Corolla', 2019, null, 'Wheel lug nut — Rear lugnuts 1.8L Engine', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e210'),
  ('Toyota', 'Corolla', 2007, 2013, 'Wheel lug nut — Front wheel set nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e140'),
  ('Toyota', 'Corolla', 2007, 2013, 'Wheel lug nut — Rear wheel set nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e140'),
  ('Toyota', 'Corolla', 2002, 2008, 'Wheel lug nut — Rear lugnuts 1.8L Engine', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/corolla-e120'),
  ('Toyota', 'Corolla', 1995, 2004, 'Wheel lug nut — Wheel nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e110'),
  ('Toyota', 'Corolla', 1995, 2004, 'Wheel lug nut — Rear lug nut 1.8L Engine', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/corolla-e110'),
  ('Toyota', 'Corolla', 1991, 1999, 'Wheel lug nut — Wheel nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e100'),
  ('Toyota', 'Corolla', 1991, 1999, 'Wheel lug nut — Front wheel nuts 1.6L Engine', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e100'),
  ('Toyota', 'Corolla', 1991, 1999, 'Wheel lug nut — Rear lug nuts 1.6L Engine 2WD', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/corolla-e100'),
  ('Toyota', 'HiAce', 2004, 2019, 'Wheel lug nut — Wheel lug nuts', 100, null, 74, null, 'https://tighttorque.com/vans/toyota/hiace-5'),
  ('Toyota', 'Highlander', 2013, 2018, 'Wheel lug nut — Rear lugnut 2.7L Engine', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/highlander-xu50'),
  ('Toyota', 'Highlander', 2013, 2018, 'Wheel lug nut — Rear lugnut 3.5L Engine', 149, null, 110, null, 'https://tighttorque.com/cars/toyota/highlander-xu50'),
  ('Toyota', 'Highlander', 2007, 2012, 'Wheel lug nut — Front wheel set nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/highlander-xu40'),
  ('Toyota', 'Highlander', 2007, 2012, 'Wheel lug nut — Rear wheel set nuts', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/highlander-xu40'),
  ('Toyota', 'Highlander', 2000, 2007, 'Wheel lug nut — Wheel nut', 103, null, 76, null, 'https://tighttorque.com/cars/toyota/highlander-xu20'),
  ('Toyota', 'Hilux', 2004, 2015, 'Wheel lug nut — Front wheel Steel type 2WD', 152, null, 112, null, 'https://tighttorque.com/cars/toyota/hilux-7'),
  ('Toyota', 'Hilux', 2004, 2015, 'Wheel lug nut — Front wheel 4WD', 105, null, 77, null, 'https://tighttorque.com/cars/toyota/hilux-7'),
  ('Toyota', 'Hilux', 2004, 2015, 'Wheel lug nut — Rear wheel Steel type 2WD', 152, null, 112, null, 'https://tighttorque.com/cars/toyota/hilux-7'),
  ('Toyota', 'Hilux', 2004, 2015, 'Wheel lug nut — Rear wheel 4WD', 105, null, 77, null, 'https://tighttorque.com/cars/toyota/hilux-7'),
  ('Toyota', 'Land Cruiser', 2008, 2021, 'Wheel lug nut — Rear lug nut 4.0L Engine', 149, null, 110, null, 'https://tighttorque.com/trucks/toyota/land-cruiser-j200'),
  ('Toyota', 'Land Cruiser', 2008, 2021, 'Wheel lug nut — Rear lug nut 4.6L Engine', 149, null, 110, null, 'https://tighttorque.com/trucks/toyota/land-cruiser-j200'),
  ('Toyota', 'Land Cruiser', 2008, 2021, 'Wheel lug nut — Rear lug nut 4.7L Engine', 149, null, 110, null, 'https://tighttorque.com/trucks/toyota/land-cruiser-j200'),
  ('Toyota', 'Land Cruiser', 2008, 2021, 'Wheel lug nut — Rear lug nut 5.7L Engine', 149, null, 110, null, 'https://tighttorque.com/trucks/toyota/land-cruiser-j200'),
  ('Toyota', 'Land Cruiser', 1998, 2007, 'Wheel lug nut — Front wheel', 131, null, 97, null, 'https://tighttorque.com/trucks/toyota/land-cruiser-j100');
