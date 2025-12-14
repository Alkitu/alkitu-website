-- =====================================================
-- Analytics Tables Schema
-- =====================================================
-- Description: Creates tables for tracking user sessions and page views
-- Created: 2024-12-14
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: sessions
-- Description: Tracks user sessions with fingerprinting
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_fingerprint text NOT NULL UNIQUE,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for sessions table
CREATE INDEX IF NOT EXISTS sessions_fingerprint_idx ON sessions(session_fingerprint);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS sessions_ip_address_idx ON sessions(ip_address);

-- =====================================================
-- Table: page_views
-- Description: Tracks individual page visits within sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  locale text,
  referrer text,
  entry_time timestamptz NOT NULL DEFAULT now(),
  exit_time timestamptz,
  time_on_page_seconds integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for page_views table
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views(session_id);
CREATE INDEX IF NOT EXISTS page_views_page_path_idx ON page_views(page_path);
CREATE INDEX IF NOT EXISTS page_views_entry_time_idx ON page_views(entry_time DESC);
CREATE INDEX IF NOT EXISTS page_views_locale_idx ON page_views(locale);

-- =====================================================
-- Trigger Function: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to sessions table
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to page_views table
CREATE TRIGGER update_page_views_updated_at
  BEFORE UPDATE ON page_views
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Sessions policies for anon role
CREATE POLICY "anon_insert_sessions" ON sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_sessions" ON sessions
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "anon_update_sessions" ON sessions
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Page views policies for anon role
CREATE POLICY "anon_insert_page_views" ON page_views
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_page_views" ON page_views
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "anon_update_page_views" ON page_views
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON TABLE sessions IS 'Stores user session data with fingerprinting for analytics';
COMMENT ON TABLE page_views IS 'Tracks individual page views within user sessions';
COMMENT ON COLUMN sessions.session_fingerprint IS 'Unique fingerprint generated from IP + User Agent + timestamp';
COMMENT ON COLUMN page_views.time_on_page_seconds IS 'Duration spent on page in seconds';
