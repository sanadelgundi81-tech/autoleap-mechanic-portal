-- ============================================================
-- AutoLeap mechanic portal — prompt 16: repair guide links seed, part 2 of 2
-- 20261127010102_guide_links_seed_02.sql
--
-- 26 links (Ford F-150 and common shop cars). Sources: NHTSA (static.nhtsa.gov recall documents),
-- YouTube (videos showing the job on that vehicle), F150Forum (generation
-- sub-forums) and Ford (fordservicecontent.com owner's manual PDFs).
-- Every URL was fetched on 2026-11-27 and checked: YouTube through its
-- oEmbed endpoint (title + channel stored as shown), PDFs downloaded and
-- their text checked for the vehicle, forum pages by their page title.
-- Links only — no text from any linked page is copied here.
--
-- Additive only: inserts rows, no DELETE/DROP. No secrets.
-- ============================================================

insert into public.repair_guide_links
  (vehicle_make, vehicle_model, year_from, year_to, kind, title, url, source)
values
  ('Ford', 'F-150', 1975, 1986, 'forum', 'Pre- 1987 / Classic Corner — F150Forum', 'https://www.f150forum.com/f13/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 1987, 1996, 'forum', '1987 - 1996 F150 — F150Forum', 'https://www.f150forum.com/f10/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 1997, 2003, 'video', 'Ford F150 Front Brake Pads Replacement 1997-2003 - 3 1/2 Minute DIY Video', 'https://www.youtube.com/watch?v=vw6Ow1l7SYQ', 'YouTube — MINUTE DIY VIDEOS'),
  ('Ford', 'F-150', 1997, 2003, 'forum', '1997 - 2003 Ford  F150 — F150Forum', 'https://www.f150forum.com/f6/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 2002, 2002, 'manual', '2002 F-150 Owner''s Guide (Ford PDF)', 'https://www.fordservicecontent.com/Ford_Content/catalog/owner_guides/02f12og2e.pdf', 'Ford (fordservicecontent.com)'),
  ('Ford', 'F-150', 2004, 2008, 'video', 'Ford F-150 5.4 Triton 2004-2008 Spark Plugs Replacement How-To', 'https://www.youtube.com/watch?v=DHpxscaK6LE', 'YouTube — Blue Collar Garage'),
  ('Ford', 'F-150', 2004, 2008, 'forum', '2004 - 2008 Ford F150 — F150Forum', 'https://www.f150forum.com/f4/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 2006, 2006, 'manual', '2006 F-150 Owner''s Guide (Ford PDF)', 'https://www.fordservicecontent.com/Ford_Content/catalog/owner_guides/06f12og1e.pdf', 'Ford (fordservicecontent.com)'),
  ('Ford', 'F-150', 2009, 2014, 'video', 'How to replace the Front Brake Pads 2009-2014 Ford F150 🛻', 'https://www.youtube.com/watch?v=ICf26AtUPjs', 'YouTube — CarParts.com'),
  ('Ford', 'F-150', 2009, 2014, 'forum', '2009 - 2014  Ford F150 — F150Forum', 'https://www.f150forum.com/f38/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 2011, 2013, 'bulletin', 'NHTSA recall 19V-075 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2019/RCLRPT-19V075-8473.PDF', 'NHTSA (nhtsa.gov)'),
  ('Ford', 'F-150', 2013, 2013, 'manual', '2013 F-150 Owner''s Manual (Ford PDF)', 'https://www.fordservicecontent.com/Ford_Content/catalog/owner_guides/13f12om3e.pdf', 'Ford (fordservicecontent.com)'),
  ('Ford', 'F-150', 2013, 2014, 'bulletin', 'NHTSA recall 16V-345 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2016/RCLRPT-16V345-0099.PDF', 'NHTSA (nhtsa.gov)'),
  ('Ford', 'F-150', 2015, 2018, 'bulletin', 'NHTSA recall 18V-568 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2018/RCLRPT-18V568-7188.pdf', 'NHTSA (nhtsa.gov)'),
  ('Ford', 'F-150', 2015, 2020, 'video', '2015-2020 Ford F-150 front brake pads and rotors install #ford #mechanic #repair', 'https://www.youtube.com/watch?v=b2FBABDiHkM', 'YouTube — Slow Car Repairs'),
  ('Ford', 'F-150', 2015, 2020, 'forum', '2015 - 2020 Ford F150 — F150Forum', 'https://www.f150forum.com/f118/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 2018, 2018, 'manual', '2018 F-150 Owner''s Manual (Ford PDF)', 'https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/2018-Ford-F-150-Owners-Manual-version-5_om_EN-US_09_2018.pdf', 'Ford (fordservicecontent.com)'),
  ('Ford', 'F-150', 2021, 2022, 'bulletin', 'NHTSA recall 22V-842 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2022/RCLRPT-22V842-2197.PDF', 'NHTSA (nhtsa.gov)'),
  ('Ford', 'F-150', 2021, 2023, 'video', '2021-2023 F150 2.7 EcoBoost Oil & Filter Change', 'https://www.youtube.com/watch?v=IG28Zhj5hwA', 'YouTube — Florida Cracker Kustoms'),
  ('Ford', 'F-150', 2021, null, 'forum', '2021+ Ford F150 — F150Forum', 'https://www.f150forum.com/f129/', 'F150Forum (f150forum.com)'),
  ('Ford', 'F-150', 2022, 2022, 'bulletin', 'NHTSA recall 22V-675 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2022/RCLRPT-22V675-9810.PDF', 'NHTSA (nhtsa.gov)'),
  ('Honda', 'CR-V', 2017, 2022, 'video', 'Honda CR-V 1.5L Oil Change (2017-2022)', 'https://www.youtube.com/watch?v=dMOwKtw0I34', 'YouTube — Big Dog50001 Automotive'),
  ('Honda', 'Civic', 2016, 2021, 'video', '2016-2021 Honda Civic 1.5L Oil Change', 'https://www.youtube.com/watch?v=zfohVXx-gRs', 'YouTube — Cars You Can Fix'),
  ('Toyota', 'Camry', 2018, 2024, 'video', '2018 - 2024 Toyota Camry Oil & Filter Change 2.5L', 'https://www.youtube.com/watch?v=pfL5MHDJ_k4', 'YouTube — Swan Can Fix It'),
  ('Toyota', 'Corolla', 2019, 2024, 'video', 'Toyota Corolla Oil Change 2019-2024 (12th Generation E210)', 'https://www.youtube.com/watch?v=zlp7pv5yx6s', 'YouTube — AutoFun'),
  ('Toyota', 'RAV4', 2019, 2024, 'video', '2019-2024 Toyota Rav4 2 5L Oil Change - DIY!', 'https://www.youtube.com/watch?v=x2zL3X7_5hI', 'YouTube — Random Automotive');
