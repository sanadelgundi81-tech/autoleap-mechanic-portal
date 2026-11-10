-- ============================================================
-- SAMPLE DATA ONLY — clearly-marked demo rows so the
-- dashboard is not empty on first run.
--
-- These are NOT real customers. The two sample vehicles are
-- from the original static demo page (a 2021 Ford F-150 and a
-- 2019 Toyota RAV4). No names, phones, plates, or VINs from
-- the reference screenshots are used anywhere here.
-- Safe to delete at any time:
--   delete from public.customers where id in
--     ('11111111-1111-1111-1111-111111111111',
--      '22222222-2222-2222-2222-222222222222');
-- (Vehicles, repair orders, inspections and results delete
-- with them via ON DELETE CASCADE.)
--
-- The "Comprehensive Inspection" template below has 56 items
-- in 7 sections, per the reference spec
-- (~/workspace/autoleap/reference-spec-2026-11-10.md).
-- 51 items are from the screenshots; 5 are INFERRED by Muse
-- (the user said to fill the gaps) and are flagged below —
-- swap them with one-line edits if the real list differs.
--
-- Run after the Stage 1 migration:
--   supabase db push --include-all   (or apply the migration
--   in the Supabase dashboard SQL editor first)
--   psql "$DATABASE_URL" -f supabase/seed.sql
-- ============================================================

insert into public.customers (id, name, phone, email, notes) values
  ('11111111-1111-1111-1111-111111111111', 'Marcus Vance', '(555) 019-2834', null, 'SAMPLE DATA — demo customer from the original static page.'),
  ('22222222-2222-2222-2222-222222222222', 'Sam Ortiz', '(555) 014-7782', null, 'SAMPLE DATA — demo customer from the original static page.')
on conflict (id) do nothing;

insert into public.vehicles (id, customer_id, year, make, model, trim, transmission, engine, vin, license_plate, mileage_km) values
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 2021, 'Ford', 'F-150', 'XLT PowerBoost', 'Automatic', '3.5L Hybrid', null, null, 48200),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 2019, 'Toyota', 'RAV4', 'XLE AWD', 'Automatic', '2.5L 4-Cyl', null, null, 61500)
on conflict (id) do nothing;

insert into public.repair_orders (id, ro_number, customer_id, vehicle_id, status, priority, concern, technician, bay, odometer_km, labor_hours, labor_rate, parts_total, shop_notes, customer_recommendations) values
  ('55555555-5555-5555-5555-555555555555', 'RO-20841', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'waiting_for_parts', 'medium',
   'Customer reports a grinding noise when braking. Check brakes and cabin filter.',
   'Alex M.', 'Bay 1', 48200, 3.5, 120.00, 480.00,
   'Customer approved brake work by phone. Waiting on front pads + rotors delivery.',
   'Front brake pads and rotors need replacement. Cabin air filter recommended.'),
  ('66666666-6666-6666-6666-666666666666', 'RO-20842', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'estimate', 'medium',
   'Routine inspection and check-engine light diagnosis.',
   'Jordan K.', 'Bay 2', 61500, 1.0, 120.00, 0.00,
   null, null)
on conflict (id) do nothing;

-- ---------- Comprehensive Inspection template (56 items) ----------

insert into public.inspection_templates (id, name, description, is_active) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Comprehensive Inspection',
   'Full 56-item vehicle inspection in 7 sections. Data-driven: edit rows here to change the checklist.',
   true)
on conflict (id) do nothing;

-- section_order 1 — WALK AROUND (4)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Walk Around', 1, 1, 'Body', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Walk Around', 1, 2, 'Windshield', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Walk Around', 1, 3, 'Mirrors', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Walk Around', 1, 4, 'Other - Walk Around', true);

-- section_order 2 — LIGHTS, CAMERAS, WIPERS & INTERIOR (12)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 1, 'Exterior Lights - Front', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 2, 'Exterior Lights - Rear', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 3, 'Exterior Lights - Side', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 4, 'Dash Indicator Lights', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 5, 'Horn', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 6, 'Wipers - Front', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 7, 'Wipers - Rear', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 8, 'Window & Mirror Controls', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 9, 'Back-up Camera', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 10, 'Parking Brake [electronic brake requires additional labor]', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 11, 'Cabin Air Filter', false),
  -- INFERRED (not in the screenshots; follows the "every section ends with an Other item" pattern)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lights, Cameras, Wipers & Interior', 2, 12, 'Other - Lights, Cameras, Wipers & Interior', true);

