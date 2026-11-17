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

**No migration, no new npm dependency, no backend, no secrets.** The foreign keys were
left exactly as they are.

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
  - **Number cleanup:** spaces, dashes, brackets and a leading "+" are removed.
  - **No country code is guessed.** The view shows "WhatsApp opens to 442079460018,
    exactly as stored. It must include the country code."
- **When a contact is missing,** that button is disabled. The reason shows as text and as
  the button's tooltip: "No email on file for this customer." / "No phone on file for this
  customer."
- **When a stored value can't be used,** the button is also disabled with a reason: an email
  that isn't email-shaped, or a phone with letters such as "ext 2".
- **PDF note:** one line on the view says "The app doesn't attach the PDF: print this invoice
  to PDF first, then attach it to the email or WhatsApp message before sending."

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
  - The main chunk is **497.19 kB** (490.97 kB on `main`).
  - `InvoicePrintView` is its own chunk, 7.53 kB.
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

**Draft invoice for a customer with no email or phone:**
- It prints "Status: Draft" and "Payment status: Draft", with no paid date.
- "Subtotal (as invoiced)" $400.00 / $32.00 / $432.00, with the lines at $300.00 and
  $149.99.
- No phone or email lines are printed.
- **Both send buttons are disabled `<button>`s,** with the reasons as tooltip and visible
  text, and there are no mailto/wa.me links.
- The adjusted-subtotal note shows on screen.
- 1-page PDF.

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

None of the scripts needed changes, since there's no new migration or table.

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
- **Nothing was applied live or deployed.** The live database, which holds the shop's real
  customers, was not touched.

## Open items

1. **Deleting a customer also deletes their appointments** (`appointments.customer_id` is
   ON DELETE CASCADE in the foundation migration). It wasn't in the prompt's list. The
   behavior was left as the schema has it, and the confirm text tells the shop.
2. **WhatsApp needs the country code in the stored phone.** A number stored as
   "(555) 000-0000" opens wa.me/5550000000, which WhatsApp reads as country code 55. As
   asked, nothing is guessed, and the view shows the digits it will use. If most customers
   are stored without a country code, a shop-level default country code would be a separate
   prompt.
3. **The invoice lines come from the order-level labor and parts,** as specified, not from
   the order's services. On an order whose services differ from the order-level fields, the
   lines may not add up to the invoiced subtotal. The invoice's own amounts are what's
   printed as owed.
4. **No shop details on the invoice** (name, address, logo, phone), because none are
   stored. That would be a separate prompt with a settings table.
5. **The main chunk is 497.19 kB,** just under the 500 kB warning. The next feature that
   adds to the main bundle will likely need more code-splitting, for example lazy-loading
   RepairOrderDetail.

Not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
