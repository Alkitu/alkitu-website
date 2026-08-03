-- Stripe webhook writes now go through the service-role client
-- (lib/supabase/service.ts), which bypasses RLS on the strength of the
-- webhook's own signature check — not on the strength of these policies.
--
-- Until this migration, stripe_events and stripe_subscriptions had
-- anon/authenticated INSERT and UPDATE with WITH CHECK (true): anyone holding
-- the public anon key (shipped in every page load) could insert a fake
-- stripe_events row to pre-empt idempotency on a real webhook, or write an
-- arbitrary stripe_subscriptions row directly via the REST API. Both tables
-- were empty in production when this was found, so this closes a live hole
-- rather than remediating an incident.
--
-- Reads stay admin-only (existing admin_read_stripe_events /
-- admin_full_access_stripe_subs policies, untouched here).

DROP POLICY IF EXISTS "anon_insert_stripe_events" ON stripe_events;
DROP POLICY IF EXISTS "anon_update_stripe_events" ON stripe_events;
DROP POLICY IF EXISTS "anon_insert_stripe_subs" ON stripe_subscriptions;
DROP POLICY IF EXISTS "anon_update_stripe_subs" ON stripe_subscriptions;

-- Rollback:
-- CREATE POLICY "anon_insert_stripe_events" ON stripe_events FOR INSERT TO anon, authenticated WITH CHECK (true);
-- CREATE POLICY "anon_update_stripe_events" ON stripe_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "anon_insert_stripe_subs" ON stripe_subscriptions FOR INSERT TO anon WITH CHECK (true);
-- CREATE POLICY "anon_update_stripe_subs" ON stripe_subscriptions FOR UPDATE TO anon USING (true) WITH CHECK (true);
