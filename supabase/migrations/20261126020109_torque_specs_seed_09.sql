-- ============================================================
-- AutoLeap mechanic portal — prompt 14: torque specs seed, part 9 of 13
-- 20261126020109_torque_specs_seed_09.sql
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
  ('Ford', 'F-150', 2021, null, 'Brake caliper bolts — Front caliper bleeder screw', 10, null, 7.4, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2021, null, 'Brake caliper bolts — Rear caliper bleeder screw', 10, null, 7.4, null, 'https://tighttorque.com/trucks/ford/f150-14'),
  ('Ford', 'F-150', 2015, 2020, 'Brake caliper bolts — Front caliper bleeder screw', 10, null, 7.4, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Brake caliper bolts — Rear caliper bleeder screw', 10, null, 7.4, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Brake caliper bolts — Front brake caliper bolts', 36, null, 27, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Brake caliper bolts — Rear brake caliper bolts Vehicles with EPB', 36, null, 27, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Brake caliper bolts — Front brake caliper anchor plate bolts', 250, null, 184, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2015, 2020, 'Brake caliper bolts — Rear brake caliper anchor plate bolts Vehicles with EPB', 245, null, 181, null, 'https://tighttorque.com/trucks/ford/f150-13'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Front brake caliper anchor plate bolts', 250, null, 184, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Rear brake caliper support bracket bolts', 150, null, 111, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Front brake caliper flow bolt', 35, null, 26, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Rear brake caliper flow bolt', 35, null, 26, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Front brake caliper guide pin bolts', 37, null, 27, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Rear brake caliper guide pin bolts', 33, null, 24, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2009, 2014, 'Brake caliper bolts — Brake caliper bleed screw', 10, null, 7.4, null, 'https://tighttorque.com/trucks/ford/f150-12'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Front brake caliper bolt', 64, null, 47, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Rear caliper bolts', 32, null, 24, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Rear disc brake caliper bolts 8.8 Inch Axle', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Rear disc brake caliper bolts 9.75 Inch Axle', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Front brake caliper flow bolt', 35, null, 26, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Front caliper bleed screw', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Rear caliper bleed screw', 20, null, 15, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 2004, 2008, 'Brake caliper bolts — Front disc brake caliper anchor bolts', 200, null, 148, null, 'https://tighttorque.com/trucks/ford/f150-11'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Front disc caliper bolt', 28, 36, 21, 27, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Rear disc caliper bolt', 27, null, 20, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Front disc brake caliper to Anchor plate bolts', 32, null, 24, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Front disc caliper anchor plate bolt', 185, null, 136, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Front caliper bleeder screw', 15, null, 11, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Front disc brake caliper bleeder screw 4-Wheel', 17, 24, 13, 18, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1997, 2004, 'Brake caliper bolts — Rear caliper bleeder screw', 20, null, 15, null, 'https://tighttorque.com/trucks/ford/f150-10'),
  ('Ford', 'F-150', 1992, 1997, 'Brake caliper bolts — Caliper bleeder screws', 17, 24, 13, 18, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('Ford', 'F-150', 1992, 1997, 'Brake caliper bolts — Caliper hose flow bolt', 30, 39, 22, 29, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('Ford', 'F-150', 1992, 1997, 'Brake caliper bolts — Front caliper mounting bolts', 30, 36, 22, 27, 'https://tighttorque.com/trucks/ford/f150-9'),
  ('Audi', 'Q5', 2018, 2024, 'Wheel lug nut (M14x1.5 (bolts))', 136, null, 100, null, 'https://www.checkfitment.com/fitment/audi/q5/'),
  ('Chevrolet', 'Corvette', 2020, 2024, 'Wheel lug nut (M14x1.5)', 190, null, 140, null, 'https://www.checkfitment.com/fitment/chevrolet/corvette/'),
  ('Chevrolet', 'Corvette', 1997, 2004, 'Wheel lug nut (M12x1.5)', 136, null, 100, null, 'https://www.checkfitment.com/fitment/chevrolet/corvette/'),
  ('Ford', 'F-250', 2023, 2026, 'Wheel lug nut (M14x1.5)', 203, null, 150, null, 'https://www.checkfitment.com/fitment/ford/f-250/'),
  ('Ford', 'F-250', 2020, 2022, 'Wheel lug nut (M14x1.5)', 203, null, 150, null, 'https://www.checkfitment.com/fitment/ford/f-250/'),
  ('Ford', 'F-250', 2017, 2019, 'Wheel lug nut (M14x1.5)', 224, null, 165, null, 'https://www.checkfitment.com/fitment/ford/f-250/'),
  ('Ford', 'Mustang', 2015, 2024, 'Wheel lug nut (M14x1.5)', 203, null, 150, null, 'https://www.checkfitment.com/fitment/ford/mustang/'),
  ('Ford', 'Mustang', 2005, 2014, 'Wheel lug nut (1/2-20)', 136, null, 100, null, 'https://www.checkfitment.com/fitment/ford/mustang/'),
  ('Ford', 'Mustang', 2004, 2004, 'Wheel lug nut (1/2-20)', 133, null, 98, null, 'https://www.checkfitment.com/fitment/ford/mustang/'),
  ('Jeep', 'Wrangler', 2018, 2022, 'Wheel lug nut (M14x1.5)', 176, null, 130, null, 'https://www.checkfitment.com/fitment/jeep/wrangler/'),
  ('Jeep', 'Wrangler', 2014, 2017, 'Wheel lug nut (1/2-20)', 136, null, 100, null, 'https://www.checkfitment.com/fitment/jeep/wrangler/'),
  ('Jeep', 'Wrangler', 2007, 2013, 'Wheel lug nut (1/2-20)', 129, null, 95, null, 'https://www.checkfitment.com/fitment/jeep/wrangler/'),
  ('Ram', '1500', 2019, 2025, 'Wheel lug nut (M14x1.5)', 176, null, 130, null, 'https://www.checkfitment.com/fitment/ram/1500/'),
  ('Ram', '2500', 2019, 2025, 'Wheel lug nut (M14x1.5)', 176, null, 130, null, 'https://www.checkfitment.com/fitment/ram/2500/');
