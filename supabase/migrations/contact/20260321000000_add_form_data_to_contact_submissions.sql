-- Migration: Add form_data JSONB column to contact_submissions
-- Description: Stores rich form fields (projectType, companySize, budget, etc.)
--              and makes subject nullable (now auto-generated from form fields)
-- Date: 2026-03-21

-- Make subject nullable (will be auto-generated from form data)
ALTER TABLE contact_submissions ALTER COLUMN subject DROP NOT NULL;

-- Add form_data JSONB column for storing all rich form fields
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS form_data jsonb DEFAULT '{}'::jsonb;

-- Add GIN index on form_data for efficient JSONB queries
CREATE INDEX IF NOT EXISTS contact_submissions_form_data_idx
  ON contact_submissions USING gin(form_data);

-- Add comments for documentation
COMMENT ON COLUMN contact_submissions.form_data IS 'Stores rich form fields: projectType, companySize, budget, productCategories, functionalities';

-- Rollback:
-- ALTER TABLE contact_submissions ALTER COLUMN subject SET NOT NULL;
-- DROP INDEX IF EXISTS contact_submissions_form_data_idx;
-- ALTER TABLE contact_submissions DROP COLUMN IF EXISTS form_data;
