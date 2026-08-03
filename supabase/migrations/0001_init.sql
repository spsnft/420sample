-- 420 Store — client / prescription (PT.33) / purchase tracking
--
-- Single-tenant schema: one shop per deployment, no tenant_id. Cloning this for
-- a new client is a new Supabase project + a fresh run of this migration, not a
-- shared multi-tenant database.

-- ---------------------------------------------------------------------------
-- staff — one row per Supabase Auth user who can use the /staff tool.
-- ---------------------------------------------------------------------------
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'staff' check (role in ('staff', 'owner')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  line_id text,
  id_number text,
  first_visit_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index clients_name_idx on public.clients (lower(name));

-- ---------------------------------------------------------------------------
-- prescriptions — one PT.33 certificate. expiry_date is always issue_date+30d;
-- status is never stored, it's derived (see prescriptions_view below).
-- ---------------------------------------------------------------------------
create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  pt33_number text not null unique,
  issue_date date not null,
  expiry_date date generated always as (issue_date + 30) stored,
  doctor text,
  -- Manual override on top of the date-derived status: lost card / suspected
  -- fraud can revoke a still-dated-valid prescription. Never auto-set.
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create index prescriptions_client_id_idx on public.prescriptions (client_id);
create index prescriptions_pt33_number_idx on public.prescriptions (lower(pt33_number));

-- ---------------------------------------------------------------------------
-- purchases
-- ---------------------------------------------------------------------------
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null default now(),
  client_id uuid not null references public.clients (id) on delete restrict,
  prescription_id uuid not null references public.prescriptions (id) on delete restrict,
  product text not null,
  quantity numeric(6, 2) not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0),
  staff_id uuid not null references public.staff (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index purchases_prescription_id_idx on public.purchases (prescription_id);
create index purchases_client_id_idx on public.purchases (client_id);

-- ---------------------------------------------------------------------------
-- is_staff() — RLS helper. security definer so it can read public.staff
-- regardless of the caller's own row-level access to that table.
-- ---------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.staff where auth_user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- prescriptions_view — the read model the app actually queries.
-- status: revoked > expired (by date) > active. quota_used_g: lifetime sum of
-- purchases against this prescription, which is equivalent to "purchases in
-- the last 30 days from issue_date" since a prescription only accepts
-- purchases while it's the client's current cert for that window.
-- security_invoker so it respects the querying role's RLS, not the view
-- owner's (Postgres 15+, which Supabase runs).
-- ---------------------------------------------------------------------------
create or replace view public.prescriptions_view
with (security_invoker = true) as
select
  p.id,
  p.client_id,
  p.pt33_number,
  p.issue_date,
  p.expiry_date,
  p.doctor,
  p.revoked,
  case
    when p.revoked then 'revoked'
    when current_date > p.expiry_date or current_date < p.issue_date then 'expired'
    else 'active'
  end as status,
  coalesce(u.quantity_used, 0) as quota_used_g,
  c.name as client_name,
  c.phone as client_phone,
  c.line_id as client_line_id,
  c.id_number as client_id_number,
  c.first_visit_date as client_first_visit_date
from public.prescriptions p
join public.clients c on c.id = p.client_id
left join lateral (
  select sum(pu.quantity) as quantity_used
  from public.purchases pu
  where pu.prescription_id = p.id
) u on true;

-- ---------------------------------------------------------------------------
-- RLS — every screen in /staff is behind Supabase Auth; any authenticated
-- account with a row in `staff` can read the shop's compliance data.
-- ---------------------------------------------------------------------------
alter table public.staff enable row level security;
alter table public.clients enable row level security;
alter table public.prescriptions enable row level security;
alter table public.purchases enable row level security;

create policy "staff read own profile" on public.staff
  for select using (auth_user_id = auth.uid());

create policy "staff read clients" on public.clients
  for select using (public.is_staff());

create policy "staff read prescriptions" on public.prescriptions
  for select using (public.is_staff());

-- Revoke/un-revoke is the only client-driven write on this table.
create policy "staff update prescriptions" on public.prescriptions
  for update using (public.is_staff()) with check (public.is_staff());

create policy "staff read purchases" on public.purchases
  for select using (public.is_staff());

-- A staff account can only ever record a sale under their own staff_id.
create policy "staff insert purchases" on public.purchases
  for insert with check (
    public.is_staff()
    and staff_id in (select id from public.staff where auth_user_id = auth.uid())
  );
