/**
 * Migration: Update Profile Completion Trigger for Split Skills
 *
 * Updates the calculate_profile_completion function to:
 * 1. Remove reference to old skills field
 * 2. Add references to new hard_skills and soft_skills fields
 * 3. Update divisor to account for new field count
 */

-- Drop and recreate the calculate_profile_completion function
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_percentage INTEGER;
BEGIN
    SELECT
        ROUND(
            (
                COALESCE((photo_url IS NOT NULL)::int, 0) +
                COALESCE((bio IS NOT NULL AND LENGTH(bio) > 0)::int, 0) +
                COALESCE((first_name IS NOT NULL)::int, 0) +
                COALESCE((last_name IS NOT NULL)::int, 0) +
                COALESCE((pronouns IS NOT NULL)::int, 0) +
                COALESCE((display_name IS NOT NULL)::int, 0) +
                COALESCE((job_title IS NOT NULL)::int, 0) +
                COALESCE((location IS NOT NULL)::int, 0) +
                COALESCE((department IS NOT NULL)::int, 0) +
                COALESCE((jsonb_array_length(urls) > 0)::int, 0) +
                COALESCE((jsonb_array_length(phone_numbers) > 0)::int, 0) +
                COALESCE((jsonb_array_length(emails) > 0)::int, 0) +
                COALESCE((jsonb_array_length(roles) > 0)::int, 0) +
                COALESCE((jsonb_array_length(hard_skills) > 0)::int, 0) +
                COALESCE((jsonb_array_length(soft_skills) > 0)::int, 0) +
                COALESCE((jsonb_array_length(languages) > 0)::int, 0) +
                COALESCE((jsonb_array_length(addresses) > 0)::int, 0)
            )::NUMERIC / 17.0 * 100
        )::INTEGER INTO completion_percentage
    FROM user_profiles
    WHERE id = profile_id;

    RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;
