/**
 * Migration: Remove Professional Fields
 *
 * Removes company_name, employment_type, start_date fields and their privacy toggles
 * These fields are being replaced with a contact-focused approach
 */

-- Remove professional fields and their privacy toggles
ALTER TABLE user_profiles DROP COLUMN IF EXISTS company_name;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS company_name_is_public;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS employment_type;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS start_date;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS start_date_is_public;

-- Rollback:
-- ALTER TABLE user_profiles ADD COLUMN company_name text;
-- ALTER TABLE user_profiles ADD COLUMN company_name_is_public boolean DEFAULT false;
-- ALTER TABLE user_profiles ADD COLUMN employment_type text CHECK (employment_type IN ('full_time', 'part_time', 'contractor', 'freelance'));
-- ALTER TABLE user_profiles ADD COLUMN start_date date;
-- ALTER TABLE user_profiles ADD COLUMN start_date_is_public boolean DEFAULT false;
