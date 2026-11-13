# Stage 2, prompt 1: Order services + wrench counter

Branch: `feat/order-services-20261113` (base: `main` @ `532fcfb`, Stage 1 PR #1)

## What was built

Repair orders now have **services**: line items such as "Brake pad replacement",
each with its own labour hours × rate, parts total, and a done flag. Service
progress (done/total) shows up on the order cards and in the Services tab, like
the wrench counter in the reference app. The project's own dark slate/blue design
is used. No AutoLeap branding, logo or teal was copied.

- **Migration `20261113010000_order_services.sql`** adds a new table,
  `repair_order_services`. See the Migration section below.
- **`src/lib/types.ts`**
  - New `OrderService` interface that mirrors the table.
  - New `ServiceCounts { total; done }` type.
- **`src/lib/data.ts`** (uses the existing `throwIfError` / `requireClient` patterns)
  - `fetchOrderServices(repairOrderId)`: ordered by `position`, then `created_at`.
  - `createOrderService(input)`: sets `position` to the order's highest existing position + 1, or 0 for the first service.
  - `updateOrderService(id, updates)`: can update name, description, labor_hours, labor_rate, parts_total and is_done.
  - `deleteOrderService(id)`.
  - `fetchServiceCountsByRepairOrder()`: returns `Record<repairOrderId, ServiceCounts>`, the same shape as `fetchInspectionCountsByRepairOrder`. It runs one query and counts in the client.
  - `RepairOrderDetail` now includes `services: OrderService[]`. `fetchRepairOrderDetail` loads them in the same `Promise.all` as estimates, invoices and the inspection.
- **Order detail, Services tab (`src/pages/RepairOrderDetail.tsx`)**: the
  "Services arrive in Stage 2" EmptyState is replaced by a `ServicesTab` component.
  - **Header:** shows 🔧 Services done/total, plus the summed labour, parts and total for the listed services.
  - **Each service shows:**
    - its name and description
    - labour as `hours h × rate = amount`, and the parts total
    - a Done / Not done toggle (done services are struck through)
    - Edit (inline form) and Delete (asks for confirmation first)
  - **Add service form:**
    - fields: name (required), description, labour hours, labour rate and parts total
    - built from the existing `Field`, `PrimaryButton`, `SecondaryButton`, `inputClassName` and `EmptyState` components
  - **After every change** (add, edit, toggle or delete), the page reloads the
    order detail, the same way the status and notes handlers do, so the counts
    update right away. Errors show in the page's existing `ErrorBanner`.
- **Orders list (`src/pages/RepairOrders.tsx`)**
  - Each card shows "🔧 Services done/total", or "No services yet" when the order has no services. This sits above the existing "Inspection marked/total" row.
  - The counts are loaded with `fetchServiceCountsByRepairOrder` in the same `useEffect` that already loads the inspection counts. The two calls run in parallel.

Not touched: the inspection template, the 56-item checklist, Auth and the login
flow, the Assigned/Completed tab rule (still based on technician completion),
`supabase/seed.sql` and README.md. The README's "What is NOT in Stage 1" section
still lists the Services tab, because that section describes Stage 1.

## Migration: `repair_order_services`

| column | type | notes |
|---|---|---|
| `id` | uuid PK | `default gen_random_uuid()` |
| `repair_order_id` | uuid NOT NULL | FK → `public.repair_orders (id)` **ON DELETE CASCADE** |
| `name` | text NOT NULL | |
| `description` | text | nullable |
| `labor_hours` | numeric(6,2) NOT NULL | default 0, `check >= 0` |
| `labor_rate` | numeric(10,2) NOT NULL | default 0, `check >= 0` |
| `parts_total` | numeric(10,2) NOT NULL | default 0, `check >= 0` |
| `is_done` | boolean NOT NULL | default false |
| `position` | integer NOT NULL | default 0 |
| `created_at` / `updated_at` | timestamptz NOT NULL | default now() |

- **Index:** `repair_order_services_repair_order_id_idx` on `repair_order_id`.
- **`updated_at` trigger:** `set_repair_order_services_updated_at`, using the existing `public.set_updated_at()`.
- **RLS:** turned on, with the same `authenticated_full_access` policy as every other table (`for all to authenticated using (true) with check (true)`). Anonymous users get nothing.
- **Additive only:** no existing table is changed and there are no secrets in the file.
  - The file contains `drop trigger if exists` / `drop policy if exists`. Like the Stage 1 file, these only make the script safe to re-run, and they only touch the new table's own trigger and policy. No data is deleted or dropped.
- **Not applied to the live project.**

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings. The baseline on `main` was also 0, so there are no new findings.
- `npm run build` (`tsc --noEmit && vite build`): OK.

### Migration on a fresh scratch database
This used PGlite, which is real Postgres running in-process. It was installed in a
temporary folder only and is **not** a project dependency. The `anon` and
`authenticated` roles were created first, as Supabase provides them.

- All 3 migrations applied in order with no errors.
- 11 tables were created, and RLS is on for every one of them.
- Column types, nullability and defaults match the spec.
- There is exactly one policy, `authenticated_full_access` (ALL, authenticated, `true`/`true`).
- The `repair_order_id` index exists.
- The foreign key is `ON DELETE CASCADE`.
- Defaults are 0 / 0 / 0 / false / position 0.
- The `>= 0` checks reject -1 on hours, rate and parts, and a NULL `name` is rejected.
- The `updated_at` trigger updates the timestamp.
- **Cascade:** deleting a repair order with 3 services deleted all 3 (3 → 0).
- `repair_orders` still has the same 18 columns, so it was not changed.

### Walkthrough on the local database (data level, not the UI)
This ran on the same kind of fresh local Postgres, as the `authenticated` role so
that RLS applied. It repeats the queries in the new `data.ts` functions and the
same done/total counting the order card uses.

- The `anon` role cannot write (RLS works).
- I created a test customer, vehicle and repair order (RO-20843). Before any services were added, the card text was "No services yet".
- I added 3 services. Their positions were 0, 1 and 2 (highest + 1), and the list was in position order.
- I marked 1 as done. Both the card text and the tab text read **Services 1/3**. Tab totals: labour $315.00, parts $134.99.
- I changed one service's hours from 1.5 to 2, and the change saved.
- I deleted one service. Both the card and the tab updated to **Services 1/2**.
- Cleanup: deleting the order removed its services through the cascade. I then deleted the customer, and all test tables were back to 0 rows.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available
  in this session. I also could not run a local Supabase stack: there is no
  Docker, Postgres or Supabase CLI on the machine, and downloading the PostgREST
  binary was blocked. So these were not tested end to end:
  - the Services tab and order-card rendering
  - the add, edit and delete forms
  - the confirm dialog
  - the page reload after each change
  - requests going through supabase-js and PostgREST

  The walkthrough above tests the database queries and the counting logic, not
  the React UI or the HTTP layer.
- **No live test.** The live project was not touched in any way. No test rows
  were written to it, and nothing was seeded. There are no live credentials on
  this machine (`.env.local` does not exist), and the live database must stay empty.
- **The migration has not been applied live.** It must be applied to the live
  project before this is deployed. Otherwise the Orders page and Order detail will
  fail with an error for the missing `repair_order_services` table.
- `createOrderService` reads the highest position and then inserts. If two people
  add a service to the same order at the same moment, both services can get the
  same position. Nothing breaks, because ordering falls back to `created_at`.
- Totals on the Services tab are only the sum of the listed services. They are
  separate from the order-level `labor_hours` / `labor_rate` / `parts_total`
  columns, which are unchanged. Estimates and invoices don't use services yet.

Not opened as a PR, not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
