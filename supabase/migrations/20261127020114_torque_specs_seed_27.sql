-- ============================================================
-- AutoLeap mechanic portal — prompt 16: torque specs seed 27
-- 20261127020114_torque_specs_seed_27.sql
--
-- Source: ricksfreeautorepairadvice.com — Rick's Free Auto Repair Advice, lug nut torque specs by make
--   pages: dodge-lug-nut-torque-specifications, gmc-lug-nut-torque-specifications, honda-lug-nut-torque-specifications, hyundai-lug-nut-torque-specifications
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
  ('Dodge', 'Spirit', 1989, 1995, 'Wheel lug nut — SPIRIT 14-INCH / BSE/ES/LE', null, null, 95, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Sprinter 2500', 2003, 2005, 'Wheel lug nut — SPRINTER 2500 W/ALU.WHLS / 6- LUG', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Sprinter 2500', 2006, 2008, 'Wheel lug nut — SPRINTER 2500 W/ALU.WHLS / 6- LUG', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Sprinter 2500', 2006, 2008, 'Wheel lug nut — SPRINTER 2500 W/STL.WHLS / 6- LUG', null, null, 180, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Sprinter 3500', 2003, 2009, 'Wheel lug nut — SPRINTER 3500 DUALLY / 195/70R15D', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Sprinter 3500', 2006, 2008, 'Wheel lug nut — SPRINTER 3500 C-LD RNG / W/ALU.WHLS', null, null, 135, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Stealth', 1991, 1996, 'Wheel lug nut — STEALTH 2 DOOR / R/T-TURBO', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Stratus', 1995, 1999, 'Wheel lug nut — STRATUS – BASE W/ABS SEDAN / BASE W/ABS', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Stratus', 1995, 2006, 'Wheel lug nut — STRATUS – ES SEDAN / ES', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Stratus', 2001, 2005, 'Wheel lug nut — STRATUS – COUPE COUPE / SE', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Van/Wagon', 1989, 1997, 'Wheel lug nut — VAN/WAGON 15″OPT.2 / B150/1500', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Van/Wagon', 1989, 2003, 'Wheel lug nut — VAN/WAGON – B350/3500 BASE 225 / B350/3500', null, null, 150, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Van/Wagon', 1997, 2003, 'Wheel lug nut — VAN/WAGON 15″BASE / B150/1500', null, null, 115, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Viper', 1992, 2010, 'Wheel lug nut — VIPER 2 DOOR / CABRIOLET', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Viper', 2013, 2018, 'Wheel lug nut — VIPER BASE / ALL', null, null, 110, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('Dodge', 'Vista', 1985, 1991, 'Wheel lug nut — VISTA WAGON / P165/80R13', null, null, 60, null, 'https://ricksfreeautorepairadvice.com/dodge-lug-nut-torque-specifications/'),
  ('GMC', 'Savana', 1996, 2018, 'Wheel lug nut — SAVANA – ALL 15″BASE / G10/G1500', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Sonoma', 1996, 2004, 'Wheel lug nut — SONOMA 16-INCH / ALL', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Suburban', 1973, 1991, 'Wheel lug nut — SUBURBAN 2WD/5LUG / C1500', null, null, 120, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Suburban', 1973, 1991, 'Wheel lug nut — SUBURBAN 4WD/6LUG / K1500', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Suburban', 1983, 1999, 'Wheel lug nut — SUBURBAN 2WD/8LUG / C2500', null, null, 140, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Syclone', 1991, 1991, 'Wheel lug nut — SYCLONE 2 DOOR / PICKUP', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Typhoon', 1992, 1993, 'Wheel lug nut — TYPHOON AWD / SUV', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('GMC', 'Vandura', 1988, 1995, 'Wheel lug nut — VANDURA – ALL ALL / 215/75R15', null, null, 100, null, 'https://ricksfreeautorepairadvice.com/gmc-lug-nut-torque-specifications/'),
  ('Honda', 'CR-Z', 2011, 2016, 'Wheel lug nut — CR-Z 16″BASE / ALL', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Honda', 'CRX', 1984, 1991, 'Wheel lug nut — CRX ALL / HF', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Honda', 'Crosstour', 2010, 2015, 'Wheel lug nut — CROSSTOUR 17″BASE / EX', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Honda', 'EV Plus', 1997, 1999, 'Wheel lug nut — EV PLUS ALL / HATCHBACK', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Honda', 'Passport', 1994, 2002, 'Wheel lug nut — PASSPORT 2WD / P215/75R15', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Honda', 'Prelude', 1985, 2001, 'Wheel lug nut — PRELUDE ALL / BASE/SI', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Honda', 'del Sol', 1993, 1997, 'Wheel lug nut — DEL SOL ALL / S', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/honda-lug-nut-torque-specifications/'),
  ('Hyundai', 'Azera', 2006, 2016, 'Wheel lug nut — AZERA 17-INCH / LIMITED', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Entourage', 2007, 2008, 'Wheel lug nut — ENTOURAGE 16-INCH / GLS', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Equus', 2011, 2016, 'Wheel lug nut — EQUUS 19″BASE / SEDAN', null, null, 90, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Excel', 1986, 1994, 'Wheel lug nut — EXCEL ALL / P155/80R13', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/'),
  ('Hyundai', 'Genesis', 2009, 2016, 'Wheel lug nut — GENESIS – ALL 18″BASE / 4.6', null, null, 80, null, 'https://ricksfreeautorepairadvice.com/hyundai-lug-nut-torque-specifications/');
