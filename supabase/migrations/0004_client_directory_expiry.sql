-- The one-line client-list row (name + PT.33 + a date, see ClientDirectoryTable)
-- needs an actionable date next to the PT.33 number — expiry, not issue, since
-- "expires soon" is what a staff member scanning the list actually needs.
-- clients_directory_view didn't expose it at all before this.
--
-- expiry_date is appended at the end of the select list (not inserted among
-- the existing columns) because CREATE OR REPLACE VIEW only allows adding
-- new output columns at the end — reordering or inserting mid-list would
-- error.
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
  ) as last_visit_at,
  pv.expiry_date
from public.clients c
left join public.prescriptions_view pv on pv.client_id = c.id
left join lateral (
  select max(pu.date) as last_purchase_date
  from public.purchases pu
  where pu.client_id = c.id
) lp on true
order by c.id, pv.issue_date desc nulls last;

grant select on public.clients_directory_view to authenticated;
