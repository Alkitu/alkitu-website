-- Migration: Create contact_submissions table
-- Description: Table to store contact form submissions from the website
-- Author: Alkitu Development Team
-- Date: 2025-01-13

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  locale text NOT NULL DEFAULT 'es',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS contact_submissions_email_idx ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_locale_idx ON contact_submissions(locale);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Allow anonymous users to insert contact submissions
CREATE POLICY "public_insert_contact_submissions"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow authenticated admin users to select all submissions
CREATE POLICY "admin_select_contact_submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policy: Allow authenticated admin users to update submissions
CREATE POLICY "admin_update_contact_submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policy: Allow authenticated admin users to delete submissions
CREATE POLICY "admin_delete_contact_submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submissions_updated_at();

-- Add comments for documentation
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from website visitors';
COMMENT ON COLUMN contact_submissions.id IS 'Unique identifier for the submission';
COMMENT ON COLUMN contact_submissions.name IS 'Name of the person submitting the form';
COMMENT ON COLUMN contact_submissions.email IS 'Email address of the submitter';
COMMENT ON COLUMN contact_submissions.subject IS 'Subject of the contact message';
COMMENT ON COLUMN contact_submissions.message IS 'Main message content';
COMMENT ON COLUMN contact_submissions.locale IS 'Language locale (es or en)';
COMMENT ON COLUMN contact_submissions.status IS 'Current status: pending, read, replied, or archived';
COMMENT ON COLUMN contact_submissions.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN contact_submissions.ip_address IS 'IP address of the submitter';
COMMENT ON COLUMN contact_submissions.created_at IS 'Timestamp when submission was created';
COMMENT ON COLUMN contact_submissions.updated_at IS 'Timestamp when submission was last updated';
