-- Add location columns to sessions table
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS latitude float,
ADD COLUMN IF NOT EXISTS longitude float;

-- Create an index for faster querying by country
CREATE INDEX IF NOT EXISTS sessions_country_idx ON sessions(country);
