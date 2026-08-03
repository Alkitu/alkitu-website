-- =====================================================
-- RLS initplan optimization
-- =====================================================
-- Description: Wraps every `auth.uid()` / `auth.role()` / `is_super_admin()`
--              call inside a policy expression in `(SELECT ...)`, and adds
--              `TO authenticated` to policies that were scoped `TO public`.
--
-- Why: Postgres evaluates an unwrapped `auth.<fn>()` call once PER ROW the
-- policy touches. Wrapped in a subselect, the planner runs it once per query
-- (an initPlan) and reuses the cached result. Per Supabase's own benchmark
-- for this exact `EXISTS (... WHERE admin_users.id = auth.uid())` shape, on a
-- join-backed policy this is an 11,000ms -> 7ms difference at scale:
-- https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
--
-- `TO public` additionally means the `anon` role pays the cost of evaluating
-- the policy (here, a join against admin_users) on every read before being
-- ruled out — scoping to `TO authenticated` rules anon out before that runs.
--
-- ALTER POLICY changes only the clauses given; anything omitted (e.g. TO on
-- a policy that already read `authenticated`) is left as-is. All 30 policies
-- below match every row flagged by the `auth_rls_initplan` advisor as of
-- 2026-08-03; nothing here changes what a policy allows, only how cheaply it
-- evaluates.
-- =====================================================

-- ---------------------------------------------------------------------------
-- admin_users (already TO authenticated — wrap only)
-- ---------------------------------------------------------------------------
ALTER POLICY "Allow authenticated insert own admin_users" ON admin_users
  WITH CHECK (id = (SELECT auth.uid()));

ALTER POLICY "Admin users can read own profile" ON admin_users
  USING (id = (SELECT auth.uid()));

ALTER POLICY "admin_users_update_policy" ON admin_users
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- Tables using the EXISTS(admin_users) pattern, currently TO public
-- ---------------------------------------------------------------------------
ALTER POLICY "admin_all_billing_clients" ON billing_clients
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_billing_invoice_lines" ON billing_invoice_lines
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_billing_invoices" ON billing_invoices
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_billing_products" ON billing_products
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_billing_settings" ON billing_settings
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_blog_posts" ON blog_posts
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_categories" ON categories
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_glossary_terms" ON glossary_terms
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_project_categories" ON project_categories
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_projects" ON projects
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

-- ---------------------------------------------------------------------------
-- Same EXISTS(admin_users) pattern, already TO authenticated — wrap only
-- ---------------------------------------------------------------------------
ALTER POLICY "admin_delete_contact_submissions" ON contact_submissions
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_select_contact_submissions" ON contact_submissions
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_update_contact_submissions" ON contact_submissions
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_select_email_settings" ON email_settings
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_update_email_settings" ON email_settings
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_all_newsletter_subscribers" ON newsletter_subscribers
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "Admin users can read page_views" ON page_views
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "Admin users can read sessions" ON sessions
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_read_stripe_events" ON stripe_events
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

ALTER POLICY "admin_full_access_stripe_subs" ON stripe_subscriptions
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (SELECT auth.uid())));

-- ---------------------------------------------------------------------------
-- billing_invoices: service-role escape hatch. `service_role` bypasses RLS
-- entirely in Supabase, so this policy is effectively unreachable in
-- practice — wrapped for consistency, roles left untouched (out of scope).
-- ---------------------------------------------------------------------------
ALTER POLICY "service_role_billing_invoices" ON billing_invoices
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- ---------------------------------------------------------------------------
-- user_profiles: direct column compares and is_super_admin(), all already
-- TO authenticated — wrap only. For is_super_admin(auth.uid()), the argument
-- is what must be wrapped, not the outer call: is_super_admin((select
-- auth.uid())). Wrapping the outer call instead — (select
-- is_super_admin(auth.uid())) — does not satisfy the advisor, because the
-- lint checks that auth.uid() itself sits inside its own initPlan, and here
-- it is an argument to another function rather than the top-level
-- expression. (First applied as the outer-wrap form, corrected in the same
-- session after `get_advisors` kept flagging these 3 — see
-- fix_is_super_admin_initplan_wrap in the Supabase migration history.)
-- ---------------------------------------------------------------------------
ALTER POLICY "super_admin_insert_profiles" ON user_profiles
  WITH CHECK (is_super_admin((SELECT auth.uid())));

ALTER POLICY "users_insert_own_profile" ON user_profiles
  WITH CHECK (user_id = (SELECT auth.uid()));

ALTER POLICY "super_admin_select_all_profiles" ON user_profiles
  USING (is_super_admin((SELECT auth.uid())));

ALTER POLICY "users_select_own_profile" ON user_profiles
  USING (user_id = (SELECT auth.uid()));

ALTER POLICY "super_admin_update_all_profiles" ON user_profiles
  USING (is_super_admin((SELECT auth.uid())))
  WITH CHECK (is_super_admin((SELECT auth.uid())));

ALTER POLICY "users_update_own_profile" ON user_profiles
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Rollback: re-run the CREATE POLICY statements from each table's original
-- migration (or `git show` this file's previous state via the domain
-- migration it modified) — ALTER POLICY has no direct inverse, but every
-- expression reverted here is documented above.
