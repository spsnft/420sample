-- Two independent additions, bundled in one migration since both are new
-- for v1: (1) a staff-facing intake screen for new clients/prescriptions,
-- (2) invite-gated self-signup for new staff accounts.

-- ---------------------------------------------------------------------------
-- Intake: staff can now create clients and prescriptions directly (not just
-- read/update them). create_client_with_prescription() wraps both inserts in
-- one transaction so a new client is never left without their first PT.33 —
-- if the prescription insert fails (e.g. duplicate pt33_number), the client
-- insert rolls back with it. security invoker: it runs as the calling staff
-- member, so the grants/policies below still gate it exactly like a direct
-- insert would.
-- ---------------------------------------------------------------------------
grant insert on public.clients to authenticated;
grant insert on public.prescriptions to authenticated;

create policy "staff insert clients" on public.clients
  for insert with check (public.is_staff());

create policy "staff insert prescriptions" on public.prescriptions
  for insert with check (public.is_staff());

create or replace function public.create_client_with_prescription(
  p_name text,
  p_phone text,
  p_line_id text,
  p_id_number text,
  p_first_visit_date date,
  p_pt33_number text,
  p_issue_date date,
  p_doctor text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_client_id uuid;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values (p_name, nullif(p_phone, ''), nullif(p_line_id, ''), nullif(p_id_number, ''),
          coalesce(p_first_visit_date, current_date))
  returning id into v_client_id;

  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  values (v_client_id, p_pt33_number, p_issue_date, nullif(p_doctor, ''));

  return v_client_id;
end;
$$;

grant execute on function public.create_client_with_prescription to authenticated;

-- ---------------------------------------------------------------------------
-- Self-signup: gated by an owner-issued invite code, not open registration.
-- redeem_staff_invite() is the only path (besides manual provisioning) that
-- can write public.staff — a brand-new auth user has no staff row yet, so no
-- RLS policy on public.staff would ever let them insert their own; this
-- function runs security definer specifically to make that one narrow,
-- validated exception.
-- ---------------------------------------------------------------------------
create table public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default encode(gen_random_bytes(16), 'hex'),
  role text not null default 'staff' check (role in ('staff', 'owner')),
  created_by uuid not null references public.staff (id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '7 days'),
  used_at timestamptz,
  used_by uuid references public.staff (id) on delete set null,
  created_at timestamptz not null default now()
);

create index staff_invites_code_idx on public.staff_invites (code);

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.staff where auth_user_id = auth.uid() and role = 'owner'
  );
$$;

grant select, insert on public.staff_invites to authenticated;

alter table public.staff_invites enable row level security;

create policy "owners read invites" on public.staff_invites
  for select using (public.is_owner());

create policy "owners create invites" on public.staff_invites
  for insert with check (
    public.is_owner()
    and created_by in (select id from public.staff where auth_user_id = auth.uid())
  );

create or replace function public.redeem_staff_invite(p_code text, p_name text)
returns public.staff
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.staff_invites;
  v_staff public.staff;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if exists (select 1 from public.staff where auth_user_id = auth.uid()) then
    raise exception 'account already provisioned';
  end if;

  select * into v_invite
  from public.staff_invites
  where code = p_code and used_at is null and expires_at > now()
  for update;

  if not found then
    raise exception 'invalid or expired invite code';
  end if;

  insert into public.staff (auth_user_id, name, role)
  values (auth.uid(), p_name, v_invite.role)
  returning * into v_staff;

  update public.staff_invites
  set used_at = now(), used_by = v_staff.id
  where id = v_invite.id;

  return v_staff;
end;
$$;

grant execute on function public.redeem_staff_invite to authenticated;
