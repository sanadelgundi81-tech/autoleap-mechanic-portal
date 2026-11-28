-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 15
-- 20261127020102_torque_specs_seed_15.sql
--
-- Source: powertoolsinsider.com — Lug Nut Torque Chart by Vehicle (https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/)
-- Rows: 14 wheel lug-nut rows, copied by script exactly as the page
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
  ('Ford', 'Explorer', 2020, null, 'Wheel lug nut — M14 x 1.5', null, null, 100, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Chevrolet', 'Equinox', 2018, null, 'Wheel lug nut — M14 x 1.5', null, null, 100, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Chevrolet', 'Silverado 3500', 2020, null, 'Wheel lug nut — M14 x 1.5', null, null, 165, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Honda', 'CR-V', 2017, null, 'Wheel lug nut — M12 x 1.5', 108, null, 80, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Honda', 'Odyssey', 2018, null, 'Wheel lug nut — M12 x 1.5', null, null, 80, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Hyundai', 'Santa Fe', 2019, null, 'Wheel lug nut — M12 x 1.5', null, null, 80, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Nissan', 'Rogue', 2021, null, 'Wheel lug nut — M12 x 1.25', null, null, 80, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Subaru', 'Forester', 2019, null, 'Wheel lug nut — M12 x 1.25', null, null, 89, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Toyota', '4Runner', 2010, null, 'Wheel lug nut — M12 x 1.5', null, null, 83, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Toyota', 'Highlander', 2020, null, 'Wheel lug nut — M12 x 1.5', null, null, 76, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Toyota', 'RAV4', 2019, null, 'Wheel lug nut — M12 x 1.5', null, null, 76, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Toyota', 'Sequoia', 2023, null, 'Wheel lug nut — M14 x 1.5', null, null, 97, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Toyota', 'Tacoma', 2016, null, 'Wheel lug nut — M12 x 1.5', null, null, 85, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/'),
  ('Toyota', 'Tundra', 2022, null, 'Wheel lug nut — M14 x 1.5', null, null, 97, null, 'https://www.powertoolsinsider.com/lug-nut-torque-chart-by-vehicle/');
