-- Migration: Create email_settings table
-- Description: Table to store email configuration for contact form notifications
-- Author: Alkitu Development Team
-- Date: 2025-01-31

-- Create email_settings table
CREATE TABLE IF NOT EXISTS email_settings (
  id uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  from_email text NOT NULL,
  to_emails text[] NOT NULL DEFAULT ARRAY[]::text[],
  cc_emails text[] DEFAULT ARRAY[]::text[],
  bcc_emails text[] DEFAULT ARRAY[]::text[],
  email_domain text NOT NULL DEFAULT 'alkitu.com',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert initial configuration
-- This seed ensures the hardcoded ID exists for the EmailSettingsForm
INSERT INTO email_settings (
  id,
  from_email,
  to_emails,
  email_domain
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'info@alkitu.com',
  ARRAY['info@alkitu.com']::text[],
  'alkitu.com'
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only authenticated admin users can view email settings
CREATE POLICY "admin_select_email_settings"
  ON email_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policy: Only authenticated admin users can update email settings
CREATE POLICY "admin_update_email_settings"
  ON email_settings
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

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
CREATE TRIGGER email_settings_updated_at
  BEFORE UPDATE ON email_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_email_settings_updated_at();

-- Add comments for documentation
COMMENT ON TABLE email_settings IS 'Stores email configuration for contact form notifications sent via RESEND';
COMMENT ON COLUMN email_settings.id IS 'Fixed UUID for singleton pattern (only one row exists)';
COMMENT ON COLUMN email_settings.from_email IS 'Email address used as sender (must match verified domain in RESEND)';
COMMENT ON COLUMN email_settings.to_emails IS 'Array of email addresses that receive contact form notifications';
COMMENT ON COLUMN email_settings.cc_emails IS 'Array of email addresses in CC (visible to all recipients)';
COMMENT ON COLUMN email_settings.bcc_emails IS 'Array of email addresses in BCC (hidden from other recipients)';
COMMENT ON COLUMN email_settings.email_domain IS 'Allowed domain for sender email (e.g., alkitu.com)';
COMMENT ON COLUMN email_settings.created_at IS 'Timestamp when configuration was created';
COMMENT ON COLUMN email_settings.updated_at IS 'Timestamp when configuration was last updated';
