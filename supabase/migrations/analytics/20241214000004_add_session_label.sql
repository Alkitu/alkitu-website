-- =====================================================
-- Add label column to sessions table
-- =====================================================
-- Description: Allows admins to assign a friendly name to an IP/session
-- so returning visitors can be identified by name instead of IP.
-- Created: 2026-03-22
-- =====================================================

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS label text;

-- Index for searching by label
CREATE INDEX IF NOT EXISTS sessions_label_idx ON sessions(label) WHERE label IS NOT NULL;

COMMENT ON COLUMN sessions.label IS 'Admin-assigned friendly name for the visitor (e.g. "Juan - Cliente")';
