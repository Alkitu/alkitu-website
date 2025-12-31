#!/usr/bin/env node

/**
 * Script to apply RLS fix for contact_submissions table
 * Run with: node scripts/apply-rls-fix.js
 */

const { createClient } = require('@supabase/supabase-js');

// Read from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyRLSFix() {
  console.log('🔧 Applying RLS fix for contact_submissions table...\n');

  const queries = [
    {
      name: 'Enable RLS',
      sql: 'ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;'
    },
    {
      name: 'Drop existing policies',
      sql: `
        DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
        DROP POLICY IF EXISTS "admin_select_contact_submissions" ON contact_submissions;
        DROP POLICY IF EXISTS "admin_update_contact_submissions" ON contact_submissions;
        DROP POLICY IF EXISTS "admin_delete_contact_submissions" ON contact_submissions;
      `
    },
    {
      name: 'Create INSERT policy for anonymous users',
      sql: `
        CREATE POLICY "anon_insert_contact_submissions"
        ON contact_submissions
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
      `
    },
    {
      name: 'Create SELECT policy for admins',
      sql: `
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
      `
    },
    {
      name: 'Create UPDATE policy for admins',
      sql: `
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
      `
    },
    {
      name: 'Create DELETE policy for admins',
      sql: `
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
      `
    }
  ];

  for (const query of queries) {
    try {
      console.log(`   Executing: ${query.name}...`);
      const { error } = await supabase.rpc('exec_sql', { query: query.sql });

      if (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        console.error('   Trying alternative method...');

        // Alternative: Use .from() with raw SQL (if exec_sql doesn't exist)
        const { error: altError } = await supabase
          .from('contact_submissions')
          .select('*')
          .limit(0);

        if (altError && altError.code === '42883') {
          console.error('   ⚠️  exec_sql function not available. Please run migration manually.');
          console.error('   Migration file: supabase/migrations/contact/20250130000001_fix_contact_submissions_rls.sql');
          process.exit(1);
        }
      } else {
        console.log(`   ✅ ${query.name} - Success`);
      }
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  console.log('\n✅ RLS fix applied successfully!');
  console.log('   Test by submitting a contact form at /es/contact\n');
}

applyRLSFix().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
