# Stage 2, prompt 7: Single admin login + Dashboard paid filter

Branch: `feat/admin-login-20261116` (base: `main` @ `261a30f`, Stage 2 prompt 6 / earnings merged as PR #7)

Before starting I checked that `origin/main` is at `261a30f`, "Stage 2: earnings
(#7)". Its code is identical to the earnings branch.

## What was built

### 1. One login for the whole shop
**`src/context/AuthContext.tsx`**
- **New exports:**
  - `ADMIN_USERNAME = 'admin'`
  - `ADMIN_EMAIL = 'admin@autoleap.local'`, a fixed internal identifier and not a secret. It's the only email value in the code.
  - `LOGIN_FAILED_MESSAGE = 'Wrong username or password.'`
  - `signInAsAdmin(username, password)`
- **`signInAsAdmin`:**
  - Only the exact username `admin` is accepted: lowercase, with no trimming or case-folding.
  - A wrong username is rejected without contacting Supabase, with the same message as a wrong password. It never says which field was wrong.
  - With the right username, it calls `supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })`.
  - Supabase's "invalid credentials" response is mapped to the same generic message. Any other failure (network, unconfirmed account) shows "Couldn't sign in: …" without naming a field.
- **The context's `signIn(username, password)`** now calls `signInAsAdmin`.
- **`signUp` is removed** from both the context type and the provider. The app has no way to create an account.
- **Session handling is unchanged:** `getSession`, `onAuthStateChange`, `signOut`, and the "not configured" setup screen in `App.tsx`. Supabase Auth and the `authenticated` role stay underneath, so every table's RLS works as before.

**`src/pages/Login.tsx`**
- The Email field is replaced by **Username**, with `autocomplete="username"` and auto-capitalise and auto-correct turned off for phones.
- Password and Sign in are unchanged.
- The copy is now **"One login for the whole shop."**
- Removed:
  - the sign-up mode and its "Create your shop account" heading
  - the "No account yet? Create one" toggle
  - the "Account created…" message
  - the email-based copy

**The password is in no repo file.** It isn't in the code, the tests or this
description. It lives only in Supabase Auth. I checked the working tree and the
built bundle for it, and found no match. The walkthrough used a random password
generated for each test run, which was never written anywhere.

### 2. Dashboard paid filter
In `src/lib/data.ts`, `fetchDashboardStats` is the only change, and it's one line:
the paid-invoices query gains `.not('paid_at', 'is', null)`. Dashboard "Collected"
now uses exactly the same definition as Earnings all-time: status `paid` **and**
`paid_at` set. That includes rows edited directly in the database. Nothing else in
`fetchDashboardStats` changed, and no other file changed for this fix.

**Not touched:** appointments, estimates, invoices, timelogs, earnings, notifications,
customers, inspections and session handling. There's no migration and there are no
new dependencies.

## What was verified

### Static checks
- `npm run typecheck`: clean.
- `npm run lint`: 0 findings. The baseline on `main` was also 0, so there are no new findings.
- `npm run build` (`tsc --noEmit && vite build`): OK.

### No sign-up path is left in the app
- **Source:** `src/` has no `signUp`, "Create your shop account", "Create account" or "No account yet". The only match for "create one" is unrelated Dashboard text about repair orders.
- **Built bundle (`dist/assets/*.js`):** none of the old sign-up text is there. "One login for the whole shop", "Wrong username or password." and `admin@autoleap.local` are.
- **Library code:** the supabase-js library still contains its own sign-up method, as every Supabase app does. The app never calls it. See **Required step 2** below: the server must refuse sign-ups too.

### Admin login + Dashboard filter walkthrough (27/27 checks pass)
**How it was run:**
- The project's actual `AuthContext.tsx`, `supabase.ts` and `data.ts` were loaded through the project's own Vite and called through real supabase-js.
- The requests went to the local stand-in for the Supabase API, backed by a fresh PGlite database with all 5 migrations.
- This time the stand-in ran in **auth mode**. It has a minimal password-token endpoint, and each data request runs as `authenticated` only when it carries a token issued by that endpoint. Otherwise it runs as `anon`. So RLS applied exactly as it does live.
- Minimal browser globals (a `localStorage` stub) let supabase-js store the session the way it does in a browser.

**Steps and results:**
- **Exports:** the username is `admin` and the internal email is `admin@autoleap.local`. `AuthContext` exports no sign-up function.
- **Before sign-in:** there's no session, a customer row that exists is hidden by RLS (0 visible), and writes are refused ("new row violates row-level security policy").
- **Wrong username** ("Admin", "admin ", "owner"): each is rejected with "Wrong username or password.", and no request reaches the auth endpoint.
- **Wrong password:** rejected with the **same** message. This one did reach the auth endpoint, so it was rejected by the server.
- **No session** after the failed attempts.
- **`admin` + correct password:** signs in.
  - The session user is `admin@autoleap.local`, and the session is stored in `localStorage`.
  - Data loads through the authenticated session (RLS), writes work, and the Dashboard loads.
- **Reload:** the app modules were thrown away and loaded fresh, which made a new Supabase client instance reading the same `localStorage`.
  - The session was still there, and data still loaded.
- **Dashboard filter:**
  - An invoice paid through the app has `paid_at` set.
  - I added a row with status `paid` and `paid_at` NULL directly in the database.
  - **Dashboard Collected excluded it: 100.00, not 150.00. It equals Earnings all-time (100.00) exactly.**
  - Voiding the paid invoice cleared its `paid_at`, and both figures went to 0.
- **Sign-out:** the session was cleared and removed from `localStorage`, and the token was revoked at the auth endpoint. Data was hidden by RLS again.
- **Cleanup:** all test data was deleted. Every table ended with 0 rows.

### Regression (same bar as before)
- **Appointments: 39/39.**
- **Estimates/invoices: 35/35.**
- **Notifications: 55/55.**
- **Timelogs: 34/34.**
- **Earnings: 31/31.** All-time still equals Dashboard Collected on the same rows: 735.75 = 735.75.
- **Fresh-database migration check:** passes.

The only harness change: the estimates/invoices script still uses its own older copy
of the REST stand-in, from prompt 2. That copy needed the same `not.is.null` filter
the shared stand-in gained for earnings, because the Dashboard query now uses it.

## Steps for Sanad in the Supabase dashboard (required before deploying)

**1. Create the shop's admin account**
- Supabase dashboard → **Authentication** → **Users** → **Add user** (→ Create new user).
- Email: `admin@autoleap.local`
- Password: the one Sanad chose. It is deliberately not written in this repo.
- Tick **Auto Confirm User**, so no confirmation email is needed (this address can't receive mail).
- **Save.**
- Then sign in on the live app with username `admin` and that password.

**2. Turn off new sign-ups (security, do not skip)**
- Supabase dashboard → **Authentication** → **Sign In / Providers** (on some dashboard versions, **Settings**) → turn **off** "Allow new users to sign up" → **Save**.
- **Why:** removing the sign-up screen from the app doesn't stop sign-ups on the server.
  - The anon key is public (it ships inside the app).
  - Anyone could call Supabase's sign-up API directly and get a signed-in session.
  - Every table's RLS gives any signed-in user full access.
- With sign-ups off, only accounts created in the dashboard (step 1) can sign in.

**3. ⚠️ Do NOT delete Sanad's own email Auth account yet.** The live app needs a way
in until the admin account is confirmed working. Removing it is a separate step for
Sanad, after the admin login has been verified on the live app.

## What was NOT verified

- **No click-through of the UI in a browser.** No browser automation was available,
  and there's no local Supabase stack. These were not exercised by clicking:
  - the Login screen itself (Username field, error banner, phone keyboards)
  - a real browser page reload
  - the Sign out button in the header

  The walkthrough exercised the same `signInAsAdmin`, Supabase client and data
  functions the screen uses, with a simulated reload. The React code was only
  checked by typecheck, lint and build.
- **The auth endpoint was a stand-in, not real Supabase Auth (GoTrue), and the REST
  layer was a stand-in, not real PostgREST.**
  - The invalid-credentials error is matched on both its code (`invalid_credentials`) and its message, in case the live response format differs.
  - Real behaviours that weren't exercised: token refresh, real JWT signing, and Supabase's own sign-in rate limits.
- **Not applied live.** The admin account doesn't exist yet (see step 1), and sign-up
  on the server is still governed by the project setting (see step 2). Nothing was
  deployed.

## Open items

1. **Server-side sign-up must be turned off** (step 2). Until it is, the app's single-login design can be bypassed through the public API.
2. **The `.local` address:** `admin@autoleap.local` isn't a deliverable address, and that's intended. If the Supabase dashboard refuses it when adding the user, change the `ADMIN_EMAIL` constant to another fixed address and create the user with that address. It's a one-line change.
3. **Password strength:** the app accepts whatever password is set in Supabase Auth, and it can be changed in the dashboard at any time without a code change.
4. **Sanad's own email account** stays until the admin login is verified live (step 3), then gets removed as a separate step.
5. **The username is visible in the app bundle,** as is the internal email. Only the password is secret, and that's by design for a single shop login. A wrong username simply never reaches Supabase.

Not opened as a PR (Muse opens it), not merged, not deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
