# Stage 2, prompt 8: CSV import (customers + vehicles)

Branch: `feat/csv-import-20261116` (base: `main` @ `08b1db1`, Stage 2 prompt 7 / single admin login merged as PR #8)

**Precondition checked before building.** I checked out `main` and pulled, and it was
already up to date at `08b1db1`, "Stage 2: single admin login + Dashboard paid filter
(#8)". `src/pages/Login.tsx` has the **Username** field ("One login for the whole shop
… No sign-up"), and `src/` has no `signUp` anywhere. The branch was cut from that commit.

## What was built

An **Import** page for bringing in customers and vehicles from a CSV file, for example
an export from the shop's old AutoLeap account. Nobody has seen that export, so nothing
assumes particular column names or a particular layout.

### 1. CSV parser: `src/lib/csv.ts` (new, no dependency)
- **`parseCsv(text)`** follows RFC 4180 and handles:
  - quoted fields, delimiters inside quotes, and newlines inside quotes
  - doubled quotes (`""`)
  - CRLF, LF and lone-CR line endings
  - a UTF-8 BOM
- **Blank lines at the end are dropped.**
- **Blank lines in the middle are kept,** so the row numbers in the report match the row numbers the user sees in a spreadsheet. `isBlankRecord` skips them later.
- **The delimiter is detected from the header row:** comma, semicolon or tab, whichever appears most often outside quotes. Comma wins ties. This covers Excel's semicolon CSVs in European locales.
- **`decodeCsvBytes`** reads the file as UTF-8. If the bytes aren't valid UTF-8, it falls back to Windows-1252, which is what Excel's plain "CSV" save produces on Windows. Without that fallback, accented names would come through garbled.

### 2. Import logic: `src/lib/csvImport.ts` (new)
- **`guessMapping(headers)`** auto-guesses which column goes with which field:
  - Headers are compared lowercased, with punctuation removed, against keyword lists for each field (for example phone/mobile/cell/tel, vin/chassis, plate/licen/registration/rego, odometer/mileage/km).
  - Specific fields are guessed first, so "Customer Phone" goes to phone (not name) and "Model Year" goes to year (not model).
  - For the name, "Customer Name" beats "Customer ID".
  - Each column is used for at most one field.
  - Loose keywords were left out on purpose, so "Mailing Address", "Tags" and "Transaction" aren't guessed as email, plate or transmission.
- **`prepareRows(records, mapping, firstRowNumber)`** builds each row's values and lists its problems (rules below).
- **`importRows(rows, onProgress)`** imports the rows:
  - It reads existing customers once, with `fetchCustomers` (which includes their vehicles).
  - It writes **only** through the existing `createCustomer` / `createVehicle` in `data.ts`. There are no raw inserts.
  - It returns the report.

### 3. Page: `src/pages/Import.tsx` (new) + nav/routing
The page runs in four steps:
1. **Upload:** pick a `.csv` file. It's parsed in the browser. An empty file, or a file with a header row but no data rows, gets a clear error.
2. **Map columns:**
   - There's one dropdown per app field, grouped as Customer and Vehicle, prefilled from the auto-guess.
   - Each option shows the header plus a sample value from the first data row.
   - A field set to "Not imported" is left empty.
   - **Preview stays disabled until the customer name is mapped.**
3. **Preview:**
   - Shows the first 50 rows as they will import, with OK or the row's problems.
   - Shows the counts "N rows ready · M rows will fail".
4. **Import + report:**
   - Shows progress while it runs.
   - The report shows: customers created, merged into existing customers, vehicles added, vehicles already on file, rows skipped (already there), and rows failed, with each failed row's number and reason.
   - **The report stays on screen.** It stays while the next (fixed) file is uploaded and mapped, labelled "Last import report — file.csv", and is replaced only when the next import finishes.

**Navigation:** Layout gets an **Import** nav item (desktop and mobile bars) and `View`
gains `{ name: 'import' }`. App.tsx routes it like the other pages. The page is
**lazy-loaded** (`React.lazy`), so its code is a separate 14 kB chunk that loads only when
Import is opened. Without that, the main bundle grew from 487 kB to 501 kB and the build
gained Vite's ">500 kB chunk" warning. With it, the main bundle is 488 kB and the build
has no warning.

### Row rules (as specified, plus one stated addition)
- **One CSV row = one customer + optionally one vehicle.**
- **Make and model both empty:** the row is customer-only. **Only one of the two present:** the row fails with "vehicle needs both make and model".
- **The row fails, with its reason, if:**
  - the name is missing or blank
  - the year isn't a whole number, or is outside **1900 to next year** (2027 today)
  - the mileage isn't a number or is negative
  - the email doesn't have the shape `x@y.z`
- **Normalising:**
  - Names are trimmed.
  - Phones are trimmed and **not reformatted.**
  - Emails are trimmed and lowercased.
  - Mileage accepts thousands separators and a trailing "km": `"45,000 km"` imports as 45000.
- **Customer matching:**
  - If the row has a phone, a customer with the same phone (trimmed, exact) is a match.
  - If the row has no phone, a customer with the same name (trimmed, case-insensitive) is a match. If several have that name, the oldest one is used, so re-runs are stable.
  - **A matched customer is never updated:** the name, phone, email and notes stay as they are.
- **Vehicle matching (under that customer):**
  - The same VIN, or the same plate, means the vehicle is already there and is skipped. Both are compared case-insensitively, and plates also ignore spaces, so "abc123" matches "ABC 123".
  - **Addition:** a vehicle with **neither VIN nor plate** is matched on year + make + model. Without this, re-running a file would duplicate every vehicle that has no VIN and no plate, which would break the idempotency requirement. Please confirm that this is the behaviour you want.
- **Repeats inside one file merge or skip too:** customers and vehicles created during the run are added to the same lookup.
- **A database error on one row fails only that row,** and the rest continue. If the customer was saved but its vehicle failed, the reason says "customer saved, but the vehicle failed: …". A re-run merges into that customer and retries the vehicle.
- **Customers and vehicles only.** Repair orders, estimates, invoices, appointments and inspections aren't imported.

**Not touched:** there's no migration and no schema change. There are no new npm
dependencies. The admin login, `AuthContext`, Login and every other page are unchanged.
The only edits to existing files are the 2 lines in `Layout.tsx` (plus a comment) and the
lazy import and route in `App.tsx`. No secrets were added.

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings.
- `npm run build`: OK, with **no warnings**. The main chunk is 488.27 kB and the Import chunk is 13.99 kB. `main` builds at 486.93 kB.

### CSV import walkthrough (71/71 checks pass)
**How it was run:**
- The same harness as the earlier prompts.
- The project's real `csv.ts`, `csvImport.ts` and `data.ts` were loaded through the project's own Vite, writing through real supabase-js.
- Requests went to the local stand-in for the Supabase REST API, backed by a fresh PGlite database with all 5 migrations.
- "Now" was fixed at 16 Nov 2026, so the accepted years are 1900–2027.

**Stand-in change:** `fetchCustomers` selects `*, vehicles(*)`, a one-to-many embed
that the stand-in hadn't implemented before. It used to return `vehicles: null`. It
now returns the customer's vehicles as an array, like PostgREST does. Node 20 also
needed `--experimental-websocket` for supabase-js to start. Neither change affects the
app code.

**Parser (18 checks), each an exact input → output:**

| Case | Input | Output |
|---|---|---|
| Quoted comma | `a,"b,c",d` | `[["a","b,c","d"]]` |
| Quoted newline | `name,notes\nBob,"line one\nline two"\n` | `[["name","notes"],["Bob","line one\nline two"]]` |
| CRLF inside a quoted field (kept) | `"a\r\nb",c\r\n` | `[["a\r\nb","c"]]` |
| CRLF line endings | `h1,h2\r\n1,2\r\n3,4\r\n` | `[["h1","h2"],["1","2"],["3","4"]]` |
| Lone CR line endings | `h1,h2\r1,2` | `[["h1","h2"],["1","2"]]` |
| UTF-8 BOM | `﻿Name,Phone\nAnn,1` | `[["Name","Phone"],["Ann","1"]]` |
| Empty trailing lines | `a,b\n1,2\n\n\r\n\n` | `[["a","b"],["1","2"]]` |
| Trailing row of only commas | `a,b\n1,2\n,\n` | `[["a","b"],["1","2"]]` |
| Interior blank line (kept for row numbers) | `a\n1\n\n2` | `[["a"],["1"],[""],["2"]]` |
| Doubled quotes | `"say ""hi""",x` | `[["say \"hi\"","x"]]` |
| Empty cells | `a,,c,` | `[["a","","c",""]]` |
| No trailing newline | `a,b\n1,2` | `[["a","b"],["1","2"]]` |
| Semicolon delimiter | `Name;Phone\n"Smith; J";555` | `[["Name","Phone"],["Smith; J","555"]]` |
| Tab delimiter | `Name\tPhone\nAnn\t1` | `[["Name","Phone"],["Ann","1"]]` |
| Quoted `;` doesn't change the delimiter | `"a;b",c\n1,2` | `[["a;b","c"],["1","2"]]` |
| Empty input | `` | `[]` |

There are two more checks on the decoder:
- UTF-8 bytes with a BOM decode to `Name\nJosé`, with the BOM removed.
- Windows-1252 bytes (`Jos` + `0xE9`) decode to `Name\nJosé`.

**End-to-end with a sample CSV:**

The sample file:
- uses a BOM and CRLF line endings
- has 17 data rows plus a header, one of them a row of only commas
- has these headers, deliberately unlike the app's field names:
  `Client, Mobile, E-mail Address, Comments, Model Year, Car Make, Car Model, Trim Level, Gearbox, Engine Size, VIN #, Plate No., Odometer, Last Visit`

- **Upload:**
  - The BOM is gone from "Client".
  - The quoted multi-line note stays in one cell.
- **Auto-guess:**
  - **All 13 fields were mapped to the right columns:** Client→name, Mobile→phone, E-mail Address→email, Comments→notes, Model Year→year, Car Make→make, Car Model→model, Trim Level→trim, Gearbox→transmission, Engine Size→engine, VIN #→VIN, Plate No.→plate, Odometer→mileage.
  - "Last Visit" was left unmapped.
  - On a second header set: "Customer Name" beat "Customer ID", "Customer Phone" went to phone, and "Mailing Address", "Tags" and "Transaction" were not guessed.
  - Headers it couldn't recognise left the name unmapped, so the page blocks Preview.
- **Preview:**
  - **9 rows were ready and 7 were flagged**, each with the exact reason:
    - row 7: missing name (the name was only spaces)
    - row 8: year 1850 is outside 1900–2027
    - row 9: year 2028 is outside 1900–2027
    - row 11: mileage -5 is negative
    - row 12: email "hank@" doesn't look like an email
    - row 13: vehicle needs both make and model
    - row 18: year "abc" is not a number
  - Year 2027 was accepted.
  - The blank row 16 was skipped, and the row numbers stayed true (2…18 without 16).
  - The email was trimmed and lowercased, the phone was trimmed, and `"45,000 km"` became 45000.
- **Import, run 1.** A customer "Eve Smith", phone 555-0100, was added beforehand.

  | Report line | Count | Rows |
  |---|---|---|
  | Customers created | **5** | Alice, Bob, Carol, Frank, Jack |
  | Merged into existing customers | **4** | Bob (row 4, repeated in the file); Eve (row 6, by phone, into the pre-existing record); "  carol CHEN  " (row 15, by name, no phone); Alice (row 17) |
  | Vehicles added | **6** | |
  | Vehicles already on file | **1** | row 17, same VIN in different case |
  | Rows skipped as already there | **2** | rows 15 and 17 |
  | Rows failed | **7** | the 7 above, same reasons |

  - **Database:** 6 customers and 6 vehicles. There's one "Eve Smith".
  - **Eve:** her row is **byte-for-byte unchanged**, including the old email, the notes and `updated_at`, and the Mazda 3 is under her.
  - **Alice:** her Corolla has every mapped field (2018 Toyota Corolla LE, CVT, 1.8L, VIN, plate "ABC 123", 45000 km). Her notes with a comma are intact.
  - **Bob:** one customer, 2 vehicles, and the multi-line notes are kept.
  - **No customer was created for any failed row.**
- **Import, run 2 (same file):**
  - **0 customers created, 0 vehicles added.**
  - 9 rows were merged, 7 vehicles were already on file, 9 rows were skipped as already there, and the same 7 rows failed.
  - **The customers and vehicles tables are byte-for-byte unchanged:** no inserts and no updates.
- **Fix and re-run:**
  - Rows 8, 11 and 12 were corrected in the file: 3 customers created and 2 vehicles added.
  - The still-broken rows 7, 9, 13 and 18 failed again.
  - Nothing was duplicated: 9 customers and 8 vehicles.
- **More merge/skip cases:**
  - Same phone with a different name merged into the existing customer, and the name wasn't changed.
  - Plate "abc123" matched "ABC 123" and was skipped.
  - With no phone, "Bob Brown" matched by name.
  - A Civic with no VIN and no plate and no year didn't match Bob's 2020 Civic (plate BOB 1), so it was added once.
  - The next row's identical one was skipped (year + make + model).
  - Re-running that file created 0 customers and 0 vehicles.
- **A database error on one row:**
  - A forced year-1800 vehicle hit the database check constraint.
  - Only that row failed, with "customer saved, but the vehicle failed: Failed to add vehicle: … vehicles_year_check".
  - The rows before and after it imported.
- **Cleanup:** 0 customers and 0 vehicles left.

### Regressions
- **Customers page functions:**
  - `fetchCustomers` loads sorted by name, with vehicles embedded.
  - Creating a customer and adding a vehicle through `createCustomer` / `createVehicle`, as the Customers page does, still work.
- **Earlier walkthroughs, rerun on this branch with the updated stand-in, all pass with the same counts as before:**
  - Foundation: 12/12
  - **Appointments: 39/39**
  - **Estimates/invoices: 35/35**
  - **Notifications: 55/55**
  - **Timelogs: 34/34**
  - **Earnings: 31/31**
  - **Admin login: 27/27**
  - Fresh-database migration check: 14/14

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available. These were not exercised by clicking:
  - the file picker
  - the mapping dropdowns
  - the preview table
  - the progress line and the report card
  - the lazy-loaded chunk loading on navigation
  - the new nav item on the desktop and mobile bars

  The walkthrough drove the same functions the page calls. It also repeated the page's
  upload step (decode → parse → first non-blank row is the header) in the script, since
  that handler lives inside the component. The React code was only checked by
  typecheck, lint and build.
- **The REST layer was a stand-in, not real PostgREST.** The customers → vehicles embed in particular was newly added to the stand-in for this prompt.
- **Not applied live.** Nothing was imported into the real database, and nothing was deployed.
- **No real AutoLeap export was tried,** because none exists yet. The walkthrough file was written to look like an unfamiliar export.

## Open items

1. **Vehicles with no VIN and no plate** are matched on year + make + model (see Row rules). That keeps re-runs from duplicating them. The flip side is that a customer with two identical cars and no VIN or plate would get only one. Please confirm, or choose a different rule.
2. **Split names:** if the export has separate "First Name" and "Last Name" columns, only one column can be mapped to Name (as specified). The guess picks the first one. Joining two columns would be a small follow-up if the real file needs it.
3. **Phone matching is an exact match of the trimmed text.** "(555) 010-0100" and "555-010-0100" are different phones to the import, so they won't merge. Matching on digits only would merge them, but would go beyond "trimmed, not reformatted". It's worth a look once the real file is seen.
4. **Merging never updates a customer.** Data in the CSV that's newer than the app's copy (for example a changed email) isn't applied. That's by design, per the spec.
5. **Miles vs km:** a mileage column is imported as km as-is. If the export is in miles, the numbers will be wrong, and nothing in the file says which unit it uses.
6. **Large files** import one row at a time (one request per create). That's fine for a shop's customer list, around a few thousand rows. Nothing was tuned for very large files.

Not opened as a PR (Muse opens it), not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
