-- Nightly reset for the buds.digital demo instance only — not part of the
-- schema a real client instance needs, but harmless there since nothing
-- calls it without the pg_cron job this file also schedules, and that job
-- is only ever created on the demo project.
--
-- reset_demo() clears the demo clients/prescriptions/purchases (whatever a
-- prospect clicking around the live demo has added, edited or revoked) and
-- restores the same five profiles supabase/seed.sql seeds, so the demo
-- always looks the same at the start of a day. It never touches
-- public.staff or public.staff_invites — DEMO_STAFF_EMAIL/PASSWORD and
-- DEMO_AUTO_LOGIN (see .env.example, middleware.ts) must keep signing in
-- the same account after every reset, and a reset is not the moment to
-- silently invalidate an in-progress staff invite.
--
-- This migration only defines the function and schedules the cron job — it
-- does not seed anything itself. Run supabase/seed.sql once first (its own
-- README step 4) so the "Demo Owner" staff row this function looks up
-- already exists; reset_demo() raises instead of silently no-op'ing if it
-- doesn't.
create or replace function public.reset_demo()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_staff_id uuid;
  v_client_id uuid;
  v_rx_id uuid;
begin
  -- The same Auth user seed.sql provisions as "Demo Owner". Restored
  -- purchases are reattached to this one existing staff row rather than a
  -- freshly inserted one — the whole point is that the demo login keeps
  -- working across a reset, not that the data merely looks the same.
  select id into v_staff_id
  from public.staff
  where auth_user_id = 'ca3c264d-8d88-41a5-9699-0916aff5b99b';

  if v_staff_id is null then
    raise exception 'reset_demo(): demo staff account not found — run supabase/seed.sql first';
  end if;

  -- purchases first: both its client_id and prescription_id are ON DELETE
  -- RESTRICT (see 0001_init.sql), so clients can't go while purchases still
  -- reference them. Deleting clients then cascades to prescriptions
  -- (ON DELETE CASCADE) and to client_views (same), so neither needs its
  -- own statement here.
  delete from public.purchases;
  delete from public.clients;

  -- Somchai Boonmee — active, close to the monthly cap (amber warning demo).
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Somchai Boonmee', '+66 81 111 2222', '@somchai_b', 'TH-ID-10293847', current_date - 210)
  returning id into v_client_id;
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  values (v_client_id, 'PT33-2026-00142', current_date - 20, 'Dr. Nattapong Srisawat')
  returning id into v_rx_id;
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  select v_client_id, v_rx_id, v.product, v.quantity, v.price, v_staff_id, current_date - v.days_ago
  from (values
    ('Flower — Hybrid 20g pack', 10.0, 3400, 18),
    ('Pre-roll x5', 5.0, 1200, 12),
    ('Flower — Sativa', 10.0, 3200, 4)
  ) as v(product, quantity, price, days_ago);

  -- Elena Petrova — active, fresh certificate, plenty of quota left (green).
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Elena Petrova', '+66 89 222 3333', '@elena.p', 'RU-PASS-554821', current_date - 5)
  returning id into v_client_id;
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  values (v_client_id, 'PT33-2026-00198', current_date - 2, 'Dr. Nattapong Srisawat')
  returning id into v_rx_id;
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  values (v_client_id, v_rx_id, 'Pre-roll x3', 3.0, 800, v_staff_id, current_date - 1);

  -- John Miller — certificate expired 15 days ago (red / blocked demo).
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('John Miller', '+1 555 010 9988', 'john.miller.tr', 'US-PASSPORT-778812', current_date - 400)
  returning id into v_client_id;
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  values (v_client_id, 'PT33-2025-00877', current_date - 45, 'Dr. Kanokwan Boon')
  returning id into v_rx_id;
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  values (v_client_id, v_rx_id, 'Flower — Indica', 7.0, 2400, v_staff_id, current_date - 40);

  -- Anna Wilson — dates still valid, but manually revoked (lost card / fraud demo).
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Anna Wilson', '+44 7700 900123', 'anna.wilson.uk', 'UK-PASSPORT-330219', current_date - 60)
  returning id into v_client_id;
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor, revoked)
  values (v_client_id, 'PT33-2026-00151', current_date - 6, 'Dr. Kanokwan Boon', true)
  returning id into v_rx_id;
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  values (v_client_id, v_rx_id, 'Flower — Hybrid', 5.0, 1700, v_staff_id, current_date - 5);

  -- Maria Santos — active, exactly at the 30g cap (no room left, new sale should block).
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Maria Santos', '+63 917 123 4567', '@maria.santos', 'PH-PASSPORT-990441', current_date - 120)
  returning id into v_client_id;
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  values (v_client_id, 'PT33-2026-00120', current_date - 12, 'Dr. Nattapong Srisawat')
  returning id into v_rx_id;
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  select v_client_id, v_rx_id, v.product, v.quantity, v.price, v_staff_id, current_date - v.days_ago
  from (values
    ('Flower — Sativa 20g pack', 20.0, 6400, 10),
    ('Pre-roll x10', 10.0, 2200, 6)
  ) as v(product, quantity, price, days_ago);
end;
$$;

-- Deliberately no `grant execute ... to authenticated` — this is an
-- administrative reset, not something the app's own client role should ever
-- be able to trigger. Reachable only via pg_cron below (which runs as the
-- role that scheduled it) or a manual call from the Supabase SQL editor.

-- Supabase installs pg_cron per-project into the `extensions` schema; the
-- `cron` schema and its cron.schedule()/cron.job objects come from the
-- extension itself regardless of where it's installed.
create extension if not exists pg_cron with schema extensions;

-- Named so re-running this migration updates the existing job instead of
-- creating a duplicate (cron.schedule upserts by job name). 22:00 UTC is
-- 05:00 ICT — the shop's own quiet hours, not something a live prospect
-- would ever be mid-demo through.
select cron.schedule(
  'reset-demo-daily',
  '0 22 * * *',
  $$select public.reset_demo();$$
);
