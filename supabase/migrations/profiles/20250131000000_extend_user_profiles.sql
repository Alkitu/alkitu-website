-- Migration: Extend user_profiles with additional fields
-- Priority: High
-- Description: Adds personal information, professional details, preferences, and metrics

-- =====================================================
-- 1. PERSONAL INFORMATION (Extended)
-- =====================================================

-- Name fields
ALTER TABLE user_profiles
ADD COLUMN first_name text,
ADD COLUMN first_name_is_public boolean DEFAULT false,
ADD COLUMN last_name text,
ADD COLUMN last_name_is_public boolean DEFAULT false,
ADD COLUMN display_name text; -- Public display name (overrides first_name + last_name)

-- Personal details
ALTER TABLE user_profiles
ADD COLUMN pronouns text, -- e.g., he/him, she/her, they/them
ADD COLUMN pronouns_is_public boolean DEFAULT false,
ADD COLUMN date_of_birth date,
ADD COLUMN date_of_birth_is_public boolean DEFAULT false;

-- Preferences
ALTER TABLE user_profiles
ADD COLUMN timezone text DEFAULT 'America/New_York', -- User's timezone
ADD COLUMN language_preference text DEFAULT 'es'; -- UI language preference

-- =====================================================
-- 2. PROFESSIONAL INFORMATION
-- =====================================================

-- Job details
ALTER TABLE user_profiles
ADD COLUMN job_title text,
ADD COLUMN job_title_is_public boolean DEFAULT false,
ADD COLUMN company_name text,
ADD COLUMN company_name_is_public boolean DEFAULT false,
ADD COLUMN employment_type text, -- 'full_time', 'part_time', 'contractor', 'freelance'
ADD COLUMN start_date date, -- Start date at current company
ADD COLUMN start_date_is_public boolean DEFAULT false;

-- Location
ALTER TABLE user_profiles
ADD COLUMN location text, -- e.g., "Madrid, Spain" or "Remote"
ADD COLUMN location_is_public boolean DEFAULT false,
ADD COLUMN remote_work boolean DEFAULT false;

-- Skills and languages
ALTER TABLE user_profiles
ADD COLUMN skills jsonb DEFAULT '[]'::jsonb, -- [{skill: string, level: 'beginner'|'intermediate'|'expert', is_public: boolean}]
ADD COLUMN languages jsonb DEFAULT '[]'::jsonb; -- [{language: string, proficiency: 'native'|'fluent'|'intermediate'|'basic', is_public: boolean}]

-- =====================================================
-- 3. CUSTOMIZATION & PREFERENCES
-- =====================================================

-- Visual customization
ALTER TABLE user_profiles
ADD COLUMN banner_url text, -- Profile banner/cover image
ADD COLUMN profile_color text DEFAULT '#00BB31', -- Theme color for profile
ADD COLUMN theme_preference text DEFAULT 'system'; -- 'light', 'dark', 'system'

-- Privacy & visibility
ALTER TABLE user_profiles
ADD COLUMN profile_visibility text DEFAULT 'public', -- 'public', 'private', 'team_only'
ADD COLUMN show_activity_status boolean DEFAULT true; -- Show online/offline status

-- =====================================================
-- 4. METRICS & STATISTICS
-- =====================================================

ALTER TABLE user_profiles
ADD COLUMN profile_completion_percentage integer DEFAULT 0,
ADD COLUMN profile_views_count integer DEFAULT 0,
ADD COLUMN last_profile_view_at timestamptz,
ADD COLUMN last_activity_at timestamptz DEFAULT now();

-- =====================================================
-- 5. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id uuid)
RETURNS integer AS $$
DECLARE
  total_fields integer := 16; -- Number of important optional fields
  filled_fields integer := 0;
