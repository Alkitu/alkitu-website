/**
 * Migration: Split Skills into Hard Skills and Soft Skills
 *
 * Migrates existing skills column to separate hard_skills and soft_skills columns
 * with no limit on the number of skills in each category
 *
 * Changes:
 * - Adds hard_skills JSONB column
 * - Adds soft_skills JSONB column
 * - Migrates existing skills data (all skills default to hard_skills for now)
 * - Removes old skills column
 */

-- Add hard_skills and soft_skills columns
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS hard_skills jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS soft_skills jsonb DEFAULT '[]'::jsonb;

-- Migrate existing skills to hard_skills (default assumption)
UPDATE user_profiles
SET hard_skills = COALESCE(skills, '[]'::jsonb)
WHERE skills IS NOT NULL AND skills != '[]'::jsonb;

-- Drop the old skills column
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS skills;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.hard_skills IS
  'Array of hard skill objects with structure: { skill: string, level: "beginner" | "intermediate" | "expert", is_public: boolean }';

COMMENT ON COLUMN user_profiles.soft_skills IS
  'Array of soft skill objects with structure: { skill: string, level: "beginner" | "intermediate" | "expert", is_public: boolean }';
