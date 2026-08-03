#!/usr/bin/env node

/**
 * Execute the projects seed migration directly via Supabase client
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read environment variables
require('dotenv').config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runMigration() {
  console.log('📦 Reading seed migration file...');

  const migrationPath = join(__dirname, '../supabase/migrations/projects/20241215000003_seed_projects.sql');
  const sql = readFileSync(migrationPath, 'utf8');

  console.log(`✅ Migration file loaded (${sql.length} characters)`);
  console.log('🔄 Connecting to Supabase...');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('⚡ Executing migration via Supabase...');
  console.log('Note: This may take a moment for large migrations...\n');

  try {
    // Execute SQL via rpc if available, otherwise use execute_sql
    const { data: _data, error } = await supabase.rpc('exec', { sql });

    if (error) {
      console.error('❌ Migration execution failed:', error.message);
      console.error('Details:', error);
      process.exit(1);
    }

    console.log('✅ Migration executed successfully!');
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }

  console.log('\n🔍 Verifying data...');

  // Verify projects were inserted
  const { data: projects, count: projectsCount, error: projectsError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: false });

  if (projectsError) {
    console.error('⚠️  Warning: Could not verify projects:', projectsError.message);
  } else {
    console.log(`✅ Projects in database: ${projectsCount || projects?.length || 0}`);
  }

  // Verify project-category associations
  const { data: associations, count: assocCount, error: assocError } = await supabase
    .from('project_categories')
    .select('*', { count: 'exact', head: false });

  if (assocError) {
    console.error('⚠️  Warning: Could not verify associations:', assocError.message);
  } else {
    console.log(`✅ Project-category associations: ${assocCount || associations?.length || 0}`);
  }

  console.log('\n🎉 Seed migration completed successfully!');
}

runMigration().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
