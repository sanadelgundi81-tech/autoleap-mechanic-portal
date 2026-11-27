-- ============================================================
-- AutoLeap mechanic portal — prompt 16: repair guide links seed, part 1 of 2
-- 20261127010101_guide_links_seed_01.sql
--
-- 19 links (BMW 3 Series, 5 Series, X5). Sources: NHTSA (static.nhtsa.gov recall documents),
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
  ('BMW', '3 Series', 1992, 1999, 'video', 'BMW E36 Oil Change (HOW-TO) DIY', 'https://www.youtube.com/watch?v=3VVBPz_3WWw', 'YouTube — The Cherry Garage'),
  ('BMW', '3 Series', 1999, 2006, 'video', 'BMW E46 2001-2006 330i 330ci 330xi Front Pads and Rotors', 'https://www.youtube.com/watch?v=wnNtFf7HnGU', 'YouTube — Cars You Can Fix'),
  ('BMW', '3 Series', 2006, 2011, 'bulletin', 'NHTSA recall 17V-676 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2017/RCLRPT-17V676-9625.PDF', 'NHTSA (nhtsa.gov)'),
  ('BMW', '3 Series', 2006, 2011, 'video', 'BMW E90 Oil Change & Filter Replacement (N52/N51 Engine 325i 328i 330i DIY)', 'https://www.youtube.com/watch?v=qQCpx3Wh8_Q', 'YouTube — Auto Repair Guys'),
  ('BMW', '3 Series', 2007, 2011, 'bulletin', 'NHTSA recall 17V-683 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2017/RCLRPT-17V683-7475.pdf', 'NHTSA (nhtsa.gov)'),
  ('BMW', '3 Series', 2012, 2019, 'video', 'BMW Oil Change DIY, 2015 328i (F30/F31/F34/F35; 2011–2019', 'https://www.youtube.com/watch?v=WimaLId-WIU', 'YouTube — Claude'),
  ('BMW', '3 Series', 2019, null, 'video', 'BMW 330i and 330e (G20) 2019-Present Oil Change DIY Video - Change your oil with confidence!#bmw', 'https://www.youtube.com/watch?v=u_TbsAv18Fw', 'YouTube — Talking With Cars'),
  ('BMW', '5 Series', 1997, 2003, 'video', 'How to change engine oil and oil filter BMW 5 E39 [TUTORIAL AUTODOC]', 'https://www.youtube.com/watch?v=68_Pybgo56M', 'YouTube — autodoc.co.uk'),
  ('BMW', '5 Series', 2004, 2010, 'video', 'BMW E60 5 Series How To: Oil Change & Filter DIY (N52)', 'https://www.youtube.com/watch?v=IZAC0H5bJzw', 'YouTube — Proppa Flex'),
  ('BMW', '5 Series', 2011, 2016, 'video', 'BMW 5 Series F10 Oil Change & Reset Procedure', 'https://www.youtube.com/watch?v=iTuDGJm4oNg', 'YouTube — JAY D3E'),
  ('BMW', '5 Series', 2017, 2023, 'video', 'BMW 530i (G30) Oil Change with Reminder Reset', 'https://www.youtube.com/watch?v=mGohpP64Qxo', 'YouTube — EuroCars LLC'),
  ('BMW', 'X5', 2000, 2006, 'video', 'How to do a DIY Oil Change on an E53 BMW X5 4.4i', 'https://www.youtube.com/watch?v=FlIICEfL8Vw', 'YouTube — 50sKid'),
  ('BMW', 'X5', 2007, 2013, 'bulletin', 'BMW service bulletin SI B65 14 16 — recall 16V-071, driver front air bag module (E70 X5)', 'https://static.nhtsa.gov/odi/rcl/2016/RCRIT-16V071-6143.pdf', 'NHTSA (nhtsa.gov) — BMW bulletin'),
  ('BMW', 'X5', 2007, 2013, 'video', 'BMW X5 35i E70 SUV DIY Oil Change Procedure Tutorial', 'https://www.youtube.com/watch?v=mhaSRnptxyI', 'YouTube — Drive - Chris Capredoni'),
  ('BMW', 'X5', 2014, 2015, 'bulletin', 'NHTSA recall 16V-683 — owner notice, X3 / X4 / X5 MY 2014–2015', 'https://static.nhtsa.gov/odi/rcl/2016/RCMN-16V683-9188.pdf', 'NHTSA (nhtsa.gov)'),
  ('BMW', 'X5', 2014, 2018, 'video', 'HOW TO: Oil Change BMW X5 (F15 35i)', 'https://www.youtube.com/watch?v=vWst0-xOrCA', 'YouTube — AR Perez'),
  ('BMW', 'X5', 2015, 2015, 'bulletin', 'NHTSA recall 14V-650 — 2015 X5 rear seat (dealer notice)', 'https://static.nhtsa.gov/odi/rcl/2014/RCMN-14V650-9881.pdf', 'NHTSA (nhtsa.gov)'),
  ('BMW', 'X5', 2019, 2020, 'bulletin', 'NHTSA recall 24V-576 — Part 573 Safety Recall Report', 'https://static.nhtsa.gov/odi/rcl/2024/RCLRPT-24V576-6186.PDF', 'NHTSA (nhtsa.gov)'),
  ('BMW', 'X5', 2019, null, 'video', 'BMW X5 40i Oil Change DIY | B58 Engine G05', 'https://www.youtube.com/watch?v=73N8ZQyuxhk', 'YouTube — Jason Bimmer Repairs');
