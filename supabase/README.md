# Supabase setup — client / PT.33 / purchase tracking (`/staff`)

Single-tenant: one Supabase project per shop deployment. Cloning this for a
new client is a new project + a fresh run of this migration, not a shared
database with a `tenant_id`.

## 1. Create the project

Create a project at [supabase.com](https://supabase.com), or run one locally
with the Supabase CLI. Note the project URL and anon key
(Project Settings → API).

## 2. Run the migration

In the Supabase SQL editor, run `migrations/0001_init.sql`. It creates:

- `staff`, `clients`, `prescriptions`, `purchases` tables
- `prescriptions_view` — the derived status (`active` / `expired` / `revoked`)
  and monthly quota usage the app actually queries
- table/view GRANTs for the `authenticated` role and RLS policies gating
  everything behind a matching row in `staff`

## 3. Create your first login

Dashboard → Authentication → Users → Add user. This is the only account
creation path for v1 — there's no sign-up screen, staff logins are
provisioned manually (or via a future admin flow).

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

## Notes

- **Quota**: 30g/month is a fixed constant (`src/lib/staff/constants.ts`),
  not a DB column. `prescriptions_view` sums `purchases.quantity` for a given
  `prescription_id` — since a prescription only ever accepts purchases while
  it's active, this is equivalent to "purchases in the last 30 days from
  `issue_date`".
- **No client/prescription intake screen in v1.** The three specced screens
  are search → card → new sale. New clients/prescriptions go in directly via
  Supabase for now.
- **Adding staff later**: insert a row into `public.staff` with the new
  Auth user's UID, a name, and a role (`staff` or `owner`).
