# Stage 2, prompt 2: Estimates + invoices UI

Branch: `feat/estimates-invoices-20261113` (base: `main` @ `82eecfb`, Stage 2 prompt 1, PR #2)

Precondition: the prompt said to start only after `20261113010000_order_services.sql`
was applied to the live project and the live Services-tab walkthrough was done.
I could not check either one from this machine, because there are no live
credentials here. I took the prompt being pasted again as confirmation that both
are done.

## What was built

On the order detail page you can now create and manage estimates and invoices.
Before this change, both were shown read-only.

**No migration.** The `estimates` and `invoices` tables from the foundation
migration already have every column this uses:
- `estimates`: `status`, `labor_total`, `parts_total`, `tax`, `total`, `notes`
- `invoices`: `invoice_number` (defaults to INV-#### from `invoice_number_seq`), `status`, `subtotal`, `tax`, `total`, `paid_at`

No migration file was added or changed.

**Money rules.** Nothing in the schema has a tax rate, so tax is an amount you
type in, defaulting to 0. Totals are always worked out in code, never typed in:
- estimate `total = labor_total + parts_total + tax`
- invoice `total = subtotal + tax`

Totals are rounded to cents to match `numeric(10,2)`.

### `src/lib/types.ts`
- `ESTIMATE_STATUS_TRANSITIONS` and `INVOICE_STATUS_TRANSITIONS`: one place that defines the allowed status changes. Both the UI buttons and the data-layer checks read from it.
- `ESTIMATE_STATUS_LABELS` and `INVOICE_STATUS_LABELS`.

### `src/lib/data.ts`
These follow the existing `throwIfError` / `requireClient` patterns.

**Estimates**
- **`createEstimate`:** starts as `draft`. The total is computed.
- **`updateEstimate`:** can change labour, parts, tax, notes and status.
  - The total is recomputed on every update.
  - Amounts can only change while the estimate is `draft`.
  - Status changes must follow the transition table.
  - A `declined` estimate can't be changed at all.
- **`deleteEstimate`:** draft estimates only. The delete itself is filtered on `status = 'draft'`, so a non-draft can't be deleted.

**Invoices**
- **`createInvoice`:** starts as `draft`. The total is computed. `invoice_number` is never set in code; the database default fills it in.
- **`updateInvoice`:** can change subtotal, tax and status.
  - The total is recomputed on every update.
  - Amounts can only change while the invoice is `draft`.
  - Moving to `paid` sets `paid_at` to now. Moving away from `paid` clears it.
  - A `void` invoice can't be changed at all.
- **`deleteInvoice`:** draft invoices only. Like estimates, the delete is filtered on `status = 'draft'`.

**Shared behaviour**
- **Concurrent changes:** each update only applies if the record's status is still what was just read. If someone else changed it in between, the user gets "changed while you were editing it. Reload and try again." instead of a rule being bypassed.
- **Negative amounts:** rejected with a clear message before any request is sent. The database `>= 0` checks are a second line of defence.

**Prefill helpers.** These are plain functions over the loaded order detail; there is no new table.
- **`estimatePrefill(detail)`:**
  - Labour is the sum of the order's services' `labor_hours × labor_rate`. Parts is the sum of the services' `parts_total`.
  - If the order has no services, it falls back to the order-level `labor_hours × labor_rate` and `parts_total`.
- **`invoiceSubtotalPrefill(detail)`:** the total of the most recently created `approved` estimate. If there isn't one, it's labour + parts from `estimatePrefill`.
- **Tax prefill:** always 0.

### Status transitions

| | allowed next statuses |
|---|---|
| estimate `draft` | `sent`, `declined` |
| estimate `sent` | `approved`, `declined` |
| estimate `approved` | none |
| estimate `declined` | none (terminal) |
| invoice `draft` | `sent`, `void` |
| invoice `sent` | `paid`, `void` |
| invoice `paid` | `void` (clears `paid_at`) |
| invoice `void` | none (terminal) |

Choices I made where the prompt didn't settle it. Each is a one-line change in the
transition tables if you want it different.
- **Draft estimates can be declined, and draft invoices can be voided.** The walkthrough asks for a decline/void path on a second *draft*.
- **`paid → void` is allowed.** The prompt says leaving `paid` clears `paid_at`, and `void` is the only sensible status to leave `paid` for.
- **`approved` has no next status.** The prompt only lists `declined`/`void` as terminal, but it gives no transition out of `approved`, so I added none.

### Order detail (`src/pages/RepairOrderDetail.tsx`)
Both "arrives in Stage 2" EmptyStates are replaced by working cards. They use
`Card`, `Field`, `PrimaryButton`, `SecondaryButton`, `inputClassName`,
`EmptyState`, `money` and `formatDate`, in the existing dark slate/blue style.

**Estimates card**
- **Create estimate:** opens a form with labour, parts, tax and notes, prefilled as described above. Every field can be edited before saving, and the form shows the computed total live.
- **Each estimate shows:**
  - a status badge and the date
  - the Labour + Parts + Tax breakdown, the total and any notes
  - only the status buttons allowed from its current status (Send / Approve / Decline)
- **Draft-only actions:** Edit, and Delete (asks for confirmation).
- **Decline** asks for confirmation, because it can't be undone.

**Invoices card**
- **Create invoice:** opens a form with subtotal and tax, prefilled as described above, and shows the computed total. The form notes that the INV number is assigned automatically.
- **Each invoice shows:**
  - its number and a status badge
  - Subtotal + Tax and the total
  - "Paid <date>" when it has been paid
  - only the allowed status buttons (Send / Mark paid / Void)
- **Draft-only actions:** Edit, and Delete (asks for confirmation).
- **Void** asks for confirmation.

After every change, the page reloads the order detail the same way the Services
tab does. Errors appear in the page's existing `ErrorBanner`.

**Dashboard: checked, not changed.** `collectedPaidInvoices` sums `total` where
`status = 'paid'`. It works with this change; see the walkthrough below.

**Not touched:**
- the services table, the inspection template and the 56-item checklist
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
**`main` has 3 migrations, not the 4 the prompt mentions:** foundation, technician
completion and order services. There is no fourth file.
- All 3 applied in order with no errors.
- 11 tables, with RLS on for every one.
- The policies, index, trigger and checks for `repair_order_services` are as expected.
- Deleting a repair order removed its estimates, invoices and services (all to 0). This cascade was already in the schema; I only checked it.

### Walkthrough with the real `data.ts` (35/35 checks pass)
**How it was run:**
- The project's actual `src/lib/data.ts` was loaded through the project's own Vite (`ssrLoadModule`) and called through real supabase-js.
- The requests went to a small local stand-in for the Supabase REST API, written for this test and backed by a fresh PGlite database with the 3 migrations applied.
- The stand-in covers only the filters, ordering, select and response formats these calls use. Queries ran as the `authenticated` role.
- Nothing was written into the repo, and no `.env` file was created.

**Steps and results:**
- **Setup:** I created a test customer, vehicle and repair order (RO-20843) with `createCustomer`, `createVehicle` and `createRepairOrder`, the functions the UI forms call.
- **Prefill with no services:** falls back to the order: 1 h × $120 → labour 120, parts 0.
- **Prefill with services:** I added 2 services (1.5 h × $120 + $89.99 parts, and 0.5 h × $100 + $45). Estimate prefill: labour **230.00**, parts **134.99**, matching the services sums. Invoice prefill before any approval: **364.99**.
- **Create estimate:** made from the prefill with tax 18.50. Status draft, total **383.49** (labour + parts + tax). Editing the draft's tax recomputed the total (to 384.99, then back to 383.49).
- **Send, then approve:** after sending, editing amounts and deleting were both rejected. Approve worked, and approved → declined was rejected. A negative amount was rejected.
- **Create invoice:** subtotal prefill **383.49**, matching the approved estimate's total. The number was auto-filled as **INV-1001**. Status draft, total 383.49. Going straight from draft to paid was rejected.
- **Send, then mark paid:** after sending, editing amounts was rejected. Mark paid set `paid_at` to the current time. The dashboard's collected total moved from **0 to 383.49**.
- **Decline path:** a second draft estimate was declined. After that, a status change, an edit and a delete were all rejected.
- **Void path:** a second draft invoice got **INV-1002** and was voided. After that, a status change and a delete were both rejected.
- **paid → void:** this cleared `paid_at`, and the dashboard still showed 383.49, so only paid invoices are counted.
- **Draft edits and deletes:** editing a draft invoice recomputed its total (22.50). A draft invoice and a draft estimate were deleted. Deleting the paid invoice was rejected.
- **Reload:** the order detail reload showed 2 estimates, 3 invoices and 2 services.
- **Cleanup:** I deleted the order (estimates, invoices and services went to 0 through the cascade), then the customer. All test tables ended with 0 rows.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available,
  and there is no local Supabase stack (no Docker, Postgres or Supabase CLI). So
  these were not exercised by clicking:
  - the cards, forms and buttons
  - the confirm dialogs
  - the reload after each change

  The walkthrough calls the same data functions those handlers call, but the React
  code was only checked by typecheck, lint and build.
- **The REST layer was a stand-in, not real PostgREST.** Requests went through real
  supabase-js, but they were served by a minimal local server, so subtle PostgREST
  behaviour could still differ. Auth/JWT was not involved. RLS was checked
  separately at the database level.
- **No live test.** Nothing was applied to, written to or seeded in the live
  project. It stays empty.
- **Not tested at the same time from two places:** the status check that guards
  against two people changing a record at once was not exercised.
- **Tested on Node 20 with `--experimental-websocket`.** This only applies to the
  test harness, because supabase-js needs a WebSocket in Node. Browsers have one built in.

Not opened as a PR, not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
