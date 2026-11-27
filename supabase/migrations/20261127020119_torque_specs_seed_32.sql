-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 32
-- 20261127020119_torque_specs_seed_32.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: mitsubishi-lug-nut-torque-specs, nissan-lug-nut-torque-specs, oldsmobile-lug-nut-torque-specs, pontiac-lug-nut-torque-specs
-- Rows: 45 wheel lug-nut rows, copied by script exactly as the page
-- states them; each row's source column is the page it came from. A unit
-- the source does not state is null (never converted or guessed).
-- Rows that overlap an existing (prompt 14) row for the same vehicle were
-- NOT added (existing rows are never changed). Reference only — always
-- verify against the vehicle's service manual.
--
-- Additive only: inserts rows, no DELETE/DROP. No secrets.
-- ============================================================

insert into public.torque_specs
  (make, model, year_from, year_to, job, torque_nm, torque_nm_max, torque_ftlb, torque_ftlb_max, source)
values
  ('Mitsubishi', 'I-MIEV', 2014, 2014, 'Wheel lug nut', null, null, 66, 80, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'I-MIEV', 2017, 2017, 'Wheel lug nut', null, null, 66, 80, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Mirage', 2001, 2002, 'Wheel lug nut', null, null, 65, 80, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Mirage', 2014, 2015, 'Wheel lug nut', null, null, 65, 79, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Mirage/Mirage G4', 2017, 2017, 'Wheel lug nut', null, null, 65, 79, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Montero', 2001, 2006, 'Wheel lug nut', null, null, 72, 87, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Montero Sport', 2001, 2004, 'Wheel lug nut', null, null, 72, 87, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Mitsubishi', 'Raider', 2006, 2009, 'Wheel lug nut', null, null, 125, 145, 'https://ricksfreeautorepairadvice.com/mitsubishi-lug-nut-torque-specs/'),
  ('Nissan', 'Altima', 2001, 2001, 'Wheel lug nut', null, null, 73, 86, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Armada', 2005, 2015, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Armada', 2017, 2017, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Cube', 2009, 2014, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Frontier', 2001, 2004, 'Wheel lug nut', null, null, 87, 108, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'GT-R Non NISMO', 2009, 2017, 'Wheel lug nut', null, null, 97, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Juke', 2011, 2017, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'NV1500/2500/3500', 2012, 2017, 'Wheel lug nut', null, null, 138, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Pathfinder Armada', 2004, 2004, 'Wheel lug nut', null, null, 98, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Quest', 2001, 2002, 'Wheel lug nut', null, null, 72, 87, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Quest', 2004, 2009, 'Wheel lug nut', null, null, 83, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Quest', 2011, 2017, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Rogue', 2008, 2013, 'Wheel lug nut', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Rogue Select', 2014, 2015, 'Wheel lug nut', null, null, 83, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Sentra', 2001, 2001, 'Wheel lug nut', null, null, 73, 86, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'TITAN XD', 2016, 2017, 'Wheel lug nut', null, null, 131, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'X-trail', 2005, 2006, 'Wheel lug nut', null, null, 83, null, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Nissan', 'Xterra', 2001, 2004, 'Wheel lug nut', null, null, 87, 108, 'https://ricksfreeautorepairadvice.com/nissan-lug-nut-torque-specs/'),
  ('Oldsmobile', 'Alero', 2003, 2004, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/oldsmobile-lug-nut-torque-specs/'),
  ('Oldsmobile', 'Aurora', 2003, 2003, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/oldsmobile-lug-nut-torque-specs/'),
  ('Oldsmobile', 'Bravada', 2003, 2004, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/oldsmobile-lug-nut-torque-specs/'),
  ('Oldsmobile', 'Silhouette Van', 2003, 2004, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/oldsmobile-lug-nut-torque-specs/'),
  ('Pontiac', 'Aztek', 2003, 2005, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Bonneville', 2003, 2005, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'G3', 2009, 2010, 'Wheel lug nut', null, null, 88, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'G5', 2007, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'G6', 2005, 2010, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'G8', 2008, 2009, 'Wheel lug nut', null, null, 125, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'GTO', 2004, 2006, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Grand Am', 2003, 2005, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Grand Prix', 2003, 2008, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Montana', 2003, 2005, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Montana SV6', 2005, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Pursuit', 2005, 2006, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Solstice', 2006, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Sunfire', 2003, 2005, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/'),
  ('Pontiac', 'Torrent', 2006, 2009, 'Wheel lug nut', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/pontiac-lug-nut-torque-specs/');
