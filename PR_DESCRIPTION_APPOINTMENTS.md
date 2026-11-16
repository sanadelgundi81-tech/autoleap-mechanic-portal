# Stage 2, prompt 3: Appointments UI

Branch: `feat/appointments-20261113` (base: `main` @ `2535245`, Stage 2 prompt 2 merged as PR #3)

The prompt said to start only after prompt 2 was merged. I checked that before
starting: `origin/main` is at `2535245`, "Stage 2: estimates + invoices UI (#3)",
and its code is identical to the prompt 2 branch.

## What was built

You can now book and manage appointments. There's a new Appointments page, and an
Appointments card on the order detail page.

**No migration.** The `appointments` table from the foundation migration already
has every column used here:
- `customer_id` (NOT NULL, ON DELETE CASCADE)
- `vehicle_id` and `repair_order_id` (both nullable, ON DELETE SET NULL)
- `starts_at`, `ends_at` (with the `ends_at > starts_at` check), `service`, `status`, `notes`

No migration file was added or changed.

### `src/lib/types.ts`
- `APPOINTMENT_STATUS_TRANSITIONS`: one place that defines the allowed status changes. Both the page's buttons and the data-layer checks read from it.
- `APPOINTMENT_EDITABLE_STATUSES` (`booked`, `confirmed`) and `APPOINTMENT_STATUS_LABELS`.
- `Appointment` gains optional joined `customers`, `vehicles` and `repair_orders` fields for display.

### `src/lib/data.ts`
These follow the existing `throwIfError` / `requireClient` patterns.

**Fetching**
- **`fetchAppointments()`:** every appointment, ordered by `starts_at` ascending. Each one comes with its customer (id, name), vehicle (year/make/model/trim/plate) and order (id, RO number).
- **`fetchAppointmentsByRepairOrder(id)`** and **`fetchAppointmentsByCustomer(id)`:** the same join, filtered.
- **Order detail load:** `fetchRepairOrderDetail` now loads `appointments` via `fetchAppointmentsByRepairOrder`, inside the same `Promise.all` as the other detail loads.

**Changing appointments**
- **`createAppointment(input)`:**
  - Requires a customer. The vehicle and order are optional.
  - Status starts as `booked`.
  - Rejects a missing or invalid start, and an end that isn't after the start.
- **`updateAppointment(id, updates)`:**
  - Time, service, vehicle and notes can only change while the appointment is `booked` or `confirmed`.
  - Status changes must follow the transition table.
  - `completed`, `cancelled` and `no_show` can't be changed at all.
  - The time range is re-checked against the merged values.
  - The update only applies if the status is still what was just read. If someone else changed it in between, the user gets "changed while you were editing it" instead of a rule being bypassed.
- **`deleteAppointment(id)`:** only `booked` or `confirmed` appointments. The delete itself is filtered on those statuses.
- **Vehicle check:** on create, and on update when the vehicle changes, the vehicle must belong to the appointment's customer. The form only offers that customer's vehicles, and the data layer enforces it too.

### Status transitions

| from | allowed next |
|---|---|
| `booked` | `confirmed`, `cancelled`, `no_show` |
| `confirmed` | `in_progress`, `cancelled`, `no_show` |
| `in_progress` | `completed` |
| `completed` / `cancelled` / `no_show` | none (terminal) |

### New Appointments page (`src/pages/Appointments.tsx`)
Added to the view routing in `src/App.tsx` and to the side and bottom navigation in
`src/components/Layout.tsx`, between Repair Orders and Customers.

**List**
- **Upcoming** (today and later) comes first, earliest first.
- **Past** (before today) comes below, most recent first. The prompt only said past appointments go below; I chose most-recent-first as more useful.
- **Each appointment shows:**
  - the date and time in local time, e.g. "Sat, Nov 14, 2026, 9:00 AM – 10:00 AM"
  - the service, a status badge and any notes
  - the vehicle
  - the customer name, which links to the customer (see below)
  - the RO number, when an order is linked, which links to that order

**New appointment form**
- **Customer:** required, from the existing customer list.
- **Vehicle:** optional, and only lists the chosen customer's vehicles.
- **Starts:** required, a `datetime-local` input.
- **Ends:** optional, a `datetime-local` input.
- **Service and notes.**
- Times are converted to ISO on save, and back to local time for editing.
- **Time check:** the form shows "The end time must be after the start time." and disables saving until it's fixed. The data layer and the database check enforce the same rule.

**Actions on each appointment**
- **Status buttons:** only the ones allowed from the current status (Confirm, Start, Complete, Cancel, No-show). Cancel and No-show ask for confirmation, because they can't be undone.
- **Edit:** inline, `booked`/`confirmed` only.
- **Delete:** `booked`/`confirmed` only, asks for confirmation.
- After every change the list reloads. Errors show in the page's `ErrorBanner`.

**Opened from an order:** the form opens straight away with the customer, vehicle and order filled in. It shows "For order RO-…", and the customer can't be changed so it stays matched to the order.

**Customer link:** there is no customer detail page, so the link opens the Customers page scrolled to that customer, with a blue outline around them.
- `Customers.tsx` takes an optional `focusCustomerId`.
- `Card` in `ui.tsx` takes an optional `id`.

### Order detail (`src/pages/RepairOrderDetail.tsx`)
**This is additive only.** One new Appointments card sits below Estimates/Invoices.
The only line removed is the old `format` import, which was rewritten to add
`formatAppointmentTime`. The Services tab, the Estimates card and the Invoices card
are unchanged.
- The card lists this order's appointments with the time, service and status.
- **New appointment** opens the Appointments page prefilled with this order's customer, vehicle and order.
- When there are appointments, a link opens the Appointments page to manage them.

### Shared pieces
- `src/lib/format.ts`:
  - `formatAppointmentTime(start, end)`: local time; shows only the end time when it's on the same day.
  - `toDateTimeLocalValue(iso)` and `fromDateTimeLocalValue(value)`.
- `src/components/ui.tsx`: `AppointmentStatusBadge`, in the existing dark slate/blue badge style.

**Dashboard: checked, not changed.** It loads correctly with appointments in the
database; see the walkthrough. No appointments were added to it.

**Not touched:**
- the services table, estimates, invoices, the inspection template and the 56-item checklist
- Auth and the login flow
- the Assigned/Completed rule
- all migrations and `seed.sql`

There are no new dependencies.

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings. The baseline on `main` was also 0, so there are no new findings.
- `npm run build` (`tsc --noEmit && vite build`): OK.

### Fresh scratch database
This used PGlite, an in-process Postgres installed only in a temporary folder.
- All migrations on `main` (3 files) applied in order with no errors.
- 11 tables, with RLS on for every one.
- **Deleting a repair order kept its appointment, with `repair_order_id` set to NULL (SET NULL).** I only checked this; I didn't change it.
- **Deleting the customer deleted their appointments (CASCADE).**

### Walkthrough with the real `data.ts` (39/39 checks pass)
**How it was run:** the same way as for prompt 2.
- The project's actual `src/lib/data.ts` and `src/lib/format.ts` were loaded through the project's own Vite and called through real supabase-js.
- The requests went to a small local stand-in for the Supabase REST API, backed by a fresh PGlite database. This time the stand-in also fills in the simple one-to-one joins the appointment list needs, such as the customer name and vehicle.
- Queries ran as the `authenticated` role.

**Steps and results:**
- **Time conversion:** a `datetime-local` value converts to ISO and back unchanged, and a blank end time becomes null.
- **Setup:** I created a test customer, vehicle and repair order (RO-20843) with the same functions the UI forms call.
- **Book from the Appointments page:** the appointment was `booked` and appeared in the upcoming list. The list showed the customer name and "2019 TEST Car", with no order linked. The time displayed in local time ("Sat, Nov 14, 2026, 9:00 AM – 10:00 AM").
- **Confirm → Start → Complete:** all three worked.
  - Going straight from booked to in progress was rejected.
  - While in progress, edit, cancel and delete were all rejected.
  - Once completed, status changes, edits and delete were all rejected.
- **Book from the order card:**
  - It appeared on the order card (`fetchRepairOrderDetail().appointments`, exactly 1).
  - It also appeared on the Appointments page linked to RO-20843.
  - `fetchAppointmentsByRepairOrder` returned only that appointment.
- **Edit while booked:**
  - The new time and service saved.
  - An end time before the start was rejected.
  - Another customer's vehicle was rejected.
- **Cancel a third:** it became `cancelled`. After that, a status change and a delete were both rejected.
- **No-show:** confirmed → no-show worked, and nothing further was allowed.
- **Bad time ranges:** an end before the start, and an end equal to the start, were both rejected by the data layer. The database check rejects a bad range on its own too.
- **Delete:** a booked appointment with a past start date was sorted into the past list, then deleted.
- **Customer list and order:** `fetchAppointmentsByCustomer` returned the remaining 4, and `fetchAppointments` came back in `starts_at` order.
- **Dashboard:** `fetchDashboardStats` loaded normally with appointments present.
- **Cleanup:** deleting the order set NULL on its appointment, and deleting the customers removed their appointments. Every test table ended with 0 rows.

**Regression:** I re-ran prompt 2's estimates/invoices walkthrough, because
`fetchRepairOrderDetail` changed. It still passes 35/35.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available,
  and there is no local Supabase stack (no Docker, Postgres or Supabase CLI). These
  were not exercised by clicking:
  - the Appointments page and the order card
  - the forms, including the inline end-time message and the disabled save
  - the confirm dialogs
  - the prefill navigation from an order
  - the customer scroll-to and highlight
  - the new navigation entry

  The walkthrough calls the same data and formatting functions those handlers use,
  but the React code was only checked by typecheck, lint and build.
- **The REST layer was a stand-in, not real PostgREST.** Requests went through real
  supabase-js, but a minimal local server answered them, so subtle PostgREST
  behaviour could still differ. Auth/JWT was not involved. RLS was checked at the
  database level.
- **Time zones:** tested only in this machine's time zone (US Pacific). Times are
  stored as ISO/UTC and shown in the viewer's local time. Nothing was tested across
  time zones or across a daylight-saving change.
- **No live test.** Nothing was applied to, written to or seeded in the live
  project. It stays empty.
- **Tested on Node 20 with `--experimental-websocket`.** This only applies to the
  test harness, because supabase-js needs a WebSocket in Node.

Not opened as a PR, not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
