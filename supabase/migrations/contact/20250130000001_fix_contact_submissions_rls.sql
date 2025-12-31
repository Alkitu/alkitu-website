-- =====================================================
-- Fix Contact Submissions RLS Policies
-- =====================================================
-- Description: Add missing INSERT policy for anonymous users
-- Created: 2025-01-30
-- Issue: Users cannot submit contact form due to RLS blocking INSERTs
-- =====================================================

-- Enable RLS if not already enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "anon_select_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "admin_select_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "admin_update_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "admin_delete_contact_submissions" ON contact_submissions;

-- =====================================================
-- Policy 1: Anonymous users can INSERT contact submissions
-- =====================================================
CREATE POLICY "anon_insert_contact_submissions"
ON contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =====================================================
-- Policy 2: Admins can SELECT all contact submissions
-- =====================================================
CREATE POLICY "admin_select_contact_submissions"
ON contact_submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- Policy 3: Admins can UPDATE contact submissions (status changes)
-- =====================================================
CREATE POLICY "admin_update_contact_submissions"
ON contact_submissions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- Policy 4: Admins can DELETE contact submissions
-- =====================================================
CREATE POLICY "admin_delete_contact_submissions"
ON contact_submissions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON POLICY "anon_insert_contact_submissions" ON contact_submissions IS
  'Allow anonymous and authenticated users to submit contact forms';

COMMENT ON POLICY "admin_select_contact_submissions" ON contact_submissions IS
  'Allow admin users to view all contact submissions';

COMMENT ON POLICY "admin_update_contact_submissions" ON contact_submissions IS
  'Allow admin users to update contact submissions (e.g., change status)';

COMMENT ON POLICY "admin_delete_contact_submissions" ON contact_submissions IS
  'Allow admin users to delete contact submissions';
