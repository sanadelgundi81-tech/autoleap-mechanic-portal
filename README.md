# autoleap-mechanic-portal

Independent Mechanic Portal, Digital Vehicle Inspection (DVI), and Repair
Order Management System — a real app backed by Supabase, not a static demo.

Functional spec: `~/workspace/autoleap/reference-spec-2026-11-10.md`
(11 screenshots of the real AutoLeap technician app — fields and workflow
only; the app's teal branding is NOT copied. This project keeps its own
dark slate/blue design.)

## Stage 1 — foundation (this branch)

- Vite + React + TypeScript + Tailwind app.
- Supabase schema in one migration:
  `supabase/migrations/20261110010000_autoleap_foundation.sql`
  — `customers`, `vehicles`, `repair_orders`, `estimates`, `invoices`,
  `appointments`, plus the data-driven inspection model:
  `inspection_templates`, `inspection_template_items`, `inspections`,
  `inspection_results`. Row Level Security on, authenticated users
  only. Additive only, no secrets.
- Order statuses from the reference app: Estimate, Waiting For
  Approval, Waiting For Parts, Appointment Confirmed, Invoice.
  Orders list tabs: Assigned (everything except Invoice) / Completed
  (Invoice) — that split is an assumption from the screenshots and
  should be confirmed against the real app.
- Comprehensive Inspection: 56 items in 7 sections, each marked
  good / attention / failed (unmarked = no result row), with counts
  by state and a "Mark as complete" action. The checklist is
  data-driven — editing the template rows changes the checklist,
  no code change needed. 5 of the 56 items are inferred by Muse
  (the user said to fill the gaps) and flagged in the seed file and
  the PR description; swap them with one-line edits if the real
  list differs.
- Auth via Supabase Auth (email + password). The old `portal_users`
  plaintext-password approach is gone, and the old hardcoded anon key
  is removed.
- Live pages: login, dashboard (KPIs computed from real data), orders
  (Assigned/Completed tabs, search, oldest-to-newest sort), order
  detail (Overview/Services tabs, odometer, customer + vehicle cards,
  vehicle history, inspection summary, specifications, shop notes,
  customer recommendations), the full inspection page, customers +
  vehicles (create/list). No hardcoded KPIs, bays, or repair orders
  in the UI.
- Optional clearly-marked sample data in `supabase/seed.sql` (the two
  sample vehicles from the original page: a 2021 Ford F-150 and a 2019
  Toyota RAV4 — no real names, phones, plates, or VINs from the
  reference screenshots).

## Supabase project

- Project: **autoleap-mechanic-portal**
- Ref: `nfbtbkdlroldwbfcygcx`
- URL: https://nfbtbkdlroldwbfcygcx.supabase.co
- Region: us-west-2, free plan, created Nov 9, 2026

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in VITE_SUPABASE_ANON_KEY
npm run dev
```

Environment variables (never commit real values):

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://nfbtbkdlroldwbfcygcx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the project's anon (publishable) key — set in Vercel project settings for the deployed app |

If the variables are missing, the app shows a setup screen instead of a
fake "connected" badge.

## Database

Apply the migration to the Supabase project (SQL editor or Supabase CLI),
then optionally load the sample data:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

## Scripts

```bash
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run lint       # eslint on src
npm run build      # typecheck + production build
```

## What is NOT in Stage 1

- Live Supabase wiring verification (the migration has not been applied
  to the live project yet; SQL was verified on a scratch database).
  Note: the project's JWT secret was being rotated on Nov 9, 2026
  (both keys probed returned 401 at the time) — re-check the anon key
  before wiring the deployed app live.
- Services tab content (service line items, approvals, service
  progress on order cards) — the tab exists with a Stage 2 placeholder.
- Creating estimates and invoices in the UI (tables exist; existing rows
  are shown read-only on the order page).
- Scheduling/appointments UI, payments, parts ordering, texting, or any
  third-party integrations.