BEGIN
  SELECT
    -- Basic info (6 fields)
    COALESCE((photo_url IS NOT NULL)::int, 0) +
    COALESCE((bio IS NOT NULL AND LENGTH(bio) > 0)::int, 0) +
    COALESCE((first_name IS NOT NULL)::int, 0) +
    COALESCE((last_name IS NOT NULL)::int, 0) +
    COALESCE((pronouns IS NOT NULL)::int, 0) +
    COALESCE((display_name IS NOT NULL)::int, 0) +

    -- Professional info (4 fields)
    COALESCE((job_title IS NOT NULL)::int, 0) +
    COALESCE((company_name IS NOT NULL)::int, 0) +
    COALESCE((location IS NOT NULL)::int, 0) +
    COALESCE((department IS NOT NULL)::int, 0) +

    -- Contact & social (4 fields)
    COALESCE((jsonb_array_length(urls) > 0)::int, 0) +
    COALESCE((jsonb_array_length(phone_numbers) > 0)::int, 0) +
    COALESCE((jsonb_array_length(emails) > 0)::int, 0) +

    -- Skills & expertise (2 fields)
    COALESCE((jsonb_array_length(roles) > 0)::int, 0) +
    COALESCE((jsonb_array_length(skills) > 0)::int, 0) +
    COALESCE((jsonb_array_length(languages) > 0)::int, 0)
  INTO filled_fields
  FROM user_profiles
  WHERE id = profile_id;

  RETURN ROUND((filled_fields::decimal / total_fields) * 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update completion percentage
CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_percentage := calculate_profile_completion(NEW.id);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_completion
BEFORE INSERT OR UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_completion();

-- =====================================================
-- 6. COMMENTS (Documentation)
-- =====================================================

COMMENT ON COLUMN user_profiles.first_name IS 'User first name (legal name)';
COMMENT ON COLUMN user_profiles.last_name IS 'User last name (legal name)';
COMMENT ON COLUMN user_profiles.display_name IS 'Public display name (overrides first_name + last_name if set)';
COMMENT ON COLUMN user_profiles.pronouns IS 'User pronouns (e.g., he/him, she/her, they/them)';
COMMENT ON COLUMN user_profiles.date_of_birth IS 'User date of birth';
COMMENT ON COLUMN user_profiles.timezone IS 'User timezone (IANA timezone string)';
COMMENT ON COLUMN user_profiles.language_preference IS 'Preferred UI language (ISO 639-1 code)';
COMMENT ON COLUMN user_profiles.job_title IS 'Current job title';
COMMENT ON COLUMN user_profiles.company_name IS 'Current company name';
COMMENT ON COLUMN user_profiles.employment_type IS 'Employment type: full_time, part_time, contractor, freelance';
COMMENT ON COLUMN user_profiles.location IS 'Work location (city, country or "Remote")';
COMMENT ON COLUMN user_profiles.remote_work IS 'Whether user works remotely';
COMMENT ON COLUMN user_profiles.skills IS 'JSONB array of skills: [{skill, level, is_public}]';
COMMENT ON COLUMN user_profiles.languages IS 'JSONB array of languages: [{language, proficiency, is_public}]';
COMMENT ON COLUMN user_profiles.banner_url IS 'Profile banner/cover image URL';
COMMENT ON COLUMN user_profiles.profile_color IS 'Theme color for user profile (hex)';
COMMENT ON COLUMN user_profiles.theme_preference IS 'UI theme preference: light, dark, system';
COMMENT ON COLUMN user_profiles.profile_visibility IS 'Profile visibility: public, private, team_only';
COMMENT ON COLUMN user_profiles.profile_completion_percentage IS 'Auto-calculated profile completion (0-100)';

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- Search by name
CREATE INDEX idx_user_profiles_first_name ON user_profiles(first_name) WHERE first_name IS NOT NULL;
CREATE INDEX idx_user_profiles_last_name ON user_profiles(last_name) WHERE last_name IS NOT NULL;
CREATE INDEX idx_user_profiles_display_name ON user_profiles(display_name) WHERE display_name IS NOT NULL;

-- Search by job/company
CREATE INDEX idx_user_profiles_job_title ON user_profiles(job_title) WHERE job_title IS NOT NULL;
CREATE INDEX idx_user_profiles_company_name ON user_profiles(company_name) WHERE company_name IS NOT NULL;
CREATE INDEX idx_user_profiles_location ON user_profiles(location) WHERE location IS NOT NULL;

-- Filter by visibility
CREATE INDEX idx_user_profiles_visibility ON user_profiles(profile_visibility);

-- Sort by completion
CREATE INDEX idx_user_profiles_completion ON user_profiles(profile_completion_percentage DESC);

-- Track activity
CREATE INDEX idx_user_profiles_last_activity ON user_profiles(last_activity_at DESC);
