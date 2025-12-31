-- =====================================================
-- Add Super Admin Role System
-- =====================================================
-- Description: Adds role hierarchy to admin_users table
-- Created: 2025-01-30
-- Breaking Change: All existing admins become 'admin' role
-- Manual step required: Promote first super admin after migration
-- =====================================================

-- Step 1: Add role column with default
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin'
CHECK (role IN ('admin', 'super_admin'));

-- Step 2: Add index for role lookups
CREATE INDEX IF NOT EXISTS admin_users_role_idx ON admin_users(role);

-- Step 3: Create helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = user_id AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Add comment
COMMENT ON COLUMN admin_users.role IS 'User role: admin (can manage own profile) or super_admin (can manage all profiles)';

COMMENT ON FUNCTION is_super_admin(uuid) IS 'Helper function to check if a user has super_admin role';

-- =====================================================
-- Manual Step Required After Migration
-- =====================================================
-- Run this separately in SQL Editor to designate first super admin:
-- UPDATE admin_users SET role = 'super_admin' WHERE email = 'YOUR_EMAIL@example.com';

-- =====================================================
-- Rollback (if needed)
-- =====================================================
-- ALTER TABLE admin_users DROP COLUMN IF EXISTS role;
-- DROP FUNCTION IF EXISTS is_super_admin(uuid);
-- DROP INDEX IF EXISTS admin_users_role_idx;
