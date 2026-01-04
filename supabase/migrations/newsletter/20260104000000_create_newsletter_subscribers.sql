-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'unsubscribed')),
  locale text NOT NULL CHECK (locale IN ('en', 'es')),
  verification_token text UNIQUE,
  unsubscribe_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  ip_address text,
  user_agent text,
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(email, status)
);

-- Create indexes for performance
CREATE INDEX newsletter_subscribers_email_idx ON newsletter_subscribers(email);
CREATE INDEX newsletter_subscribers_status_idx ON newsletter_subscribers(status);
CREATE INDEX newsletter_subscribers_locale_idx ON newsletter_subscribers(locale);
CREATE INDEX newsletter_subscribers_verification_token_idx ON newsletter_subscribers(verification_token) WHERE verification_token IS NOT NULL;
CREATE INDEX newsletter_subscribers_unsubscribe_token_idx ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX newsletter_subscribers_created_at_idx ON newsletter_subscribers(created_at DESC);

-- Trigger function to auto-generate verification token on insert
CREATE OR REPLACE FUNCTION generate_verification_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_token IS NULL THEN
    NEW.verification_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate verification token
CREATE TRIGGER set_verification_token
  BEFORE INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION generate_verification_token();

-- Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_newsletter_subscribers_timestamp
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert (subscribe)
CREATE POLICY "public_insert_newsletter_subscribers"
ON newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RLS Policy: Allow public to select for token operations
CREATE POLICY "public_select_newsletter_subscribers"
ON newsletter_subscribers
FOR SELECT
TO anon, authenticated
USING (true);

-- RLS Policy: Allow public to update for verification/unsubscribe
CREATE POLICY "public_update_newsletter_subscribers"
ON newsletter_subscribers
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- RLS Policy: Allow admins full access
CREATE POLICY "admin_all_newsletter_subscribers"
ON newsletter_subscribers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Comments for documentation
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription data with double opt-in verification';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Subscription status: pending (awaiting verification), active (verified), inactive, unsubscribed';
COMMENT ON COLUMN newsletter_subscribers.verification_token IS 'One-time token for email verification, cleared after verification';
COMMENT ON COLUMN newsletter_subscribers.unsubscribe_token IS 'Permanent unique token for unsubscribe links';
COMMENT ON CONSTRAINT newsletter_subscribers_email_status_key ON newsletter_subscribers IS 'Allows re-subscription after unsubscribe by creating new row';
