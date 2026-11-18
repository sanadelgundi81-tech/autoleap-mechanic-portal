# Stage 2, prompt 11: invoice preview before print

Branch: `feat/invoice-preview-20261117` (base: `main` @ `2988e21`, Stage 2 prompt 10 / customer edit + delete + printable invoices merged as PR #11)

**Precondition checked before building.** I checked out `main` and pulled. It was already
up to date at `2988e21`, "Stage 2, prompt 10: edit + delete customers/vehicles, printable +
sendable invoices (#11)". The branch was cut from that commit.

## What changed

The shop owner hit two problems with the invoice view:
- Opening an invoice started the print dialog by itself, which covered the invoice before he
  could read it.
- The "Send via…" buttons sounded as if the app sends the invoice. It doesn't. They only open
  the shop's own email or WhatsApp, and the PDF is never attached.

**One file changed: `src/components/InvoicePrintView.tsx`.** No migration. No new npm
dependency, no sending, no provider, no secrets.

### 1. Preview first, print on tap
- **The auto-print is gone.** The `useEffect` no longer runs
  `setTimeout(() => window.print(), 100)`, and its `clearTimeout` cleanup went with it.
- **Opening an invoice now only shows it.** The full invoice sheet appears on screen and
  nothing else happens.
- **The toolbar's Print button is the only way the print dialog opens.** It calls
  `window.print()` as before.
- **Kept exactly as they were:**
  - the effect's other work: it adds `PRINT_OPEN_CLASS` to `<html>` on open and removes it on
    close, and Escape closes the view
  - the print stylesheet in `src/index.css`, which is not touched. On paper only the invoice
    sheet prints, black on white.
- The component's doc comment and the effect's ref comment were updated to match. They had
  said opening the view starts the print flow.

### 2. Honest send buttons
- **"Send via email" is now "Open in email app".**
- **"Send via WhatsApp" is now "Open in WhatsApp".**
- **The links are unchanged:** the same `mailto:` to the stored email and the same
  `https://wa.me/<digits>?text=…` link in a new tab, with the same prefilled text.
- **Kept as is:**
  - the PDF note: "The app doesn't attach the PDF: print this invoice to PDF first, then
    attach it to the email or WhatsApp message before sending."
  - a missing or unusable email or phone still disables that button, with the reason shown
    as text and as the tooltip

**Not touched:**
- the invoice sheet's content and totals, and `buildInvoiceDocument` / `invoiceDocument.ts`
- the Print button on the order's Invoices card. It keeps its "Print" label and now opens the
  preview.
- customers, vehicles, estimates, `AuthContext`, Login and the login flow

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings, the same as `main` (0), so there are **no new findings**.
- `npm run build`: OK, with no warnings.
  - The main chunk is **497.19 kB**, unchanged from `main`.
  - The `InvoicePrintView` chunk is 7.30 kB (7.37 kB before, because the timer code is gone).

### Walkthrough 1: the real app on a local Vite dev server (46/46 checks pass)
**How it was run:**
- The real app ran on the project's own Vite **dev** server, with the real `main.tsx`, `App`,
  `Layout`, Login, `RepairOrders`, `RepairOrderDetail` and the lazy `InvoicePrintView`.
- It talked to the local stand-in for the Supabase REST + auth API, backed by a **fresh
  PGlite database with all 6 migrations**.
- The app and the stand-in were served from one local origin, so the browser reached the
  stand-in the way it reaches Supabase.
- The test ran in headless Chrome over CDP, signed in through the **real Login form** as
  `admin`. The password was random and generated for this run only. The shop's password
  was not used.
- `window.print` was replaced with a call counter before any app code loaded.
- **Test data only:**
  - Cat Test has a 2019 Mazda 3, plate CAT 9, and order RO-90001. Its invoice INV-9001 is
    paid: $449.99 + $36.00 = $485.99.
  - Dee Test has no email or phone, a 2015 Honda Civic, and order RO-90002. Its invoice
    INV-9002 is a draft with an adjusted subtotal: $400.00 + $32.00 = $432.00.
- **No remote database or service was touched.** `wa.me` was pointed at a dead local port
  inside the test browser, so the WhatsApp tab carried no test data off the machine.

**Opening the invoice from the order:**
- I signed in, went to Repair Orders → RO-90001 and tapped the invoice's **Print** button.
  The preview opened, with its chunk lazy-loaded.
- **No print dialog on open:** `window.print` had been called 0 times 2 seconds after the
  preview opened. The old auto-print fired at 100 ms.
- **The full invoice is readable on screen.** The sheet is laid out at 768 px wide, and its
  text includes:
  - bill-to name, phone and email
  - "2019 Mazda 3" and "Plate CAT 9"
  - Labor "2.5 hrs × $120.00/hr" $300.00 and Parts $149.99
  - Subtotal $449.99, Tax $36.00 and Total $485.99
  - INV-9001 and "Payment status: Paid on Nov 16, 2026"
- **The toolbar** reads Print, Open in email app, Open in WhatsApp and Close, with no
  "Send via". The PDF note is there word for word.

**Send buttons:**
- **Open in email app** is `mailto:cat@example.com?subject=Invoice%20INV-9001&body=…`. The
  decoded body has the greeting, the invoice number and date, "Vehicle: 2019 Mazda 3 (CAT 9)",
  "Total: $485.99" and "Status: Paid on Nov 16, 2026".
  - Tapping it navigates to that `mailto:` link, which is handed to the mail app. The test
    stopped the navigation there, because headless Chrome has no mail app.
- **Open in WhatsApp** is `https://wa.me/442079460018?text=…` with the same summary.
  - **A real mouse tap opened a new tab at that wa.me link,** and the app tab kept showing
    the preview.
- Neither tap printed.

**Tap Print:**
- `window.print` was called **exactly once**, and the preview stayed open.
- **In print media:**
  - `#root` (the whole app) is not rendered
  - no button or link is visible
  - every element on the sheet is black on white
- **Chrome's print-to-PDF of the real app is 1 page:** only the invoice sheet.

**Tap Close:**
- The preview and the `invoice-print-open` class are gone.
- **You're back on order RO-90001**, with its invoice list showing.
- There was no further print.

**Draft invoice for a customer with no email or phone (RO-90002):**
- No print on open.
- The sheet shows Dee Test, 2015 Honda Civic, "Subtotal (as invoiced)" $400.00 / $32.00 /
  $432.00 and "Payment status: Draft".
- **Open in email app** and **Open in WhatsApp** are disabled buttons, with "No email on file
  for this customer." / "No phone on file for this customer." as tooltip and visible text.
- Escape closes the preview back to RO-90002, with no print.
- **No uncaught page errors** in the whole run.

### Walkthrough 2: print view component in headless Chrome (65/65 checks pass)
This is prompt 10's print check, updated for this change. It renders the **real**
`InvoicePrintView` and the **real** `src/index.css` over a stand-in app shell, with React
StrictMode on.

**What it checks now:**
- **0 print calls 2 s after open,** even with StrictMode's double effect.
- Tapping Print gives exactly 1 call.
- Close unmounts the view, removes the class and shows the page again. Escape closes too.
  Neither prints.
- The new labels, and that no toolbar button says "Send".
- The mailto/wa.me hrefs and their decoded prefill.

**Unchanged from prompt 10 and still passing:**
- the 20 sheet values
- every print-media check (app hidden, toolbar hidden, black on white, 1-page PDF)
- the draft / no-contact disabled-with-reason cases

**Control run against `main`:** the same script **fails** there on "opening the view does NOT
call the print flow" (1 call) and on the button labels. So it catches the old behavior.

**Test setup note:** this time both browser scripts were started from the repo directory.
Earlier runs started them from the scratch folder, so Tailwind couldn't find its `content`
config and warned. The sheet's screenshot here is styled as the real app is (768 px wide,
toolbar laid out).

### Fresh-database migration check (14/14)
- **No migration in this prompt.** `supabase/migrations` is unchanged: 6 files.
- On a fresh PGlite database, all 6 migrations apply in order with no errors:
  - `20261110010000_autoleap_foundation`
  - `20261110020000_autoleap_technician_completion`
  - `20261113010000_order_services`
  - `20261116010000_notifications`
  - `20261116020000_timelogs`
  - `20261116030000_repair_guides`
- 14 tables, RLS on for every one. The check passes 14/14, the same as on PR #11.

### Regression
- **Prompt 10's Walkthrough 1** passes 115/115 on this branch. It covers customers,
  vehicles, `buildInvoiceDocument` and the send links, through the real `data.ts` and
  `invoiceDocument.ts`.

## What was NOT verified

- **The real browser print dialog.** In both walkthroughs `window.print` was a counter, so the
  OS print dialog itself never opened. The printed output was checked by emulating print
  media and with Chrome's print-to-PDF, not by printing on paper or through a printer driver.
- **A real mail app or WhatsApp.** The `mailto:` tap was checked up to the hand-off to the mail
  app; headless Chrome has none, so no compose window opened. The WhatsApp tap opened the
  wa.me URL in a new tab, but wa.me was pointed at a dead local port, so WhatsApp / WhatsApp
  Web never loaded and nothing was sent.
- **Phones and tablets.** The test ran in desktop headless Chrome at 1280×900. It was not
  checked on a phone, in Safari / iOS (where `window.print` and `mailto:` behave differently)
  or on the shop's own device.
- **The hosted Supabase project and the deployed site.** Nothing was applied live, deployed or
  run against the real database. The app ran against the local stand-in.
- **Sending from inside Autoleap.** That isn't built: the buttons still only open the shop's
  own apps, and the PDF is still not attached. Real sending is the next prompt.