-- section_order 3 — UNDER HOOD (11)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 1, 'Hood / Hatch Supports', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 2, 'Battery / Cables', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 3, 'Spark Plugs', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 4, 'Engine Air Filter', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 5, 'Belts (Except Timing)', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 6, 'Engine Oil', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 7, 'Brake Fluid', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 8, 'Coolant', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 9, 'Windshield Washer Fluid', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 10, 'HVAC', false),
  -- INFERRED (not in the screenshots; every section ends with an "Other Notable" item)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under Hood', 3, 11, 'Other Notable - Under Hood', true);

-- section_order 4 — DRIVELINE FLUIDS (7)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 1, 'Transmission Fluid', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 2, 'Power Steering Fluid', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 3, 'Front Differential', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 4, 'Rear Differential', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 5, 'Transfer Case', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 6, 'Fluid Leaks', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Driveline Fluids', 4, 7, 'Other Notable - Driveline Fluids', true);

-- section_order 5 — STEERING, SUSPENSION & BRAKES (14)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 1, 'Under Covers and Hardware', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 2, 'Steering System', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 3, 'Front Suspension', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 4, 'Rear Suspension', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 5, 'Shocks & Struts', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 6, 'Sway Bar Links & Bushings', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 7, 'Ball Joints (Upper and Lower)', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 8, 'Front End Play', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 9, 'Driveline (CV/Drive Shaft)', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 10, 'Brake Pads - Front', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 11, 'Pads or Shoes - Rear', false),
  -- INFERRED (not in the screenshots; a brake inspection without rotors is incomplete)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 12, 'Brake Rotors - Front', false),
  -- INFERRED (not in the screenshots; a brake inspection without rotors is incomplete)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 13, 'Brake Rotors - Rear', false),
  -- INFERRED (not in the screenshots; every section ends with an "Other Notable" item)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steering, Suspension & Brakes', 5, 14, 'Other Notable - Steering, Suspension & Brakes', true);

-- section_order 6 — EXHAUST (2)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Exhaust', 6, 1, 'Exhaust System', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Exhaust', 6, 2, 'Other Notable - Exhaust', true);

-- section_order 7 — TIRES (6)
insert into public.inspection_template_items (template_id, section, section_order, position, name, is_free_text) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tires', 7, 1, 'Matching Tires', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tires', 7, 2, 'Tire Condition - Driver Front', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tires', 7, 3, 'Tire Condition - Passenger Front', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tires', 7, 4, 'Tire Condition - Driver Rear', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tires', 7, 5, 'Tire Condition - Passenger Rear', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tires', 7, 6, 'Other Notable - Tires', true);

-- ---------- Sample inspections (one per sample RO) ----------

insert into public.inspections (id, repair_order_id, template_id, status, assigned_to) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'in_progress', 'Alex M.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'in_progress', 'Jordan K.')
on conflict (id) do nothing;

-- 5 marked results on RO-20841's inspection (3 good, 1 attention, 1 failed; 51 unmarked).
insert into public.inspection_results (inspection_id, template_item_id, state, note) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd',
   (select id from public.inspection_template_items where template_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' and name = 'Brake Pads - Front'),
   'failed', 'SAMPLE DATA — pads worn to 2mm, recommend replacement.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd',
   (select id from public.inspection_template_items where template_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' and name = 'Cabin Air Filter'),
   'attention', 'SAMPLE DATA — heavy particulate buildup.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd',
   (select id from public.inspection_template_items where template_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' and name = 'Battery / Cables'),
   'good', null),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd',
   (select id from public.inspection_template_items where template_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' and name = 'Engine Oil'),
   'good', null),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd',
   (select id from public.inspection_template_items where template_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' and name = 'Body'),
   'good', null)
on conflict (inspection_id, template_item_id) do nothing;

-- Draft estimate for RO-20841 built from the findings:
-- labour 3.5h x $120 = $420, parts $480 + $75 = $555, total $975.
insert into public.estimates (id, repair_order_id, status, labor_total, parts_total, tax, total, notes) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'draft', 420.00, 555.00, 0.00, 975.00, 'SAMPLE DATA — draft estimate from the inspection findings.')
on conflict (id) do nothing;

-- One booked appointment for the RAV4 follow-up.
insert into public.appointments (id, customer_id, vehicle_id, repair_order_id, starts_at, ends_at, service, status, notes) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666',
   now() + interval '2 days', now() + interval '2 days 1 hour', 'Inspection follow-up', 'booked', 'SAMPLE DATA')
on conflict (id) do nothing;
