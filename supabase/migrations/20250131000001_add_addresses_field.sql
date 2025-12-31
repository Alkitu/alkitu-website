/**
 * Migration: Add Addresses Field
 *
 * Adds addresses JSONB array to user_profiles table
 * Each address has: type (office/home), address text, and is_public toggle
 */

-- Add addresses column as JSONB array
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS addresses jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.addresses IS
  'Array of address objects with structure: { type: "office" | "home", address: string, is_public: boolean }';

-- Rollback:
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS addresses;
