# Stage 2, prompt 6: Earnings

Branch: `feat/earnings-20261116` (base: `main` @ `ed77f4c`, Stage 2 prompt 5 / timelogs merged as PR #6)

Before starting I checked that `origin/main` is at `ed77f4c`, "Stage 2: timelogs
(#6)". Its code is identical to the timelogs branch.

## What was built

There's a read-only Earnings page:
- four collected-money cards (Today, This Week, This Month, All Time), each with the number of paid invoices
- an Outstanding card for sent invoices not yet paid
- a Recent paid invoices list

Everything is worked out in code from the existing `invoices` rows. Nothing is
written to the database, and nothing creates a notification.

**No migration.** Every field used already exists on `invoices`: `status`,
`total`, `paid_at`, `invoice_number` and `repair_order_id`. Customers and order
numbers come in through the joins `repair_orders` → `customers`. No migration file
was added; there are still 5.

### Exact definitions
These are all in the browser's local time.

- **Paid invoice:** `status = 'paid'` **and** `paid_at` is set.
- **Collected for a period:** the sum of `total` over paid invoices whose `paid_at` is ≥ the period start and < the next period's start.
  - **Today:** local midnight → next midnight.
  - **This Week:** Monday 00:00 → the following Monday 00:00. The week starts on Monday.
  - **This Month:** the 1st 00:00 → the 1st of next month 00:00 (the calendar month).
  - **All Time:** no date filter.
- **Paid count for a period:** the number of invoices counted in that period's sum.
- **Outstanding:** the sum of `total` over invoices with `status = 'sent'`.
- **Draft and void invoices are excluded from every figure.** A paid invoice that is later voided has its `paid_at` cleared by the existing `updateInvoice`, so it drops out of every collected figure and the recent list.
- **Totals are rounded to cents** after summing.

### `src/lib/types.ts`
- **`EarningsSummary`:** `collectedToday`, `collectedThisWeek`, `collectedThisMonth`, `collectedAllTime`, `outstanding`, `paidCountToday`, `paidCountThisWeek`, `paidCountThisMonth`, `paidCountAllTime`.
- **`PaidInvoiceRow`:** `id`, `invoice_number`, `total`, `paid_at`, `ro_number`, `customer_name`, plus **`repair_order_id`**. The prompt's field list didn't include `repair_order_id`, but each row has to link to its repair order, and that needs the order's id. This is the only addition beyond the prompt's list.

### `src/lib/data.ts` (additions only; no existing line changed)
- **`earningsPeriods(now?)`:** the local-time period boundaries. It's exported so the walkthrough can check the boundaries directly.
- **`fetchEarningsSummary(now?)`:** one read of `invoices` where status is `paid` or `sent` (`status, total, paid_at`), summed in code. `now` defaults to the current time and can be passed in for testing.
- **`fetchRecentPaidInvoices(limit = 20)`:**
  - paid invoices with `paid_at` set, newest `paid_at` first
  - each joined `repair_orders(id, ro_number, customers(id, name))`, the same nested-join pattern as `fetchTimelogs`
  - flattened into `PaidInvoiceRow`
- **Unchanged:** `updateInvoice`, the invoice status transitions, the notification events and `fetchDashboardStats`.

### Earnings page (`src/pages/Earnings.tsx`)
- **Summary cards:**
  - four period cards, each showing the total with `money()` and "N paid invoice(s)"
  - one Outstanding card ("Sent invoices not yet paid")
  - a line on the page states the definitions, including "local time; weeks start Monday"
- **Recent paid invoices:**
  - each row shows the invoice number, customer, RO number, total and paid date/time
  - the whole row links to that repair order's detail page
  - when nothing has been paid yet, an empty state says so
- **Loading and errors:** the same `LoadingState` and `ErrorBanner` as the other pages.
- **No new money formatting:** it uses the existing `money()` and `formatDateTime()`.

### Navigation
- **Routing:** `earnings` is added to the `View` type, to `NAV_ITEMS` (after Timelogs, matching the reference order Orders | Appointments | Notifications | Timelogs | Earnings) and to the view switch in `src/App.tsx`.
- **Mobile:** the bottom nav now has seven items and uses the same sideways-scroll pattern as before. Only its comment changed.

**Not touched:**
- timelogs, appointments, estimates, customers and inspections
- auth
- invoice behaviour and the Dashboard
- migrations and `seed.sql`

There are no new dependencies.

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings. The baseline on `main` was also 0, so there are no new findings.
- `npm run build` (`tsc --noEmit && vite build`): OK.

### Earnings walkthrough with the real `data.ts` (31/31 checks pass)
**How it was run:** the same harness as for prompts 2–5.
- The project's actual `src/lib/data.ts` was loaded through the project's own Vite and called through real supabase-js.
- The requests went to a small local stand-in for the Supabase REST API, backed by a fresh PGlite database with all 5 migrations. The stand-in gained a `not.is.null` filter for this prompt.
- Queries ran as the `authenticated` role.
- **"Now" was fixed at Wed 18 Nov 2026, 2:00 PM local** (US Pacific on the test machine), so the periods are deterministic.

**Period boundaries:**
- Today is Wed 18 00:00 → Thu 19 00:00. The week is Mon 16 → Mon 23. The month is 1 Nov → 1 Dec.
- On a Sunday (22 Nov) the week starts Mon 16, and on a Monday it starts that day.
- 1 Jan 2027 (a Friday) gets the week starting Mon 28 Dec 2026, across the year change.

**Empty database:** every figure was 0 and the recent list was empty.

**Fixture.** Each paid invoice went through the real create → send → pay path, then
its `paid_at` was set to the fixture time:

| invoice | paid at (local) | total |
|---|---|---|
| i1 | today 10:00 | 100.00 |
| i2 | Mon 16 Nov 00:00 (week boundary) | 200.50 |
| i3 | Sun 15 Nov 23:30 (this month, not this week) | 50.00 |
| i4 | 1 Nov 00:00 (month boundary; also the day US daylight saving ended) | 75.25 |
| i5 | 28 Oct (last month) | 300.00 |
| i6 | 31 Oct 23:59 (last month boundary) | 10.00 |

There was also one **sent** invoice (400.00), one **draft** (999.00) and one **void** (888.00, voided from draft).

**Results, recomputed by hand:**

| figure | expected | result |
|---|---|---|
| Today | 100.00 (1 paid) | ✔ |
| This Week | 100 + 200.50 = **300.50** (2 paid; Monday 00:00 counts, the Sunday before does not) | ✔ |
| This Month | 100 + 200.50 + 50 + 75.25 = **425.75** (4 paid; 1 Nov 00:00 counts) | ✔ |
| All Time | 425.75 + 300 + 10 = **735.75** (6 paid) | ✔ |
| Outstanding | the sent invoice only: **400.00** | ✔ |
| **Dashboard `collectedPaidInvoices`, same rows** | **735.75**, equal to All Time | ✔ |
| Draft 999 / void 888 | contribute nothing | ✔ |

**Recent paid list:**
- It came back newest paid first: INV-1001, 1002, 1003, 1004, 1006, 1005.
- Every row had the right customer and order: Alice/RO-20843 or Bob/RO-20844.
- Each row has its `repair_order_id`, its total and its paid date.
- Sent, draft and void invoices are not in the list. `limit` 3 returned the newest 3.

**Read-only:** loading the summary and the list changed no invoice rows (same
status, total, `paid_at` and `updated_at`) and created no notifications.

**Paid, then voided:**
- I paid a 555.00 invoice today at 12:00. While paid, Today was 655.00 with 2 paid, and it sat at the top of the recent list.
- I then voided it through the real `updateInvoice`. Its `paid_at` was cleared.
- Every collected figure went back to 100 / 300.50 / 425.75 / 735.75, with 6 paid. Outstanding stayed 400.00.
- It left the recent list, and the Dashboard still showed 735.75.

**Invoice notifications are still one per transition:** 8 sent, 7 paid, 2 void, which matches the transitions made.

**Cleanup:** all test data was deleted. Every table ended with 0 rows.

### Regression (same bar as before)
- **Appointments: 39/39.**
- **Estimates/invoices: 35/35.**
- **Notifications: 55/55.** Invoice sent, paid and void each still create exactly one notification, and every listed event still creates exactly one.
- **Timelogs: 34/34.**
- **Fresh-database migration check:** all 5 migrations apply, with 13 tables and RLS on every one. It still passes.

No regression script needed changing this time, because there's no new migration.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available,
  and there is no local Supabase stack. These were not exercised by clicking:
  - the Earnings cards and recent list
  - the row links
  - the seven-item mobile nav

  The React code was only checked by typecheck, lint and build.
- **The REST layer was a stand-in, not real PostgREST.** Requests went through real
  supabase-js, but a minimal local server answered them. That includes the nested
  join and the `not.is.null` filter.
- **Only one time zone was tested** (US Pacific). The figures use the viewer's
  browser time zone, so two people in different time zones can see different
  Today / Week / Month figures for the same data. All Time and Outstanding don't
  depend on time zone.
- **Nothing applied live and nothing deployed.** There's no migration to apply for this PR.

## Open items / choices worth checking

1. **Week start:** I used **Monday**, as the prompt asked, and it matches the ISO week. Changing to Sunday would be a one-line change in `earningsPeriods`.
2. **Time zone:** the browser's local time, as the prompt asked. The shop has no time-zone setting yet. If one is added later, `earningsPeriods` is the single place to change.
3. **The Dashboard's definition is looser than Earnings'.** `fetchDashboardStats` counts `status = 'paid'` without checking `paid_at`. Earnings also requires `paid_at` to be set, as the prompt defines it.
   - They agree for every row written through the app, because `updateInvoice` always sets `paid_at` on paid and clears it on leaving paid. The walkthrough proves that on the fixture.
   - A paid row with no `paid_at`, which could only come from a direct database edit, would count on the Dashboard but not on Earnings.
   - I didn't change the Dashboard, because this prompt is read-only Earnings work. Adding `.not('paid_at', 'is', null)` to the Dashboard query would make the two identical by construction.
4. **`PaidInvoiceRow.repair_order_id`** was added beyond the prompt's field list, so each row can link to its order.
5. **The recent list shows the newest 20.** There's no "load more" or date filter yet.
6. **Collected totals are only as good as `paid_at`.** If someone marks an invoice paid days late, it counts on the day it was marked paid. There's no separate "payment received" date.

Not opened as a PR (Muse opens it), not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
