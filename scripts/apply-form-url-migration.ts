/**
 * Script to apply the form_url migration to contact_submissions table
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function applyMigration() {
  console.log('🔄 Applying form_url migration to contact_submissions table...\n');

  try {
    // Execute the migration SQL using Supabase RPC or direct SQL execution
    // Note: We'll use the rpc function if available, or we'll need to execute via SQL editor

    const migrationSQL = `
-- Add form_url column
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS form_url text;

-- Add index for potential filtering by URL
CREATE INDEX IF NOT EXISTS idx_contact_submissions_form_url ON contact_submissions(form_url);

-- Add comment for documentation
COMMENT ON COLUMN contact_submissions.form_url IS 'URL of the page where the contact form was submitted';
    `;

    console.log('📝 Migration SQL:');
    console.log(migrationSQL);
    console.log('\n⚠️  Note: This script shows the SQL that needs to be run.');
    console.log('⚠️  Please execute this SQL in the Supabase SQL Editor:');
    console.log('⚠️  https://app.supabase.com/project/YOUR_PROJECT/sql\n');

    console.log('✅ Migration script ready!');
    console.log('📋 Copy the SQL above and execute it in the Supabase SQL Editor.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

applyMigration()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
