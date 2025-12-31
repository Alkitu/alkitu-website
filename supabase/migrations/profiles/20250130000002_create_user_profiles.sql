-- =====================================================
-- User Profiles Schema
-- =====================================================
-- Description: Professional/company profile data for admin users
-- Created: 2025-01-30
-- Relationship: 1:1 with admin_users
-- Features: Granular privacy controls, JSONB arrays, Vercel Blob photo storage
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: user_profiles
-- Description: Extended profile data for admin users
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 1:1 relationship with admin_users
  user_id uuid NOT NULL UNIQUE REFERENCES admin_users(id) ON DELETE CASCADE,

  -- Username for public URLs (generated from full_name or email)
  username text NOT NULL UNIQUE,

  -- Photo storage (Vercel Blob URL)
  photo_url text,

  -- Bio with privacy toggle
  bio text,
  bio_is_public boolean DEFAULT false,

  -- Department (single value, autocomplete input)
  department text,
  department_is_public boolean DEFAULT false,

  -- JSONB Arrays with per-item privacy
  urls jsonb DEFAULT '[]'::jsonb,           -- [{urlName, url, is_public}]
  roles jsonb DEFAULT '[]'::jsonb,          -- [{role, is_public}]
  phone_numbers jsonb DEFAULT '[]'::jsonb,  -- [{type, number, is_public}]
  emails jsonb DEFAULT '[]'::jsonb,         -- [{type, email, is_public}]

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT check_urls_is_array CHECK (jsonb_typeof(urls) = 'array'),
  CONSTRAINT check_roles_is_array CHECK (jsonb_typeof(roles) = 'array'),
  CONSTRAINT check_phone_numbers_is_array CHECK (jsonb_typeof(phone_numbers) = 'array'),
  CONSTRAINT check_emails_is_array CHECK (jsonb_typeof(emails) = 'array'),
  CONSTRAINT check_username_format CHECK (username ~ '^[a-z0-9_-]+$'),
  CONSTRAINT check_bio_length CHECK (length(bio) <= 500)
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON user_profiles(username);
CREATE INDEX IF NOT EXISTS user_profiles_department_idx ON user_profiles(department);

-- GIN indexes for JSONB searching
CREATE INDEX IF NOT EXISTS user_profiles_urls_gin_idx ON user_profiles USING gin(urls);
CREATE INDEX IF NOT EXISTS user_profiles_roles_gin_idx ON user_profiles USING gin(roles);
CREATE INDEX IF NOT EXISTS user_profiles_phone_numbers_gin_idx ON user_profiles USING gin(phone_numbers);
CREATE INDEX IF NOT EXISTS user_profiles_emails_gin_idx ON user_profiles USING gin(emails);

-- =====================================================
-- Trigger: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Profile owners can SELECT their own profile
CREATE POLICY "users_select_own_profile" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Super admins can SELECT all profiles
CREATE POLICY "super_admin_select_all_profiles" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_super_admin(auth.uid()));

-- Policy 3: Public can SELECT profiles (API layer filters private fields)
CREATE POLICY "public_select_profiles" ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 4: Profile owners can UPDATE their own profile
CREATE POLICY "users_update_own_profile" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy 5: Super admins can UPDATE any profile
CREATE POLICY "super_admin_update_all_profiles" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- Policy 6: Profile owners can INSERT their own profile (one-time)
CREATE POLICY "users_insert_own_profile" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy 7: Super admins can INSERT profiles for any user
CREATE POLICY "super_admin_insert_profiles" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin(auth.uid()));

-- =====================================================
-- Helper Function: Generate username from admin_users
-- =====================================================
CREATE OR REPLACE FUNCTION generate_username(user_email text, user_full_name text)
RETURNS text AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
BEGIN
  -- Prefer full_name, fallback to email local part
  IF user_full_name IS NOT NULL AND user_full_name != '' THEN
    base_username := lower(regexp_replace(user_full_name, '[^a-zA-Z0-9]+', '_', 'g'));
  ELSE
    base_username := lower(split_part(user_email, '@', 1));
  END IF;

  -- Remove leading/trailing underscores and hyphens
  base_username := trim(both '_-' from base_username);

  -- Ensure username is at least 3 characters
  IF length(base_username) < 3 THEN
    base_username := base_username || '_user';
  END IF;

  final_username := base_username;

  -- Handle duplicates by appending counter
  WHILE EXISTS (SELECT 1 FROM user_profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || '_' || counter;
  END LOOP;

  RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Data Migration: Create empty profiles for existing admins
-- =====================================================
INSERT INTO user_profiles (user_id, username)
SELECT
  id,
  generate_username(email, full_name)
FROM admin_users
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_profiles.user_id = admin_users.id
);

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON TABLE user_profiles IS 'Extended professional/company profile data for admin users';
COMMENT ON COLUMN user_profiles.username IS 'Unique username for public profile URLs (auto-generated from full_name or email)';
COMMENT ON COLUMN user_profiles.photo_url IS 'Vercel Blob Storage URL for profile photo';
COMMENT ON COLUMN user_profiles.bio IS 'User biography (max 500 characters)';
COMMENT ON COLUMN user_profiles.urls IS 'Array of {urlName, url, is_public} objects';
COMMENT ON COLUMN user_profiles.roles IS 'Array of {role, is_public} objects (multiple roles per user)';
COMMENT ON COLUMN user_profiles.phone_numbers IS 'Array of {type: "work"|"personal", number, is_public} objects';
COMMENT ON COLUMN user_profiles.emails IS 'Array of {type: "work"|"personal", email, is_public} objects';

-- =====================================================
-- Rollback (if needed)
-- =====================================================
-- DROP TABLE IF EXISTS user_profiles CASCADE;
-- DROP FUNCTION IF EXISTS generate_username(text, text);
-- DROP FUNCTION IF EXISTS update_updated_at_column();
