-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 24
-- 20261127020111_torque_specs_seed_24.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: chevrolet-lug-nut-torque-specifications
-- Rows: 36 wheel lug-nut rows, copied by script exactly as the page
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
  ('Chevrolet', 'G10', 1988, 1995, 'Wheel lug nut — G10 VAN / 215/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'G20', 1988, 1995, 'Wheel lug nut — G20 – 8-LUG ALL 8LUG / 225/75R16', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'G20', 1988, 1995, 'Wheel lug nut — G20 ALL-5LUG / 225/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'G30', 1988, 1995, 'Wheel lug nut — G30 ALL 8LUG / 225/75R16', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'HHR', 2006, 2011, 'Wheel lug nut — HHR 16″BASE / LS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Impala', 1961, 1985, 'Wheel lug nut — IMPALA SEDAN / 205/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Impala', 2014, 2014, 'Wheel lug nut — IMPALA 19″BASE / LT', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Impala', 2014, 2014, 'Wheel lug nut — IMPALA – LIMITED LS 16″BASE / LIMITED LS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Impala', 2015, 2018, 'Wheel lug nut — IMPALA 18″BASE / LS', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K-Blazer', 1969, 1972, 'Wheel lug nut — K-BLAZER 4WD / 235/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K-Blazer', 1971, 1972, 'Wheel lug nut — K-BLAZER 2WD / 235/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K-Blazer', 1973, 1991, 'Wheel lug nut — K-BLAZER 4WD / 235/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K-Blazer', 1973, 1991, 'Wheel lug nut — K-BLAZER 2WD / 235/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K-Blazer', 1992, 1994, 'Wheel lug nut — K-BLAZER 4WD / 245/75R16', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K10', 1967, 1987, 'Wheel lug nut — K10 4WD / 235/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K1500', 1988, 1995, 'Wheel lug nut — K1500 4WD / 245/75R16', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K1500', 1996, 1999, 'Wheel lug nut — K1500 4WD / 245/75R16', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K2500', 1988, 1999, 'Wheel lug nut — K2500 ALL/6LUG / 225/75R16', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'K3500', 1988, 2002, 'Wheel lug nut — K3500 ALL CABS / DUALLY', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Lumina', 1990, 2001, 'Wheel lug nut — LUMINA 15-INCH / CPE/SDN', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Malibu', 1997, 2012, 'Wheel lug nut — MALIBU 17″BASE / LS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Malibu', 2013, 2015, 'Wheel lug nut — MALIBU 16″BASE / LS', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Malibu', 2016, 2016, 'Wheel lug nut — MALIBU – LIMITED LT 17″ BASE / LIMITED LT', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Malibu', 2016, 2016, 'Wheel lug nut — MALIBU – LT 17″ BASE / LT', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Malibu', 2018, 2018, 'Wheel lug nut — MALIBU 16″ BASE / L', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Metro', 1998, 2001, 'Wheel lug nut — METRO CPE/SDN / BASE/LSI', null, null, 50, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Monte Carlo', 1970, 1972, 'Wheel lug nut — MONTECARLO BASE / COUPE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Monte Carlo', 1985, 2007, 'Wheel lug nut — MONTECARLO 17-INCH / LT', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Nova', 1986, 1988, 'Wheel lug nut — NOVA ALL / 155/80R13', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Prizm', 1998, 2002, 'Wheel lug nut — PRIZM BASE/LSI / 175/65R14', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'S10 Blazer', 1982, 1991, 'Wheel lug nut — S10 BLAZER 2WD / 195/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'S10 Blazer', 1992, 2005, 'Wheel lug nut — S10 BLAZER 2WD / XTREME', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'S10 Pickup', 1982, 1989, 'Wheel lug nut — S10 PICKUP 4WD / 195/75R15', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'SS', 2014, 2016, 'Wheel lug nut — SS 19″BASE / SEDAN', null, null, 125, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'SSR', 2003, 2006, 'Wheel lug nut — SSR PICKUP / CONVERTBLE', null, null, 85, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/'),
  ('Chevrolet', 'Silverado 3500', 2001, 2016, 'Wheel lug nut — SILVERADO 3500 DUALLY / WT/LT/LTZ', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/chevrolet-lug-nut-torque-specifications/');
