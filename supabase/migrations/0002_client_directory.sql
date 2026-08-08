-- Client directory for /staff: per-staff "recently viewed" tracking plus a
-- one-row-per-client read model for the paginated client list.

-- ---------------------------------------------------------------------------
-- client_views — one row per (staff, client), bumped every time that staff
-- member opens the client's card. Powers the "Recently Viewed" strip.
-- ---------------------------------------------------------------------------
create table public.client_views (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (staff_id, client_id)
);

create index client_views_staff_viewed_idx on public.client_views (staff_id, viewed_at desc);

grant select, insert, update on public.client_views to authenticated;

alter table public.client_views enable row level security;

create policy "staff read own views" on public.client_views
  for select using (staff_id in (select id from public.staff where auth_user_id = auth.uid()));

create policy "staff insert own views" on public.client_views
  for insert with check (staff_id in (select id from public.staff where auth_user_id = auth.uid()));

create policy "staff update own views" on public.client_views
  for update using (staff_id in (select id from public.staff where auth_user_id = auth.uid()))
  with check (staff_id in (select id from public.staff where auth_user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- clients_directory_view — one row per client for the full client list:
-- their most recent prescription (status reused as-is from prescriptions_view
-- so "active/expired/revoked" is computed in exactly one place) plus a
-- last-visit timestamp derived from their most recent purchase, falling back
-- to first_visit_date for a client who hasn't bought anything yet.
-- security_invoker so it respects the querying role's RLS, same as
-- prescriptions_view.
-- ---------------------------------------------------------------------------
create or replace view public.clients_directory_view
with (security_invoker = true) as
select distinct on (c.id)
  c.id as client_id,
  c.name as client_name,
  c.created_at as client_created_at,
  c.first_visit_date,
  pv.pt33_number,
  pv.status,
  greatest(
    coalesce(lp.last_purchase_date, c.first_visit_date::timestamptz),
    c.first_visit_date::timestamptz
  ) as last_visit_at
from public.clients c
left join public.prescriptions_view pv on pv.client_id = c.id
left join lateral (
  select max(pu.date) as last_purchase_date
  from public.purchases pu
  where pu.client_id = c.id
) lp on true
order by c.id, pv.issue_date desc nulls last;

grant select on public.clients_directory_view to authenticated;
