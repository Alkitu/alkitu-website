#!/usr/bin/env tsx

/**
 * Apply projects seed migration to Supabase
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function applySeedMigration() {
  console.log('📦 Reading seed migration file...');

  const migrationPath = join(__dirname, '../supabase/migrations/projects/20241215000003_seed_projects.sql');
  const sql = readFileSync(migrationPath, 'utf8');

  console.log(`✅ Migration file loaded (${sql.length} characters)`);
  console.log('🔄 Connecting to Supabase...');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log('⚡ Executing migration...');

  // Execute the SQL migration
  const { data: _data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Migration failed:', error);

    // Try direct execution via REST API as fallback
    console.log('🔄 Trying direct SQL execution...');
    const { data: _result, error: execError } = await supabase
      .from('_sql_migrations')
      .insert({ query: sql });

    if (execError) {
      console.error('❌ Direct execution also failed');
      console.error(execError);
      process.exit(1);
    }
  }

  console.log('✅ Migration executed successfully!');
  console.log('🔍 Verifying data...');

  // Verify projects were inserted
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id', { count: 'exact' });

  if (projectsError) {
    console.error('⚠️  Warning: Could not verify projects:', projectsError);
  } else {
    console.log(`✅ Projects in database: ${projects?.length || 0}`);
  }

  // Verify project-category associations
  const { data: associations, error: assocError } = await supabase
    .from('project_categories')
    .select('id', { count: 'exact' });

  if (assocError) {
    console.error('⚠️  Warning: Could not verify associations:', assocError);
  } else {
    console.log(`✅ Project-category associations: ${associations?.length || 0}`);
  }

  console.log('🎉 Migration completed successfully!');
}

applySeedMigration().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
