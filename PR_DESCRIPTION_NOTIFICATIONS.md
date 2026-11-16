# Stage 2, prompt 4: In-app notifications

Branch: `feat/notifications-20261116` (base: `main` @ `92e1e72`, Stage 2 prompt 3 / appointments merged as PR #4)

The prompt said to start only after appointments were merged. I checked that before
starting: `origin/main` is at `92e1e72`, "Stage 2: appointments UI (#4)". Its code
is identical to the prompt 3 branch, and `src/pages/Appointments.tsx` is there.

## What was built

The app now has in-app notifications: a Notifications page, plus an unread count
next to Notifications in the desktop sidebar and the mobile bottom nav.

There is no push, email or SMS. No external service was added, configured or called.

### Migration `20261116010000_notifications.sql` (new file; existing migrations untouched)
- **Table `notifications`:**

  | column | definition |
  |---|---|
  | `id` | uuid PK, default `gen_random_uuid()` |
  | `created_at` | timestamptz NOT NULL, default `now()` |
  | `type` | text NOT NULL |
  | `title` | text NOT NULL |
  | `body` | text, nullable |
  | `related_type` | text, nullable, with a check limiting it to `repair_order` / `appointment` / `customer` / `estimate` / `invoice` |
  | `related_id` | uuid, nullable |
  | `is_read` | boolean NOT NULL, default false |
  | `read_at` | timestamptz, nullable |

- **No foreign key on `related_id`.** It can point at one of several tables. A notification is also kept when its record is later deleted; the page tells the user the record is gone.
- **Index** on `(is_read, created_at DESC)`.
- **RLS:** turned on, with the same `authenticated_full_access` policy as every other table.
- **No seed rows.** No other table is touched.

### `src/lib/types.ts`
- `NotificationType`: the 9 event types, and nothing else.
- `NotificationRelatedType`.
- `AppNotification`, named so it doesn't shadow the browser's built-in `Notification`.

### `src/lib/data.ts`
These follow the existing `throwIfError` / `requireClient` patterns.

**Reading and managing notifications**
- **`fetchNotifications()`:** unread first, then newest first (`is_read` ascending, `created_at` descending).
- **`fetchUnreadNotificationCount()`:** a head count of rows where `is_read` is false.
- **`markNotificationRead(id)`:** sets `is_read` and `read_at`. If the notification is already read, its original `read_at` is kept.
- **`markAllNotificationsRead()`.**
- **`deleteNotification(id)`:** if the notification is already gone, it reports that.
- **`resolveNotificationTarget(n)`:** works out where a notification should open.
  - A repair order, appointment or customer opens that record.
  - An estimate or invoice opens its repair order.
  - It returns null if the record no longer exists.

**Creating notifications**
- **`notify()`:** an internal function that isn't exported. It is the only code that inserts notification rows.
  - It's best-effort. The event's own change is already saved when it runs, so if the insert fails, the error is logged and not thrown. Otherwise a saved booking or payment would look like it failed.
- **Event sites.** These five functions are the only callers of `notify()`, which I confirmed by grep:

  | function | when | notification type | links to |
  |---|---|---|---|
  | `createAppointment` | booked | `appointment_created` | the appointment |
  | `updateAppointment` | moved to cancelled or no-show | `appointment_cancelled` | the appointment |
  | `updateEstimate` | moved to sent / approved / declined | `estimate_sent` / `estimate_approved` / `estimate_declined` | the repair order |
  | `updateInvoice` | moved to sent / paid / void | `invoice_sent` / `invoice_paid` / `invoice_void` | the repair order |
  | `updateRepairOrderStatus` | actually moved into waiting for approval or waiting for parts | `order_waiting` | the repair order |

  Setting the same waiting status again doesn't create a second notification.

  Example titles:
  - "Appointment booked — {customer}"
  - "Appointment marked no-show — {customer}"
  - "Estimate sent — RO-20843"
  - "Invoice INV-1001 paid — RO-20843"
  - "RO-20843 is waiting for parts"

  The body shows the appointment time and service, the total, or the status change.
- **No notifications** for services, inspections, customers, vehicles, creating an order, marking work complete, the dashboard, confirming or starting an appointment, or draft estimate/invoice edits.

**Behaviour changes to existing functions.** These are the only changes besides the inserts:
- `updateAppointment` reads the current row with the customer joined, so the notification can name the customer. The rules are unchanged.
- `updateRepairOrderStatus` reads the previous status first, but only when the target is one of the two waiting statuses. If that read fails, for example because the order doesn't exist, it now reports "Failed to load repair order". Before, it silently updated nothing.

### Bundled fix (from the PR #4 review)
`createAppointment` now rejects a `repair_order_id` that belongs to a different
customer: "That repair order doesn't belong to this customer." The UI can't produce
this case, so the check is defence in depth. Linking to the same customer's order
still works.

### Notifications page (`src/pages/Notifications.tsx`)
Added to the view routing in `src/App.tsx` and to both navs in
`src/components/Layout.tsx`, between Appointments and Customers.

**The list**
- An **Unread** section comes first, then **Read**. Each is newest first.
- **Each row shows:**
  - the title, body and time
  - a blue dot and outline while it's unread
  - Mark read (unread rows only) and Delete (asks for confirmation)

**Opening a notification**
- It marks the notification read and opens the record: a repair order opens the order page, an appointment opens the Appointments page scrolled to that appointment with it highlighted, and a customer opens the Customers page scrolled to that customer.
- If the record no longer exists, the page's `ErrorBanner` says "The {appointment / repair order / …} this notification refers to no longer exists.", and the notification is left as it was, still unread.

**Other**
- A **Mark all read** button. Errors show in the page's `ErrorBanner`.
- **`Appointments.tsx`** takes an optional `focusAppointmentId` for that highlight. Booking and listing appointments work the same as before.

### Unread badge
- A blue count appears next to Notifications in the desktop sidebar and the mobile bottom nav. It shows "99+" above 99.
- **When it refreshes:**
  - when the app loads after sign-in
  - after mark read, mark all read and delete on the Notifications page
  - when opening a notification
  - on each navigation

  I added the refresh on navigation so new events, such as a booking, show up without reloading the page. It's one count query per page change, not a timer. Nothing polls.

**Not touched:**
- the services table, the inspection template and the 56-item checklist
- Auth and the login flow
- the Assigned/Completed rule
- existing migrations and `seed.sql`

The estimate, invoice and appointment rules are unchanged, apart from the inserts
and the two reads described above. There are no new dependencies.

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings. The baseline on `main` was also 0, so there are no new findings.
- `npm run build` (`tsc --noEmit && vite build`): OK.

### Fresh scratch database
This used PGlite, an in-process Postgres installed only in a temporary folder.
- All 4 migrations applied in order with no errors: foundation, technician completion, order services, notifications.
- 12 tables, with RLS on for every one.
- `notifications` has the `authenticated_full_access` policy (ALL, authenticated, `true`/`true`) and the `(is_read, created_at DESC)` index.
- A `related_type` outside the allowed list is rejected.

### Notifications walkthrough with the real `data.ts` (55/55 checks pass)
**How it was run:** the same harness as for prompts 2 and 3. The project's actual
`src/lib/data.ts` was loaded through the project's own Vite and called through real
supabase-js. The requests went to a small local stand-in for the Supabase REST API,
backed by a fresh PGlite database, running as the `authenticated` role.

**Steps and results:**
- **Setup creates nothing:** creating customers, vehicles and orders, adding and finishing a service, loading the dashboard and loading order detail created 0 notifications. The unread count started at 0.
- **Bundled fix:**
  - Booking customer A's appointment against customer B's order was rejected, with no appointment and no notification created.
  - Booking against A's own order worked.
- **Every event created exactly one notification, with the right title, and its link resolved to the right record:**
  - booked → `appointment_created`: "Appointment booked — TEST customer A …"
  - cancelled → `appointment_cancelled`
  - no-show → `appointment_cancelled`: "Appointment marked no-show — …"
  - estimate sent / approved / declined: "Estimate sent — RO-20843" and so on
  - invoice sent / paid / voided: "Invoice INV-1001 paid — RO-20843" and so on
  - order to waiting for approval, then to waiting for parts: "RO-20843 is waiting for parts"
- **These created no notification:**
  - confirming an appointment
  - creating or editing a draft estimate
  - setting the same waiting status again
  - moving an order to `invoice`
  - marking work complete
- **Final tally:** exactly the 9 event types, 13 rows. That includes one booking notification for each of the 3 appointments booked.
- **Unread count:**
  - It started at 13.
  - Marking one read took it to 12 and set `read_at`.
  - The list came back unread first, then read, newest first within each group.
  - Marking an already-read notification read kept its `read_at`.
- **Opening a notification:** `invoice_paid` resolved to the repair order and was marked read, and the count went to 11.
- **Deleted record:** after deleting an appointment, its notification resolved to "no longer exists" and stayed in place, still unread.
- **Mark all read, then delete:** mark all read took the count to 0, with `read_at` set on every row. Deleting one removed it, and deleting it again said it was already deleted.
- **Best-effort insert:** with the insert permission on `notifications` revoked, booking an appointment still succeeded. No notification was written, and the error was logged.
- **Cleanup:** all test data was deleted. Every table ended with 0 rows.

### Regression
Both re-runs had the notifications table present, so the new inserts ran during them.
- **Appointments walkthrough: 39/39 pass.** Covered:
  - booking, and the confirm → start → complete path
  - cancel, no-show, and the edit/delete rules
  - bad time ranges
  - order delete setting `repair_order_id` to NULL, and customer delete removing appointments
  - the dashboard
- **Estimates/invoices walkthrough: 35/35 pass.** Covered:
  - prefill and the tax-edit total
  - INV numbers
  - paid/void and `paid_at`
  - the dashboard's collected total going from 0 to 383.49
  - the terminal statuses and draft-only deletes

  No notification insert failed during either run.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available,
  and there is no local Supabase stack (no Docker, Postgres or Supabase CLI). These
  were not exercised by clicking:
  - the Notifications page and the badge in both navs (including mobile width)
  - clicking through to a record, and the appointment highlight and scroll
  - the confirm dialogs

  The walkthrough calls the same data functions the page uses, but the React code
  was only checked by typecheck, lint and build.
- **The REST layer was a stand-in, not real PostgREST.** Requests went through real
  supabase-js, but a minimal local server answered them, so subtle PostgREST
  behaviour could still differ. Auth/JWT was not involved. RLS was checked at the
  database level.
- **The badge only updates on navigation and after Notifications actions.** A
  notification created by another user, or by an action that doesn't navigate,
  won't show until the next page change. This is by design (no timer polling).
- **No live test.** Nothing was applied to, written to or seeded in the live
  project. It stays empty. **Before deploying, apply
  `20261116010000_notifications.sql` to the live project.** Without it, the
  Notifications page shows an error and the badge stays at 0. The event actions
  still work, because a failed notification insert is only logged.
- **Tested on Node 20 with `--experimental-websocket`.** This only applies to the
  test harness, because supabase-js needs a WebSocket in Node.

Not opened as a PR, not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
