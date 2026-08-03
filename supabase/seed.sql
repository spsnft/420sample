-- Demo data for the /staff compliance tool.
--
-- Before running this:
--   1. Run migrations/0001_init.sql against your project.
--   2. In the Supabase dashboard: Authentication → Users → Add user, create
--      one login (e.g. demo@yourshop.test) for yourself.
--   3. Copy that user's UID and replace REPLACE_WITH_AUTH_USER_UUID below.
--   4. Run this whole file in the SQL editor.
--
-- All demo purchases are attributed to that one staff account, so only one
-- Auth user is needed to see the full demo end to end.

with staff_row as (
  insert into public.staff (auth_user_id, name, role)
  values ('ca3c264d-8d88-41a5-9699-0916aff5b99b', 'Demo Owner', 'owner')
  returning id
),

-- Somchai Boonmee — active, close to the monthly cap (amber warning demo).
client_somchai as (
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Somchai Boonmee', '+66 81 111 2222', '@somchai_b', 'TH-ID-10293847', current_date - 210)
  returning id
),
rx_somchai as (
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  select id, 'PT33-2026-00142', current_date - 20, 'Dr. Nattapong Srisawat'
  from client_somchai
  returning id, client_id
),
purchases_somchai as (
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  select rx.client_id, rx.id, v.product, v.quantity, v.price, s.id, current_date - v.days_ago
  from rx_somchai rx, staff_row s,
    (values
      ('Flower — Hybrid 20g pack', 10.0, 3400, 18),
      ('Pre-roll x5', 5.0, 1200, 12),
      ('Flower — Sativa', 10.0, 3200, 4)
    ) as v(product, quantity, price, days_ago)
),

-- Elena Petrova — active, fresh certificate, plenty of quota left (green).
client_elena as (
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Elena Petrova', '+66 89 222 3333', '@elena.p', 'RU-PASS-554821', current_date - 5)
  returning id
),
rx_elena as (
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  select id, 'PT33-2026-00198', current_date - 2, 'Dr. Nattapong Srisawat'
  from client_elena
  returning id, client_id
),
purchases_elena as (
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  select rx.client_id, rx.id, 'Pre-roll x3', 3.0, 800, s.id, current_date - 1
  from rx_elena rx, staff_row s
),

-- John Miller — certificate expired 15 days ago (red / blocked demo).
client_john as (
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('John Miller', '+1 555 010 9988', 'john.miller.tr', 'US-PASSPORT-778812', current_date - 400)
  returning id
),
rx_john as (
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  select id, 'PT33-2025-00877', current_date - 45, 'Dr. Kanokwan Boon'
  from client_john
  returning id, client_id
),
purchases_john as (
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  select rx.client_id, rx.id, 'Flower — Indica', 7.0, 2400, s.id, current_date - 40
  from rx_john rx, staff_row s
),

-- Anna Wilson — dates still valid, but manually revoked (lost card / fraud demo).
client_anna as (
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Anna Wilson', '+44 7700 900123', 'anna.wilson.uk', 'UK-PASSPORT-330219', current_date - 60)
  returning id
),
rx_anna as (
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor, revoked)
  select id, 'PT33-2026-00151', current_date - 6, 'Dr. Kanokwan Boon', true
  from client_anna
  returning id, client_id
),
purchases_anna as (
  insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
  select rx.client_id, rx.id, 'Flower — Hybrid', 5.0, 1700, s.id, current_date - 5
  from rx_anna rx, staff_row s
),

-- Maria Santos — active, exactly at the 30g cap (no room left, new sale should block).
client_maria as (
  insert into public.clients (name, phone, line_id, id_number, first_visit_date)
  values ('Maria Santos', '+63 917 123 4567', '@maria.santos', 'PH-PASSPORT-990441', current_date - 120)
  returning id
),
rx_maria as (
  insert into public.prescriptions (client_id, pt33_number, issue_date, doctor)
  select id, 'PT33-2026-00120', current_date - 12, 'Dr. Nattapong Srisawat'
  from client_maria
  returning id, client_id
)
insert into public.purchases (client_id, prescription_id, product, quantity, price, staff_id, date)
select rx.client_id, rx.id, v.product, v.quantity, v.price, s.id, current_date - v.days_ago
from rx_maria rx, staff_row s,
  (values
    ('Flower — Sativa 20g pack', 20.0, 6400, 10),
    ('Pre-roll x10', 10.0, 2200, 6)
  ) as v(product, quantity, price, days_ago);
