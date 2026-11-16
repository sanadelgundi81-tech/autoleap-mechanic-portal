# Stage 2, prompt 5: Timelogs

Branch: `feat/timelogs-20261116` (base: `main` @ `cbe9f1b`, Stage 2 prompt 4 / notifications merged as PR #5)

The prompt said to start only after notifications were merged. I checked that
before starting: `origin/main` is at `cbe9f1b`, "Stage 2: in-app notifications
(#5)". Its code is identical to the prompt 4 branch, and
`src/pages/Notifications.tsx` and the notifications migration are there.

## What was built

Timelogs record the time spent working on a repair order. There's a new Timelogs
page, and a Timelogs card on the order detail page with a Start/Stop timer.

**Timelogs are a record, not billing:**
- A timelog never writes `labor_hours`, `labor_rate`, `parts_total` or any money total.
- It never creates a notification.
- The total time logged on an order is shown for reference only.
- There's no technician identity; timelogs belong to the repair order.

### Migration `20261116020000_timelogs.sql` (new file; existing migrations untouched)
- **Table `timelogs`:**

  | column | definition |
  |---|---|
  | `id` | uuid PK, default `gen_random_uuid()` |
  | `repair_order_id` | uuid NOT NULL, FK to `repair_orders` **ON DELETE CASCADE** |
  | `started_at` | timestamptz NOT NULL |
  | `ended_at` | timestamptz, nullable (NULL = running) |
  | `note` | text, nullable |
  | `created_at` | timestamptz NOT NULL, default `now()` |

- **Check:** `ended_at IS NULL OR ended_at > started_at`.
- **Partial unique index** `timelogs_one_running_per_order_idx` on `(repair_order_id) WHERE ended_at IS NULL`. This means at most one running timelog per order, enforced by the database itself.
- **Index** on `(repair_order_id, started_at DESC)`.
- **RLS:** turned on, with the same `authenticated_full_access` policy as every other table.
- **No seed rows.** No other table is touched.

### `src/lib/types.ts`
`Timelog`, with an optional joined `repair_orders { id, ro_number, customers { id, name } }`.

### `src/lib/format.ts`
- **`timelogMinutes(start, end, now?)`:** whole minutes between start and end. A running timelog counts up to now, and the result is never negative.
- **`formatDuration(minutes)`:** "45 min" or "1 h 30 min".
- **`formatTimelogRange(start, end)`:** local time, e.g. "Nov 16, 9:00 AM – 10:30 AM", or "… – running".

### `src/lib/data.ts`
These follow the existing `throwIfError` / `requireClient` patterns.

**Reading timelogs**
- **`fetchTimelogsByRepairOrder(id)`:** returns `{ timelogs, totalMinutes }`, newest first. A running timer counts toward the total up to now.
- **`fetchTimelogs()`:** all timelogs, newest first, with the RO number and customer name joined.
- **Order detail load:** `fetchRepairOrderDetail` now loads `timelogs` through `fetchTimelogsByRepairOrder`, in the same `Promise.all` as the other detail loads.

**Changing timelogs**
- **`startTimelog(repairOrderId, note?)`:** first checks whether the order already has a running timelog. If it does, it fails with "This order already has a running timelog. Stop it before starting another." If two starts happen at the same moment, the database index refuses the second (error `23505`), and that's turned into the same clear message.
- **`stopTimelog(id)`:** sets `ended_at` to now, but only while the timelog is running. If it's already stopped (or was deleted), it says so.
- **`addTimelog(repairOrderId, startedAt, endedAt, note?)`:** a manual entry for time that wasn't clocked. The end time is required and must be after the start.
- **`updateTimelog(id, { note })`:** changes the note only. Times are fixed once recorded; to fix a time, delete the entry and add it again.
- **`deleteTimelog(id)`:** if the timelog is already gone, it says so.
- Notes are trimmed, and a blank note becomes null.

### Timelogs page (`src/pages/Timelogs.tsx`)
Added to the view routing in `src/App.tsx` and to both navs in
`src/components/Layout.tsx`, between Notifications and Customers.

The mobile bottom nav now has six items. I kept them on one line and let the bar
scroll sideways on narrow phones, instead of squeezing the labels.

**The list**
- A **Running** section comes first, then **Finished**. Each is newest first.
- **Each row shows:**
  - the RO number (links to the order) and the customer
  - the start–end time and the duration ("… so far" while running)
  - the note
  - **Stop** while running
- **Finished entries** have **Edit note** and **Delete** (asks for confirmation).

**New timelog form (manual entry)**
- Fields: order (picked from the existing orders), Started, Ended (both `datetime-local`) and an optional note.
- It shows "The end time must be after the start time." inline and disables saving until that's fixed.

Errors show in the page's `ErrorBanner`. A note on the page says that timelogs don't
change labour charges or totals.

### Order detail (`src/pages/RepairOrderDetail.tsx`)
**This is additive only.** The diff removes no lines. There's one new Timelogs card
below the Appointments card. The Services tab, the Estimates, Invoices and
Appointments cards, and the money math are unchanged.
- The card shows the order's total logged time, marked as for reference and not billed.
- It has an optional note box and a **Start** button. While a timer runs, the button becomes **Stop**.
- It lists the order's timelogs, newest first, with the running one highlighted.
- It links to the Timelogs page for editing notes and adding manual entries.

**Dashboard: checked, not changed.** It loads correctly with timelogs present, and
billed hours and the collected total are unchanged.

**Not touched:**
- the services table, estimates, invoices, appointments and notifications
- the inspection template and the 56-item checklist
- Auth and the login flow
- the Assigned/Completed rule and the money math
- existing migrations and `seed.sql`

There are no new dependencies.

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings. The baseline on `main` was also 0, so there are no new findings.
- `npm run build` (`tsc --noEmit && vite build`): OK.

### Fresh scratch database
This used PGlite, an in-process Postgres installed only in a temporary folder.
- All 5 migrations applied in order with no errors: foundation, technician completion, order services, notifications, timelogs.
- 13 tables, with RLS on for every one.
- `timelogs` has the `authenticated_full_access` policy (ALL, authenticated, `true`/`true`), both indexes, and the cascade foreign key.
- **The one-running-per-order rule is enforced by the database itself.** With one running row already there, inserting a second running row for the same order directly in SQL was refused with `23505` (unique violation).
- The database check refuses an end time before the start.

### Timelogs walkthrough with the real `data.ts` (34/34 checks pass)
**How it was run:** the same harness as for prompts 2–4. The project's actual
`src/lib/data.ts` and `src/lib/format.ts` were loaded through the project's own Vite
and called through real supabase-js. The requests went to a small local stand-in for
the Supabase REST API, backed by a fresh PGlite database. This time the stand-in also
handles the nested order → customer join. Queries ran as the `authenticated` role.

**Steps and results:**
- **Setup:** I created a test customer, vehicle and repair order (RO-20843) with a service. The order started with no timelogs and a total of 0.
- **Start from the order card:**
  - It created a running timelog, and the note was trimmed.
  - It showed as running on the order card (`fetchRepairOrderDetail().timelogs`).
  - It showed as running on the Timelogs page, with "RO-20843 / TEST customer (timelogs)".
- **Second start on the same order:** rejected with the clear message.
- **Two starts at exactly the same moment** on another order: one ran and the other got the same clear message.
- **Stop:** I moved the start back 90 minutes to stand in for elapsed time.
  - While running, the order total was 90 min.
  - Stop set `ended_at`, and the duration was 90 min ("1 h 30 min").
  - Stopping it again was rejected.
  - The order total stayed 90.
- **Manual entry:** a 2-hour entry with an explicit start and end saved those exact times. The order total became 210 min ("3 h 30 min"), and the list was newest first.
- **Bad manual entries:** end before start and end equal to start were both rejected by the data layer, and the database check rejects them too.
- **Edit note:** the note saved and the times were unchanged.
- **Delete:** the entry was removed and the total went back to 90. Deleting it again said it was already deleted.
- **Not billing:**
  - The order's `labor_hours`, `labor_rate` and `parts_total` were unchanged, and so was the estimate prefill.
  - The dashboard loaded, with billed hours and the collected total unchanged.
  - Starting, stopping, adding and deleting timelogs created no notifications (0 rows).
- **Cascade:** deleting the order deleted its 2 timelogs (2 → 0).
- **Cleanup:** all test data was deleted. Every table ended with 0 rows.

### Regression
All re-runs used the new migration set.
- **Appointments: 39/39.** Covered:
  - booking, and confirm → start → complete
  - cancel and no-show
  - the edit/delete rules and bad time ranges
  - order delete setting `repair_order_id` to NULL, and customer delete removing appointments
  - the dashboard
- **Estimates/invoices: 35/35.** Covered:
  - prefill and the tax-edit total
  - INV numbers
  - paid/void and `paid_at`
  - the dashboard's collected total going from 0 to 383.49
- **Notifications: 55/55.**
  - Each listed event still creates exactly one notification, 13 in total across the 9 types.
  - Non-events create none.
  - The unread count goes 13 → 12 → 11 → 0.
- **No timelog notifications:** starting or stopping a timelog creates none; this is checked in the timelogs walkthrough.

The only edits to the regression scripts were their hard-coded migration and table
counts (4 → 5 migrations, 12 → 13 tables), because this PR adds one migration.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available,
  and there is no local Supabase stack (no Docker, Postgres or Supabase CLI). These
  were not exercised by clicking:
  - the Timelogs page and the order card's Start/Stop
  - the manual-entry form, including the inline end-time message
  - the confirm dialogs
  - the sideways-scrolling mobile nav

  The walkthrough calls the same data and formatting functions those screens use,
  but the React code was only checked by typecheck, lint and build.
- **The REST layer was a stand-in, not real PostgREST.** Requests went through real
  supabase-js, but a minimal local server answered them, so subtle PostgREST
  behaviour could still differ. In particular, the nested join and passing the
  `23505` error code through are the stand-in's versions. Auth/JWT was not involved.
  RLS was checked at the database level.
- **A running timer's duration doesn't tick on screen.** It's worked out when the
  page or card loads, and refreshes after any action or navigation. There's no
  live-updating clock.
- **Clock skew:** a timer's start and stop times come from the device's clock.
  Nothing was tested across devices with different clocks.
- **No live test.** Nothing was applied to, written to or seeded in the live
  project. It stays empty. **Before deploying, apply
  `20261116020000_timelogs.sql` to the live project.** Without it, the order detail
  page fails to load, because it now loads timelogs, and the Timelogs page shows an
  error.
- **Tested on Node 20 with `--experimental-websocket`.** This only applies to the
  test harness, because supabase-js needs a WebSocket in Node.

Not opened as a PR, not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
