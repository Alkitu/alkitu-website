-- Migration: Add form_url column to contact_submissions
-- Description: Stores the URL where the contact form was submitted from
-- Author: Alkitu Development Team
-- Date: 2025-01-04

-- Add form_url column
ALTER TABLE contact_submissions
ADD COLUMN form_url text;

-- Add index for potential filtering by URL
CREATE INDEX idx_contact_submissions_form_url ON contact_submissions(form_url);

-- Add comment for documentation
COMMENT ON COLUMN contact_submissions.form_url IS 'URL of the page where the contact form was submitted';
