# Stage 2, prompt 9: Repair Guides (shop-entered library)

Branch: `feat/repair-guides-20261116` (base: `main` @ `ecda62c`, Stage 2 prompt 8 / CSV import merged as PR #9)

**Precondition checked before building.** I checked out `main` and pulled. It was already
up to date at `ecda62c`, "Stage 2: CSV import (customers + vehicles) (#9)".
`src/pages/Import.tsx` exists, and `src/components/Layout.tsx` has the `import` nav item
(`{ name: 'import' }` in `View`, `{ name: 'import', label: 'Import' }` in `NAV_ITEMS`).
The branch was cut from that commit.

## What was built

A **Repair Guides** page: a library of the shop's own reference material in four tabs,
**Procedures / Specs / Wiring / Bulletins**, with search, a make/model filter, a detail
view, and create / edit / delete.

**Every guide is typed in by the shop.** There's no ProDemand or other feed, no API call,
no scraping and no seed content. The table starts empty.

### 1. Migration: `supabase/migrations/20261116030000_repair_guides.sql` (new)
- **Version** `20261116030000` comes after the latest existing `20261116020000` (timelogs), so there's no collision.
- **Enum `repair_guide_category`:** `procedure`, `spec`, `wiring`, `bulletin`. It uses the same plain `create type` as the foundation migration's enums.
- **Table `repair_guides`:**
  - `id` uuid, default `gen_random_uuid()`
  - `title` text not null
  - `category` repair_guide_category not null
  - `content` text not null
  - `vehicle_make`, `vehicle_model` text null
  - `year_from`, `year_to` int null
  - `created_at`, `updated_at` timestamptz, default `now()`
- **`updated_at` trigger** `set_repair_guides_updated_at`. It reuses the foundation's `public.set_updated_at()`.
- **RLS on**, with the `authenticated_full_access` policy, word for word as in the timelogs migration.
- **Index** on `(category, title)`.
- **Database checks** as a backstop for the app's validation (an addition to the spec, confirmed to keep):
  - title and content can't be blank
  - `year_from` and `year_to` must be ≥ 1900
  - `year_to` must be ≥ `year_from` when both are set

  The upper limit ("next year") moves with the calendar, so it's enforced only in the app.
- **No seed rows.** Additive only: no existing table is changed.

### 2. Type: `src/lib/types.ts`
- `RepairGuide` and `RepairGuideCategory`, next to the other table types.
- `REPAIR_GUIDE_CATEGORIES`, plus the tab labels (Procedures…) and the single-guide labels (Procedure…).

### 3. Data functions: `src/lib/data.ts`
They follow the existing pattern: `requireClient()`, `.from('repair_guides')`, and `throwIfError(error, 'Failed to …')`.
- `fetchRepairGuides()` returns all guides, sorted by title.
- `createRepairGuide(input)` inserts and returns the row with `.select('*').single()`.
- `updateRepairGuide(id, input)` saves every field. An id that no longer exists gets "That guide no longer exists."
- `deleteRepairGuide(id)` deletes that one row only. A second delete gets "That guide was already deleted."
- `validateRepairGuide(input, now?)` runs inside create and update **before any request**. If it throws, nothing is sent. It:
  - trims the title, content, make and model
  - stores an empty make or model as null
  - checks the rules listed under Validation below
- `filterRepairGuides(guides, { category, search, make, model })` is a pure function for the tabs, search and filter. It runs in the browser, since the library holds one shop's own notes.

All writes go through these functions. There are no raw inserts anywhere else.

### 4. Page: `src/pages/RepairGuides.tsx` (new) + nav/routing
- **Library:**
  - The search box matches title **or** content, case-insensitive.
  - **Vehicle make** and **Vehicle model** inputs. The model input is disabled until a make is typed.
  - Four tabs, each showing the count of guides that match the current search and filter.
  - The list shows title, "applies to" (for example "Toyota Camry · 2018–2022", "Honda · up to 2019" or "All vehicles") and a short preview of the content.
  - The empty state says "No procedures yet. Use 'New guide' to add one", or "… match this search" when a search or filter is active.
- **Detail view:**
  - Category badge, full title, "Applies to" with make, model and year range.
  - Full content, with line breaks kept.
  - Last-updated time.
  - Edit and Delete buttons.
- **Create / edit form:**
  - Title\*, category\*, make, model, year from, year to, content\*.
  - A new guide starts in the category of the open tab.
  - A failed validation shows the reason in a red banner on the form and saves nothing. The form keeps what was typed.
- **Delete** has a confirm step: "Delete '…'? Only this guide is deleted. This cannot be undone." with **Yes, delete** and **Cancel**.

**Make/model rule:**
- A guide with **no make** always matches.
- A guide with a make matches only when its make **equals** the typed make (trimmed, case-insensitive). Typing "toy" does not find Toyota.
- If a model is also typed and the guide has a model, the guide's model must **equal** it (trimmed, case-insensitive). Typing "cam" does not find Camry.
- A guide with a make but **no model** applies to every model of that make.

**Validation:**
- Title, category and content are required. Spaces alone count as empty.
- Year from and year to, when set, must be **whole numbers from 1900 to next year** (2027 today).
- Year to can't be before year from. Equal years are allowed.

**Navigation:**
- `View` gains `{ name: 'guides' }`, and `NAV_ITEMS` gains "Repair Guides", on both the desktop and mobile bars.
- `App.tsx` routes it.
- The page is **lazy-loaded** the same way as Import (`React.lazy` + `Suspense`).

**Not touched:** there are no new npm dependencies and no secrets. The admin login,
`AuthContext`, Login and every other page are unchanged. The only edits to existing files
are:
- the two lines in `Layout.tsx` (plus a "Nine items" comment fix)
- the lazy import and route in `App.tsx`
- the additions in `types.ts` and `data.ts`, with the new imports there

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings.
- `npm run build`: OK, with **no warnings**.
  - The main chunk is **490.79 kB**, under 500 kB. It was 488.27 kB on `main`; the +2.5 kB is the data functions and types.
  - RepairGuides is its own chunk, 8.58 kB.
  - Import is unchanged at 13.99 kB.

### Repair guides walkthrough (91/91 checks pass)
**How it was run:**
- The same harness as the earlier prompts.
- The project's real `data.ts` was loaded through the project's own Vite and wrote through real supabase-js.
- Requests went to the local stand-in for the Supabase REST API, backed by a fresh PGlite database with all migrations applied in order.
- The real clock was used (16 Nov 2026), so the accepted years are 1900–2027.
- **Stand-in change:** `repair_guides` was added to its table list. That was the only change. The new functions use only filters and embeds that it already supported.

**Schema:**
- All 6 migrations applied cleanly in order, with the new one last.
- `repair_guides` exists with RLS on. There are now **14 tables, all with RLS**.
- There's exactly **one** policy: `authenticated_full_access`, ALL, `authenticated`, `true`/`true`.
- **The enum has exactly 4 values,** in order: procedure, spec, wiring, bulletin.
- The columns, types and nullability match the spec. The defaults are `gen_random_uuid()` and `now()`, and the trigger is present.
- **The table is empty after migrating,** so there's no seed.
- `anon` reads 0 rows and its insert is refused by RLS.
- The database backstop refuses a blank title, blank content, year 1899, year to before year from, and an unknown category.

**CRUD with the real data functions, with counts checked at each step:**

| Step | Count |
|---|---|
| Create procedure: Toyota Camry 2018–2022, title with surrounding spaces (trimmed) | 1 |
| Create spec: **no make, model or years**, stored as nulls | 2 |
| Create wiring: Ford F-150, from 2015 | 3 |
| Create bulletin: Honda, no model, up to 2019 | 4 |
| Create second procedure: no make | 5 |
| **Edit** the spec's content | 5 |
| **Delete** the wiring guide | **4** |
| Re-add a wiring guide for the tab checks | 5 |

- `fetchRepairGuides` returned all 5, sorted by title.
- **Edit:**
  - The content changed and `updated_at` moved forward. `created_at` was kept.
  - **The other 4 rows were byte-for-byte unchanged.**
  - A make set later is saved, and clearing it stores null again.
- **Delete:**
  - The deleted guide is gone.
  - **The other 4 rows were byte-for-byte unchanged.**
  - Deleting it again, or editing it, is refused with a clear message.

**Tabs, search and filter, using the page's own `filterRepairGuides` on the fetched list:**
- **Tabs:** Procedures shows 2, Specs 1, Wiring 1 and Bulletins 1. Each lists only its own category.
- **Search:**
  - "torque" finds the spec by its title ("Wheel nut torque chart") **and** the Camry procedure by its content ("TORQUE: 107 Nm").
  - "  PINOUT " (any case, padded) finds the wiring guide.
  - "master cylinder" matches on content alone.
  - **A nonsense term finds nothing.**
  - Search also works inside a single tab.
- **Make/model filter:**
  - **"toyota" shows the Camry guide plus the 2 no-make guides, and hides the Ford and Honda guides.**
  - Toyota + "corolla" hides the Camry guide, and the no-make guides still show.
  - TOYOTA + "  CAMRY " shows the Camry guide.
  - **Exact model match:** Toyota + "cam" hides the Camry guide (no-make guides still show), and Ford + "F-150 Raptor" does not match the F-150 guide.
  - Honda + "Civic" shows the Honda bulletin, which has no model, so it applies to every Honda.
  - **Exact make match:** "toy" shows only the no-make guides (not Toyota), "  TOYOTA  " matches Toyota, and "Ford Motor" does not match Ford.
  - "tesla" shows only the no-make guides.
  - The filter also works inside a single tab.
  - A model with no make doesn't filter (the page disables the model input until a make is typed).

**Validation:** each case is refused with its reason, on both **create and edit**:

| Input | Reason shown |
|---|---|
| Empty title | "A title is required." |
| Title of only spaces | "A title is required." |
| Empty content | "The guide content is required." |
| Content of only spaces or newlines | "The guide content is required." |
| Year from 1899 | "Year from must be between 1900 and 2027." |
| Year to 1899 | "Year to must be between 1900 and 2027." |
| Year from 2028 | "Year from must be between 1900 and 2027." |
| 2020 → 2018 | "Year to cannot be before year from." |
| "abc" | "… must be a whole year, like 2018." |
| 2018.5 | "… must be a whole year, like 2018." |
| Unknown category | "Pick a category." |

- **After the 11 refused creates, the count was still 5 and the rows were unchanged. After the 11 refused edits, every row was byte-for-byte unchanged.**
- 1900 and 2027 were accepted, and so was year to equal to year from.
- With a fixed "now" in 2030, 2031 was accepted, so the limit moves with the calendar.

**Cleanup:** 0 guides, 0 customers and 0 vehicles were left.

### Regressions
- **Customers page functions:**
  - Creating a customer and adding a vehicle with `createCustomer` / `createVehicle`, as the Customers page does, still work.
  - `fetchCustomers` returns the customer with the vehicle embedded.
- **Earlier walkthroughs, rerun on this branch, all pass with the same counts as on PR #9:**
  - Foundation/services: 12/12
  - **Appointments: 39/39**
  - **Estimates/invoices: 35/35**
  - **Notifications: 55/55**
  - **Timelogs: 34/34**
  - **Earnings: 31/31**
  - **Admin login: 27/27**
  - **CSV import: 71/71**
  - Fresh-database migration check: 14/14

  Three of those scripts pinned the old schema shape ("5 migrations", "13 tables").
  Those assertions were updated to 6 migrations and 14 tables. Nothing else in them changed.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available. These were not exercised by clicking:
  - the tabs and their counts
  - the search and filter inputs
  - the detail view
  - the form, and its error banner
  - the delete confirm step
  - the lazy chunk loading on navigation
  - the new nav item on the desktop and mobile bars

  The walkthrough drove the same functions the page calls. The React code was only
  checked by typecheck, lint and build.
- **The page's form → input conversion was not run.** It turns '' into "not set" and any other text into a number, so "abc" becomes NaN. That code is inside the component. The walkthrough fed the same values straight to the data functions.
- **The REST layer was a stand-in, not real PostgREST.**
- **Not applied live.** The migration was not run on the real Supabase project, no guide was created there, and nothing was deployed.

## Open items

1. **Decided:** the database checks stay, and make and model filters are both exact matches (trimmed, case-insensitive). A misspelt make or model in a guide ("Toyta", "Camary") won't match; the shop fixes it by editing the guide.
2. **No year filter.** The filter is make/model only, as specified. The guide's year range is shown but not used to filter. A year box could be added later.
3. **Content is plain text.** There are no images, PDFs or wiring diagrams as files. Line breaks are kept, and the content box uses a monospace font so pin tables line up. Attachments would need storage, which is out of scope here.
4. **Filtering happens in the browser** after loading every guide. That's fine for a shop's own library, even a few thousand guides. Nothing was tuned for more.
5. **Applying the migration** to the live project is a manual step, like the earlier migrations.

Not opened as a PR (Muse opens it), not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
