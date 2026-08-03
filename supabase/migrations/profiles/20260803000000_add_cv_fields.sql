/**
 * Migration: Add CV Fields (bilingual content, experience, education)
 *
 * Brings the public profile schema up to CV-template parity:
 * - `bio` and `job_title` become bilingual jsonb ({en, es}) instead of plain text
 * - `hard_skills`/`soft_skills` items gain a `skill: {en, es}` shape and a `category` slug
 *   (grouping used by the profile sidebar: ai_consulting | engineering | testing_cicd |
 *   design_marketing | other). No column change needed — JSONB shape only.
 * - `languages` items gain an optional `language_code` (ISO 639-1) so the display name can
 *   be localized client-side via Intl.DisplayNames instead of relying on a single stored string.
 * - New `experience` and `education` jsonb arrays.
 *
 * Existing bio/job_title text values (if any) are preserved as {en: value, es: value} —
 * both locales get the original text so nothing is silently dropped.
 */

-- =====================================================
-- 1. Bilingual bio / job_title
-- =====================================================

ALTER TABLE user_profiles
  ALTER COLUMN bio DROP DEFAULT,
  ALTER COLUMN bio TYPE jsonb USING
    CASE
      WHEN bio IS NULL OR bio = '' THEN '{"en":"","es":""}'::jsonb
      ELSE jsonb_build_object('en', bio, 'es', bio)
    END,
  ALTER COLUMN bio SET DEFAULT '{"en":"","es":""}'::jsonb;

ALTER TABLE user_profiles
  ALTER COLUMN job_title DROP DEFAULT,
  ALTER COLUMN job_title TYPE jsonb USING
    CASE
      WHEN job_title IS NULL OR job_title = '' THEN '{"en":"","es":""}'::jsonb
      ELSE jsonb_build_object('en', job_title, 'es', job_title)
    END,
  ALTER COLUMN job_title SET DEFAULT '{"en":"","es":""}'::jsonb;

-- The old `check_bio_length` constraint (character length on text) no longer applies to jsonb.
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS check_bio_length;

COMMENT ON COLUMN user_profiles.bio IS 'Bilingual biography: {en: string, es: string}';
COMMENT ON COLUMN user_profiles.job_title IS 'Bilingual job title / role tagline: {en: string, es: string}';

-- =====================================================
-- 2. Experience & Education
-- =====================================================

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb;

ALTER TABLE user_profiles
  ADD CONSTRAINT check_experience_is_array CHECK (jsonb_typeof(experience) = 'array'),
  ADD CONSTRAINT check_education_is_array CHECK (jsonb_typeof(education) = 'array');

COMMENT ON COLUMN user_profiles.experience IS
  'Array of work experience objects: { company, role: {en,es}, location, start_date, end_date, is_current, bullets: {en: string[], es: string[]}, tech: string[] | null, display_order, is_public }';

COMMENT ON COLUMN user_profiles.education IS
  'Array of education objects: { school, degree: {en,es}, location, start_date, end_date, display_order, is_public }';

-- =====================================================
-- 3. Skill & language shape notes (no column change, JSONB shape only)
-- =====================================================

COMMENT ON COLUMN user_profiles.hard_skills IS
  'Array of hard skill objects: { skill: {en,es}, level, category: "ai_consulting"|"engineering"|"testing_cicd"|"design_marketing"|"other", display_order, is_public }';

COMMENT ON COLUMN user_profiles.soft_skills IS
  'Array of soft skill objects: { skill: {en,es}, level, category, display_order, is_public }';

COMMENT ON COLUMN user_profiles.languages IS
  'Array of language objects: { language, language_code?: ISO 639-1, proficiency, display_order, is_public }. language_code drives localized display name (Intl.DisplayNames); language is the free-text fallback.';

-- =====================================================
-- 4. Profile completion trigger — account for bilingual bio/job_title + new arrays
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_percentage INTEGER;
BEGIN
    SELECT
        ROUND(
            (
                COALESCE((photo_url IS NOT NULL)::int, 0) +
                COALESCE((bio->>'en' IS NOT NULL AND length(bio->>'en') > 0)::int, 0) +
                COALESCE((first_name IS NOT NULL)::int, 0) +
                COALESCE((last_name IS NOT NULL)::int, 0) +
                COALESCE((pronouns IS NOT NULL)::int, 0) +
                COALESCE((display_name IS NOT NULL)::int, 0) +
                COALESCE((job_title->>'en' IS NOT NULL AND length(job_title->>'en') > 0)::int, 0) +
                COALESCE((location IS NOT NULL)::int, 0) +
                COALESCE((department IS NOT NULL)::int, 0) +
                COALESCE((jsonb_array_length(urls) > 0)::int, 0) +
                COALESCE((jsonb_array_length(phone_numbers) > 0)::int, 0) +
                COALESCE((jsonb_array_length(emails) > 0)::int, 0) +
                COALESCE((jsonb_array_length(roles) > 0)::int, 0) +
                COALESCE((jsonb_array_length(hard_skills) > 0)::int, 0) +
                COALESCE((jsonb_array_length(soft_skills) > 0)::int, 0) +
                COALESCE((jsonb_array_length(languages) > 0)::int, 0) +
                COALESCE((jsonb_array_length(addresses) > 0)::int, 0) +
                COALESCE((jsonb_array_length(experience) > 0)::int, 0) +
                COALESCE((jsonb_array_length(education) > 0)::int, 0)
            )::NUMERIC / 19.0 * 100
        )::INTEGER INTO completion_percentage
    FROM user_profiles
    WHERE id = profile_id;

    RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;

-- Rollback (if needed):
-- ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS check_experience_is_array;
-- ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS check_education_is_array;
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS experience;
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS education;
-- ALTER TABLE user_profiles ALTER COLUMN bio TYPE text USING bio->>'en';
-- ALTER TABLE user_profiles ALTER COLUMN job_title TYPE text USING job_title->>'en';
