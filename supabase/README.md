# Supabase setup — client / PT.33 / purchase tracking (`/staff`)

Single-tenant: one Supabase project per shop deployment. Cloning this for a
new client is a new project + a fresh run of this migration, not a shared
database with a `tenant_id`.

## 1. Create the project

Create a project at [supabase.com](https://supabase.com), or run one locally
with the Supabase CLI. Note the project URL and anon key
(Project Settings → API).

## 2. Run the migrations

In the Supabase SQL editor, run, in order:

- `migrations/0001_init.sql`
- `migrations/0002_client_directory.sql`
- `migrations/0003_intake_and_signup.sql`
- `migrations/0004_client_directory_expiry.sql`
- `migrations/20260821123437_reset_demo.sql` — **buds.digital demo project only** (see
  "Nightly demo reset" below); skip this one on a real client instance.

Together they create:

- `staff`, `clients`, `prescriptions`, `purchases`, `client_views`,
  `staff_invites` tables
- `prescriptions_view` — the derived status (`active` / `expired` / `revoked`)
  and monthly quota usage the app actually queries
- `clients_directory_view` — one row per client (latest prescription status +
  last-visit date) behind the "Recently Viewed" strip and the paginated
  client list on `/staff`
- `create_client_with_prescription()` / staff insert policies on
  `clients`/`prescriptions` — powers the "New Client" intake screen
- `redeem_staff_invite()` — the only path (besides step 3 below) that can
  create a `staff` row, gated by a valid, unexpired `staff_invites` code
- table/view GRANTs for the `authenticated` role and RLS policies gating
  everything behind a matching row in `staff`

## 3. Create your first login

Dashboard → Authentication → Users → Add user. This is the only account
creation path that doesn't need an invite code — every other staff account is
provisioned via an invite (see "Adding staff" below).

Copy the new user's UID (shown in the Users table).

## 4. Seed demo data (optional, recommended for the sales demo)

Open `seed.sql`, replace `REPLACE_WITH_AUTH_USER_UUID` with the UID from
step 3, and run it in the SQL editor. It creates five demo clients covering
each state the UI needs to show: active with room left, active near the
30g cap, active at the cap, expired, and manually revoked.

## 5. Configure the app

Set in `.env` (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Sign in at `/staff/login` with the account from step 3.

## Demo login for buds.digital

The "Live Demo" button on the B2B pitch page (`/`, buds.digital's apex) does
not bypass `/staff` auth — it signs in a dedicated demo account via a server
action. Set in `.env`:

```
DEMO_STAFF_EMAIL=demo@buds.digital
DEMO_STAFF_PASSWORD=your-password
```

This must be the Auth user you created in step 3 above and seeded in step 4
(`seed.sql`'s "Demo Owner"). Leave both unset on real client instances —
the button just shows a "not configured" message instead of an auth bypass,
so this never becomes a code path a real dispensary's deployment depends on.

Separately, set `DEMO_AUTO_LOGIN=1` on the buds.digital demo instance to
have `middleware.ts` sign an unauthenticated `/staff` visitor in as this
same account instead of redirecting to `/staff/login` — so a bare `/staff`
link never shows a prospect a login form either. Leave unset on real client
instances; without it, auth behaves exactly as described above.

## Nightly demo reset

`migrations/20260821123437_reset_demo.sql` defines `reset_demo()` and
schedules it via `pg_cron` (not Vercel Cron — this runs inside the Postgres
instance, not the Next.js deployment) for 22:00 UTC / 05:00 ICT every day.
It deletes whatever a prospect clicking around the live demo added, edited
or revoked in
`clients`/`prescriptions`/`purchases`/`client_views` and re-inserts the same
five demo profiles `seed.sql` seeds — `public.staff` and
`public.staff_invites` are never touched, so the demo login
(`DEMO_STAFF_EMAIL`/`DEMO_AUTO_LOGIN` above) keeps working across every
reset.

This migration is **buds.digital-only** — do not run it on a real client's
project; there's nothing there for it to reset, and it would just leave an
unused nightly cron job in their database.

Required order, on the buds.digital project:

1. Run `seed.sql` (step 4) first so the "Demo Owner" staff row `reset_demo()`
   looks up already exists.
2. Enable the `pg_cron` extension — **Database → Extensions** in the
   Supabase dashboard. This is a separate, one-time step the migration
   deliberately doesn't attempt itself: unlike a normal extension, pg_cron
   needs `shared_preload_libraries` set at the Postgres instance level,
   which a plain `CREATE EXTENSION` run from a migration can't do on
   Supabase — it errors.
3. Only then run `migrations/20260821123437_reset_demo.sql`. Run out of
   order (pg_cron not enabled yet), it fails with one clear error telling
   you to enable the extension first, rather than a bare "schema cron does
   not exist".

## Notes

- **Quota**: 30g/month is a fixed constant (`src/lib/staff/constants.ts`),
  not a DB column. `prescriptions_view` sums `purchases.quantity` for a given
  `prescription_id` — since a prescription only ever accepts purchases while
  it's active, this is equivalent to "purchases in the last 30 days from
  `issue_date`".
- **Client/prescription intake**: the "New Client" button on `/staff` creates
  a client and their first PT.33 together (`create_client_with_prescription`,
  one transaction). "New Rx" on an existing client's card adds a renewal
  prescription to that same client.
- **Adding staff — invite flow**: any owner can open `/staff/invites`,
  generate a code (staff or owner role, expires in 7 days), and share the
  `/staff/signup?code=...` link. Signup is invite-only — there's no open
  registration; `redeem_staff_invite()` validates the code and is the only
  way (besides manual provisioning below) a `staff` row gets created.
  Requires **email confirmations disabled** on this Supabase project
  (Authentication → Providers → Email), since the invite is redeemed in the
  same request as sign-up and needs an active session to do it — if
  confirmations are on, the auth user is created but never gets a `staff`
  row, and needs manual provisioning below to finish.
- **Adding staff — manual**: insert a row into `public.staff` with the new
  Auth user's UID, a name, and a role (`staff` or `owner`). Still the only
  path for the very first account (step 3 above), since generating an invite
  requires an existing owner.
