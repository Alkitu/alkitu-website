-- =====================================================
-- Fix admin_users RLS for last_login_at updates  
-- =====================================================
-- Description: Adds RLS policies for admin_users UPDATE operations
-- Created: 2024-12-14
-- Issue: UPDATE operations returning 200 but not persisting
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON admin_users;

-- SELECT policy: Allow authenticated admins to read all admin_users
CREATE POLICY "admin_users_select_policy" ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- UPDATE policy: Allow authenticated admins to update their own record
CREATE POLICY "admin_users_update_policy" ON admin_users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
