# Stage 2, prompt 10: edit + delete customers/vehicles, printable + sendable invoices

Branch: `feat/customer-edit-delete-invoice-20261117` (base: `main` @ `571695d`, Stage 2 prompt 9 / Repair Guides merged as PR #10)

**Precondition checked before building.** I checked out `main` and pulled. It was already
up to date at `571695d`, "Stage 2: repair guides (shop-entered library) (#10)".
`src/pages/RepairGuides.tsx` exists, and `src/components/Layout.tsx` has the `guides` nav item
(`{ name: 'guides' }` in `View`, `{ name: 'guides', label: 'Repair Guides' }` in `NAV_ITEMS`).
The branch was cut from that commit.

## What was built

Two gaps the shop hit while entering real data:
- A customer or vehicle could not be fixed or removed after it was typed in.
- An invoice could not be printed or sent.

Added on request: a **default WhatsApp country code** setting (section 5).

**One migration, additive only:** a one-row `shop_settings` table for the WhatsApp country
code. There's no new npm dependency, no backend and no secrets. The foreign keys were left
exactly as they are.

### 1. Data functions: `src/lib/data.ts`
They follow the existing pattern: `requireClient()`, `.from(...)`, `throwIfError(error, 'Failed to …')`.
All writes go through them.

- `updateCustomer(id, input)` saves name, phone, email and notes, and returns the saved row.
  An id that no longer exists gets "That customer no longer exists."
- `deleteCustomer(id)` **checks first and refuses, deleting nothing**, in two cases:
  - The customer has repair orders: "This customer has repair orders and cannot be deleted."
  - One of the customer's vehicles is on a repair order **of another customer**: "One of this
    customer's vehicles has repair orders, so the customer cannot be deleted." Without this
    check the cascade to that vehicle would hit the vehicle's RESTRICT key and fail with a
    database error.

  Otherwise it deletes the customer. Their vehicles and appointments go with them (cascade).
  A second delete gets "That customer was already deleted."
- `updateVehicle(id, input)` saves every add-vehicle field and returns the saved row.
- `deleteVehicle(id)` refuses when the vehicle has repair orders: "This vehicle has repair
  orders and cannot be deleted." Otherwise it deletes the vehicle; its appointments stay,
  with the vehicle cleared (set null).
- **No raw database error reaches the screen.** If an order is added between the check and
  the delete, the database refuses with a foreign-key error (`23503`). That error is mapped
  to the same plain reason.
- `validateCustomer` and `validateVehicle` run inside update **before any request**
  (`validateVehicle` also runs inside `createVehicle`). If they
  throw, nothing is sent.
  - **Customer:** the name is required, and spaces alone count as empty. The email, when
    set, must have the same shape the CSV import checks (`x@y.z`). Values are trimmed, and
    blanks are stored as null.
  - **Vehicle:** make and model are required. The year, when set, must be a whole year from
    **1900 to next year** (2027 today). The mileage, when set, must be a whole number ≥ 0.
    Values are trimmed, and blanks are stored as null.

**The foreign keys** were verified against the migrated schema (walkthrough below) and not
changed:

| Column | Rule |
|---|---|
| `vehicles.customer_id` | cascade |
| `appointments.customer_id` | **cascade** |
| `repair_orders.customer_id` | restrict |
| `repair_orders.vehicle_id` | restrict |
| `appointments.vehicle_id` | set null |

`appointments.customer_id` (line 203) was not in the prompt's list. Because it cascades,
deleting a customer also deletes their appointments, and the confirm text says so.

### 2. Customers page: `src/pages/Customers.tsx`
- **Each customer card** gets **Edit** and **Delete**.
  - **Edit** opens the same four fields as create, prefilled, inline in the card.
  - **Delete** asks: 'Delete customer "Name"? Their 2 vehicles and appointments are deleted
    too. This cannot be undone.'
- **Each vehicle** gets **Edit** and **Delete**.
  - **Edit** opens the same nine fields as add-vehicle, prefilled. The year input's max is
    next year.
  - **Delete** asks: 'Delete vehicle "2019 Mazda 3"? Its appointments stay, with the vehicle
    cleared. This cannot be undone.'
- A failed save or delete shows the reason in a red banner **on that customer's card**. An
  edit form stays open with what was typed, and nothing is changed.
- After a successful edit or delete, the list reloads straight away.
- **Shared form fields:** the customer and vehicle fields are now components used by both
  create and edit (`CustomerFormFields`, `VehicleFormFields`). Create customer behaves
  exactly as before.
- **Add vehicle now follows the same rules as edit:** years 1900 to next year (it used to
  allow up to 2100). The year input's max is next year, and `createVehicle` runs the same
  `validateVehicle` before any request.
  - A refused add shows the reason in the page's error banner, keeps what was typed, and
    saves nothing.
  - The CSV import also calls `createVehicle`. It already checks the same rules before
    calling, so its results don't change (see Regressions).

### 3. Printable invoice: `src/lib/invoiceDocument.ts` (new) + `src/components/InvoicePrintView.tsx` (new)
- Every invoice in the Invoices card gets a **Print** button, whatever its status. It opens
  the print view and starts the browser's print flow once.
- **Lazy loading:** the view loads on demand (`React.lazy`), so the main chunk stays under
  500 kB.
- **`buildInvoiceDocument(order, invoice)`** is a pure function. The page renders exactly what
  it returns. The printed invoice shows:
  - the word **Invoice**
  - the invoice number (`INV-…`), the invoice date, and the status
  - **Bill to:** name, plus phone and email when they're on file
  - **Vehicle:** year, make, model and trim, plus the plate when it's on file
  - **Labor** (the order's hours × rate, for example "2.5 hrs × $120.00/hr  $300.00") and
    **Parts** (the order's parts total)
  - **Subtotal**, **Tax** and **Total** from the invoice as stored
  - **Payment status**, for example "Paid on Nov 16, 2026", "Sent · not yet paid", "Draft"
    or "Void"

  All amounts use `money()`, like the rest of the app.
- **No line items are invented.** If the stored subtotal isn't labor + parts (it was edited
  on the draft), the lines stay as the order has them. The invoice's own subtotal, tax and
  total print as what's owed, with the label "Subtotal (as invoiced)". An on-screen-only
  note tells the shop why.
- **No shop name, address, logo or phone** appears, because none is stored.
- **Print stylesheet** (`src/index.css`, `@media print`):
  - While the view is open, `<html>` has `.invoice-print-open`. The view is rendered as a
    direct child of `<body>`, outside `#root`.
  - On paper, everything else in `<body>` is hidden: the top bar, sidebar, bottom nav, page
    and buttons.
  - The toolbar (`.no-print`) is hidden.
  - The overlay becomes static and white.
  - Every element on the invoice prints pure black on white, with 15 mm page margins.

### 4. Send the invoice (same view)
There's no new service, and **the app never sends anything itself.** Both buttons open the
shop's own email or WhatsApp.

- **Send via email** is a `mailto:` link to the customer's stored email.
  - **Subject:** `Invoice INV-…`.
  - **Body:** a greeting, the invoice number and date, the vehicle (with plate), the total,
    and the payment status.
  - Encoded with `encodeURIComponent`, so spaces don't turn into "+" in mail apps.
- **Send via WhatsApp** is a `https://wa.me/<digits>?text=…` link, opened in a new tab,
  with the same summary.
  - **The number:** built from the stored phone and the shop's default country code
    (section 5). The view always says which number WhatsApp will open, and why.
- **When a contact is missing,** that button is disabled. The reason shows as text and as
  the button's tooltip: "No email on file for this customer." / "No phone on file for this
  customer."
- **When a stored value can't be used,** the button is also disabled with a reason: an email
  that isn't email-shaped, or a phone with letters such as "ext 2".
- **PDF note:** one line on the view says "The app doesn't attach the PDF: print this invoice
  to PDF first, then attach it to the email or WhatsApp message before sending."

### 5. Default WhatsApp country code (added on request)
**Decided with the shop:**
- The setting is saved in the **database**, so it's set once for every device.
- Phones are read with the **drop-leading-0** rule.

**Migration `supabase/migrations/20261117010000_shop_settings.sql` (new):**
- **Version** `20261117010000` comes after the latest existing `20261116030000`.
- **Table `shop_settings`:**
  - `id` integer, primary key, default 1, **check `id = 1`**, so a second row is impossible
  - `whatsapp_country_code` text, null = not set, with a database check for 1–3 digits
    not starting with 0 (stored without "+")
  - `created_at`, `updated_at`
- **The single row** (id 1, code not set) is created by the migration with
  `on conflict do nothing`, so re-running it is harmless. The app only reads and updates
  that row.
- **`updated_at` trigger,** reusing `public.set_updated_at()`.
- **RLS on**, with the same `authenticated_full_access` policy as every other table.
- Additive only: no existing table is changed.

**Data functions (`src/lib/data.ts`):**
- `fetchShopSettings()`.
- `updateWhatsAppCountryCode(value)`.
- `cleanCountryCode(value)` runs before any request:
  - "+44", "44" and " + 44 " all become "44"
  - blank clears the code (null)
  - anything else must be 1–3 digits not starting with 0, otherwise it's refused with
    "A country code is 1 to 3 digits, like 44 or 1 (no leading 0)."
  - A lone "+" is refused too, rather than read as blank, so it can't clear the code by
    accident.
- A missing row gets "Shop settings are missing. The shop settings migration may not be
  applied yet."

**Number rule (`resolveWhatsAppNumber` in `src/lib/invoiceDocument.ts`):** spaces, dashes and
brackets are removed first. Then:

| Stored phone | Default code | wa.me number | Why |
|---|---|---|---|
| `+44 20 7946 0018` | any | `442079460018` | already international ("+") |
| `0044 20 7946 0018` | any | `442079460018` | already international ("00") |
| `020 7946 0018` | 44 | `442079460018` | one leading 0 dropped, +44 added |
| `7946 0018` | 44 | `4479460018` | +44 added |
| `020 7946 0018` | not set | `02079460018` | digits as stored, as before |

- **The stored phone is never changed.** Only the link is built this way.
- **One behavior change from the first version of this branch:** a phone stored as
  `0044 …` now opens `44…` even with no default set. Before, it opened `0044…`, which
  wa.me doesn't accept. `00` is the international dialling prefix, so this adds nothing
  that wasn't stored.

**On the invoice view** (toolbar only, never printed):
- **A setting box:** "Default WhatsApp country code: + [  ] Save".
  - It's prefilled from the database.
  - **Save** is disabled while the box matches the stored value.
  - After a save it shows "Saved for all devices.", and the WhatsApp link updates straight
    away.
  - A refused value shows its reason and changes nothing.
- **The hint says exactly which number opens:**
  - "WhatsApp opens to 442079460018: the default +44 was added to the stored 020 7946 0018."
  - "… using the country code stored with the number."
  - "… exactly as stored. If stored numbers don't include a country code, set a default
    below."
- **If the setting can't be loaded** (for example, the migration isn't applied live yet):
  - an amber note says it isn't available and phones are used exactly as stored
  - **WhatsApp, email and printing all keep working**
  - while the setting loads (a moment), the WhatsApp button is briefly disabled

**Not touched:**
- the admin login, `AuthContext`, Login, App routing and Layout
- every other page's behavior
- the appointment edit/delete code and the invoice edit/delete/void code (they were
  verified, not rebuilt)

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings.
- `npm run build`: OK, with **no warnings**.
  - The main chunk is **498.00 kB** (490.97 kB on `main`).
  - `InvoicePrintView` is its own chunk, 10.05 kB, including the country code setting.
  - RepairGuides (8.93 kB) and Import (13.99 kB) are unchanged.
  - Without the lazy load the main chunk was 504.64 kB and the build warned, which is why
    the print view is lazy.
- The built CSS contains the `@media print` block exactly as written.

### Walkthrough 1: customers, vehicles, invoice data and links (115/115 checks pass)
**How it was run:**
- The same harness as the earlier prompts.
- The project's real `data.ts`, `invoiceDocument.ts` and `format.ts` were loaded through the
  project's own Vite and wrote through real supabase-js.
- Requests went to the local stand-in for the Supabase REST API, backed by a fresh PGlite
  database with all 6 migrations.
- Test data only.
- No change to the stand-in was needed. The repair-order count check uses the HEAD count
  and `in` filter it already supported.
- **Node 22 was used** (`C:\Program Files\nodejs`). The default Node 20 on the PATH can no
  longer load the installed supabase-js, which needs a native WebSocket.

**Foreign keys (read from `pg_constraint` after migrating):**
- `vehicles.customer_id` is CASCADE, `repair_orders.customer_id` RESTRICT,
  `repair_orders.vehicle_id` RESTRICT, `appointments.vehicle_id` SET NULL and
  `appointments.customer_id` CASCADE.
- Those 5 are the only foreign keys pointing at customers or vehicles.

**Fixtures:** 4 customers, 6 vehicles, 2 appointments and 2 repair orders.
- Cat has an order on her Mazda.
- Dan's Golf sits on an order that belongs to Ann.

**Customer edit:**
- Robert's name, phone, email and notes were changed, padded with spaces. The saved row is
  trimmed.
- `fetchCustomers` shows the new values, the list re-sorts by the new name, and his 2
  vehicles are still on his card.
- **The other 3 customers and all 6 vehicles were byte-for-byte unchanged.**
- `created_at` was kept and `updated_at` moved forward.
- Clearing phone, email and notes stores null.
- **Refused, with the database unchanged after all 8:**
  - an empty name, and a name of only spaces: "A name is required."
  - 6 bad emails: `rob`, `rob@`, `rob@example`, `@example.com`, `rob @example.com` and
    `rob@exa mple.com`, each with "… doesn't look like an email address"
- Editing a customer that doesn't exist gets a clear message.

**Vehicle edit:**
- The year, make, model, trim and mileage were changed.
- The card label reads "2020 Lexus ES F Sport" and the mileage is 52,000.
- **The other 5 vehicles were byte-for-byte unchanged.**
- Year and mileage can be cleared.
- **Refused, with the database unchanged after all 9:**
  - missing make, a make of only spaces, missing model
  - year **1899**, year 2028, year 2018.5, year NaN (unparseable input)
  - **mileage −1**, mileage 10.5
- 1900, 2027 and mileage 0 were accepted.
- Editing a vehicle that doesn't exist gets a clear message.

**Vehicle add (same rules as edit):**
- **Refused, with the database unchanged after all 7:**
  - missing make, a model of only spaces
  - year 1899, year 2028, **year 2100** (allowed before this change), year NaN
  - mileage −1
- 1900, 2027 and mileage 0 were accepted. Values are trimmed, and blanks are stored as null,
  as before.

**Customer delete:**
- **Refused, with nothing deleted or changed (full snapshot of 5 tables compared):**
  - **Cat (has orders):** "This customer has repair orders and cannot be deleted."
  - **Dan (his car is on Ann's order):** the vehicle reason.
- **Robert (2 vehicles, 1 appointment, no orders) was deleted:**
  - customers 4 → 3, **vehicles 6 → 4** and **appointments 2 → 1** (cascade)
  - none of his rows are left anywhere
- **The other customers, vehicles and appointments were byte-for-byte unchanged.**
- The reloaded list no longer shows him.
- A second delete gets "That customer was already deleted."

**Vehicle delete:**
- **Refused, with nothing changed:**
  - **Cat's Mazda (has an order):** "This vehicle has repair orders and cannot be deleted."
  - **Dan's Golf (on Ann's order):** same reason.
- **Cat's Kia (no orders) was deleted:**
  - vehicles 4 → 3, and the other vehicles were byte-for-byte unchanged
  - **its appointment was kept with `vehicle_id` null**, and the rest of that appointment
    was unchanged
- `fetchAppointments` still lists it, with no vehicle and the customer shown.
- **It can still be edited** with `updateAppointment`.

**Printable invoice:**
- **The test order:** labor 2.5 × $120 = $300.00, and parts $149.99.
- **Paid invoice:** subtotal $449.99 + tax $36.00, then sent and marked paid through the
  real `updateInvoice`. `buildInvoiceDocument` gives:
  - **INV-1001** (the stored number), the date as `formatDate` gives it, and Cat's name,
    phone and email
  - "2019 Mazda 3" with plate "CAT 9"
  - Labor "2.5 hrs × $120.00/hr" $300.00, and Parts $149.99, **exactly 2 lines**
  - subtotal, tax and total equal to the stored invoice ($485.99)
  - "Paid on Nov 16, 2026", which is `formatDate(paid_at)`
- **Matching the app:** the Invoices card's text ("Subtotal $449.99 + Tax $36.00 · Paid …")
  and the printed values are **identical strings**.
- **Draft invoice:** subtotal $400 + tax $32.
  - Prints "Draft", with no paid date.
  - The lines stay at $300.00 / $149.99, while the subtotal, tax and total stay at
    $400 / $32 / $432. The mismatch is flagged.
- The other statuses read "Sent · not yet paid" and "Void".
- A vehicle with no plate leaves the plate out.

**Send links:**
- **The mailto link:**
  - goes to `cat@example.com`, with subject `Invoice INV-1001`
  - **body:** the greeting, "invoice INV-1001, dated …", "Vehicle: 2019 Mazda 3 (CAT 9)",
    "Total: $485.99" and "Status: Paid on …"
  - spaces are `%20` (never "+"), and the line breaks are kept
- **WhatsApp:**
  - the link is `https://wa.me/442079460018`, from the stored "+44 (20) 7946-0018"
  - its text is the same summary
- **Number cleanup**, all as expected:

  | Stored | Digits |
  |---|---|
  | `555-0101` | `5550101` |
  | `(555) 010 1234` | `5550101234` |
  | `+1 555-010-1234` | `15550101234` |
  | `  0712 345 678 ` | `0712345678` |
  | `[555] 0101` | `5550101` |

  The leading 0 is kept and no country code is added.
- **Disabled with reasons:**
  - no email
  - no phone
  - a phone with "ext 2"
  - a malformed stored email
  - a real customer (Dan) with a phone but no email: email disabled, WhatsApp enabled

**Regressions on the same data:**
- Create customer + add vehicle, as the page does, still work.
- **Appointments** create → edit → delete still work.
- **Invoices:** draft edit and draft delete work, and **void** works.
- A paid invoice still can't be deleted.
- A notification pointing at a deleted customer resolves to null (the existing "no longer
  exists" path), with no crash.

**Cleanup:** 0 customers, 0 vehicles and 0 repair orders were left.

### Walkthrough 2: print view in headless Chrome (51/51 checks pass)
**How it was run:**
- The **real** `InvoicePrintView` and the **real** `src/index.css` (Tailwind built from the
  project config) were served through the project's Vite.
- They were rendered in headless Chrome over CDP, on top of a stand-in of the app shell: a
  top bar, sidebar, page with buttons and fixed bottom nav, all inside `#root`.
- React StrictMode was on, as in `main.tsx`.
- `window.print` was replaced with a counter.

**Screen:**
- **The browser print flow is called exactly once** (StrictMode's double effect doesn't
  print twice).
- The view is a direct child of `<body>`, and `<html>` has `invoice-print-open`.
- The sheet's text contains all 20 expected values: number, date, customer, phone, email,
  vehicle, plate, both lines, subtotal, tax, total and paid status.
- The toolbar has Print, Send via email, Send via WhatsApp and Close, and the PDF note.
- The email button is the mailto link. The WhatsApp button is the wa.me link with
  `target=_blank`.

**Print media (`Emulation.setEmulatedMedia: print`):**
- **`#root` is `display:none`**: the top bar, sidebar, page and bottom nav each have no
  rendered box.
- The toolbar is `display:none`, and **no button or link is visible anywhere**.
- The overlay is `position: static`, white, with no padding and not scroll-clipped. The
  body is white.
- **The sheet is black on white with no shadow.** Every element inside it computes to
  `rgb(0, 0, 0)`.
- **Print-to-PDF gives exactly 1 page.**

This run has no database behind it, so it also covers the "setting not available" fallback:
the WhatsApp link from "+44 (20) 7946-0018" is still `wa.me/442079460018`.

**Draft invoice for a customer with no email or phone:**
- It prints "Status: Draft" and "Payment status: Draft", with no paid date.
- "Subtotal (as invoiced)" $400.00 / $32.00 / $432.00, with the lines at $300.00 and
  $149.99.
- No phone or email lines are printed.
- **Both send buttons are disabled `<button>`s,** with the reasons as tooltip and visible
  text, and there are no mailto/wa.me links.
- The adjusted-subtotal note shows on screen.
- 1-page PDF.

### Walkthrough 3: default WhatsApp country code, data and number rule (66/66 checks pass)
Same harness as Walkthrough 1, with the real migration, `data.ts` and `invoiceDocument.ts`.

**Schema:**
- 7 migrations apply in order, with `shop_settings` last.
- **There are now 15 tables, all with RLS.**
- The only policy is `authenticated_full_access`.
- The trigger is present, and the columns are as specified.
- **There's exactly one row after migrating:** id 1, code null.
- **The database check refuses** `044`, `1234`, `abc`, `+44`, `''` and `0`.
- **A second row (id 2) is refused.**
- `anon` reads 0 rows and cannot set the code.
- **Re-running the migration leaves the row unchanged.**

**Data functions:**
- **`cleanCountryCode`:** 9 cases (`44`, `+44`, ` +44 `, `+ 44`, `1`, `971`, blank,
  spaces, null).
- **Save "+44":**
  - stores "44"
  - `updated_at` moves and `created_at` is kept
  - fetch returns 44
- **7 refused values** (`044`, `1234`, `4a`, `0`, `+`, `44 1`, `00`), each with the reason
  and **before any request**. The stored code stayed 44.
- **Blank clears it.**
- **Row deleted:** fetch and save both give the clear "migration may not be applied" reason.
- **Table dropped:** fetch fails with a "Failed to load shop settings: …" message, not a
  crash.

**Number rule:**
- **14 cases**, each checked for the digits, "already international" and "code added".
  They include all 5 table rows above, plus:
  - `07700 900123`
  - `(020) 7946-0018`
  - `+1 555-010-1234` with default 44 (stays 1)
  - `00 1 555 010 1234`
  - `+ 44 …`
  - `(555) 010-1234` with default 1
  - `555-0101` with no default
  - `+44 (20) 7946-0018`
  - `0044 …` with no default
- `0123` + 44 → `44123`.
- **`0 0123` reads as "00…", already international, and becomes `123`.** That follows the
  rule as chosen.
- **A phone with "ext 2" gives null** (button disabled), with or without a default.
- No phone gives null.

**End to end:**
- A real customer with phone `020 7946 0018` and a real invoice.
- **With the stored code 44** the link is `wa.me/442079460018`, with the same message text.
- **The customer's stored phone is unchanged.**
- The email link is unaffected.
- **Clearing the setting** brings the link back to `wa.me/02079460018`.

### Walkthrough 4: country code setting in headless Chrome (25/25 checks pass)
**How it was run:**
- The real `InvoicePrintView` in headless Chrome, as in Walkthrough 2.
- This time the page's Supabase client talked to the local stand-in (fresh PGlite with all
  7 migrations), through the harness origin.
- **Every request went to 127.0.0.1** (checked). The harness refuses to run if a `.env`
  file exists, and there is none in the repo.

**One page load:**
- The setting is fetched 2 times (StrictMode's dev double effect), with no reload loop.
- Print is called once.

**Results:**
- **No default:**
  - the box is empty
  - the link is `wa.me/02079460018`, with the hint "exactly as stored"
  - Save is disabled
- **Type "+44" and Save:**
  - **the database holds "44"**
  - "Saved for all devices." shows
  - **the link changes to `wa.me/442079460018` straight away**
  - the hint says "the default +44 was added to the stored 020 7946 0018."
  - nothing is printed again
- **Reload:** the box shows 44, and the link still uses it (**it persists**).
- **A "+44 (20) 7946-0018" customer** keeps `wa.me/442079460018` "using the country code
  stored with the number".
- **"044" is refused** with its reason. The database still holds 44, and the link is
  unchanged.
- **Blank and Save clears it in the database,** and the link goes back to as-stored.
- **Print media:** the setting box isn't rendered.
- **Table dropped (migration not applied):**
  - the amber note shows, and there's no setting box
  - **WhatsApp still opens the as-stored number**
  - the invoice renders and prints once

### Regressions: earlier walkthroughs rerun on this branch
All pass with the same counts as on PR #10:
- foundation/services 12/12
- appointments 39/39
- estimates/invoices 35/35
- notifications 55/55
- timelogs 34/34
- earnings 31/31
- admin login 27/27
- CSV import 71/71
  - **One assertion was updated.** The "database error on one row fails only that row" case
    forces year 1800 past the import's own checks. `createVehicle` now refuses it before the
    database, so the reason reads "Year must be between 1900 and 2027." instead of
    "Failed to add vehicle: …".
  - The outcome is the same: row 3 fails with its customer saved, rows 2 and 4 import, and
    the counts are unchanged.
  - That case therefore no longer reaches a real database error on import.
- **repair guides 103/103**
- fresh-database migration check 14/14
- Walkthrough 1 (customers/vehicles/invoices) 115/115 and Walkthrough 2 (print) 51/51,
  rerun after the country code change.

**Changes to the test setup for the new migration:**
- The stand-in's table list gained `shop_settings`.
- Four scripts pinned the old schema shape:
  - the migration check: "14 tables" → 15
  - repair guides: "6 migrations" → 7, and 14 → 15 tables
  - timelogs: 6 → 7 migrations, and 14 → 15 tables
  - notifications: the migration list gained the new file

  Nothing else in them changed. The same was done for earlier migrations.

## What was NOT verified

- **The Customers page and the Invoices card were not clicked through in a browser.** These
  were not exercised in the real app:
  - the inline edit forms and their prefill
  - the confirm dialogs and the per-card error banner
  - the reload after save
  - the Print button opening the view inside the real RepairOrderDetail page

  The walkthroughs drove the same data functions those components call. The print view
  itself was rendered for real in Chrome, but in a test shell, not inside the signed-in app.
- **The page's form → input conversion was not run.** It turns '' into null and other text
  into a number, so an unparseable value becomes NaN. That code is inside the component.
  The walkthrough fed the same values (including NaN) straight to the data functions.
- **The race-condition path** was not exercised: an order added between the delete check
  and the delete, which maps the database's `23503` to the plain reason.
- **No real email app or WhatsApp was opened.** The links were checked as strings and
  parsed URLs. How a given mail app handles a long `mailto:` body was not tested.
- **No paper was printed.** The print result was checked by computed styles and a
  Chrome print-to-PDF, not on Safari or Firefox.
- **The REST layer was a stand-in, not real PostgREST.**
- **The country code setting was tested in a test shell, not in the signed-in app.** Saving
  it as the real signed-in admin, on the live project, wasn't exercised.
- **Nothing was applied live or deployed.** The live database, which holds the shop's real
  customers, was not touched. **The `shop_settings` migration is not applied.** Until it is,
  the invoice view shows the "not available" note and uses phones as stored.

## Open items

1. **Deleting a customer also deletes their appointments** (`appointments.customer_id` is
   ON DELETE CASCADE in the foundation migration). It wasn't in the prompt's list. The
   behavior was left as the schema has it, and the confirm text tells the shop.
2. **Apply the `shop_settings` migration** to the live project. It's a manual step, like the
   earlier migrations. Then set the default country code once, from any invoice view.
3. **Numbers stored with a country code but no "+" or "00"** (for example "442079460018")
   will get the default added again once one is set: "44442079460018". The view shows the
   number before opening, so it's visible. The fix is to store those numbers with a "+".
   This is the limit of the rule chosen, since without "+" or "00" a stored code can't be
   told apart from a local number.
4. **The invoice lines come from the order-level labor and parts,** as specified, not from
   the order's services. On an order whose services differ from the order-level fields, the
   lines may not add up to the invoiced subtotal. The invoice's own amounts are what's
   printed as owed.
5. **No shop details on the invoice** (name, address, logo, phone), because none are
   stored. That would be a separate prompt with a settings table.
6. **The main chunk is 498.00 kB,** just under the 500 kB warning. The next feature that
   adds to the main bundle will likely need more code-splitting, for example lazy-loading
   RepairOrderDetail.

Not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
