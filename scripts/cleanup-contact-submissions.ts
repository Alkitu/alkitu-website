/**
 * Script to clean up test data from contact_submissions table
 *
 * This script deletes all contact submissions that are considered test data.
 * Test data criteria:
 * - Submissions with test/demo email addresses
 * - Submissions older than a certain date (if needed)
 * - Submissions with specific test patterns in name/subject
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanupTestData() {
  console.log('🧹 Starting cleanup of test data from contact_submissions table...\n');

  try {
    // First, let's see what we have
    const { data: allSubmissions, error: fetchError } = await supabase
      .from('contact_submissions')
      .select('id, name, email, subject, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching submissions:', fetchError);
      return;
    }

    console.log(`📊 Total submissions found: ${allSubmissions?.length || 0}\n`);

    if (!allSubmissions || allSubmissions.length === 0) {
      console.log('✅ No submissions to clean up.');
      return;
    }

    // Display all submissions
    console.log('Current submissions:');
    allSubmissions.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} (${sub.email}) - "${sub.subject}" - ${new Date(sub.created_at).toLocaleString()}`);
    });

    console.log('\n🗑️  Identifying test data...\n');

    // Identify test data based on patterns
    const testPatterns = [
      /test/i,
      /prueba/i,
      /demo/i,
      /ejemplo/i,
      /asdf/i,
      /qwerty/i,
      /@test\./i,
      /@example\./i,
      /@demo\./i,
    ];

    const testSubmissions = allSubmissions.filter(sub => {
      const text = `${sub.name} ${sub.email} ${sub.subject}`.toLowerCase();
      return testPatterns.some(pattern => pattern.test(text));
    });

    if (testSubmissions.length === 0) {
      console.log('✅ No test data found based on common patterns.');
      console.log('   If you want to delete specific submissions, please specify the criteria.\n');
      return;
    }

    console.log(`Found ${testSubmissions.length} test submissions:`);
    testSubmissions.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} (${sub.email}) - "${sub.subject}"`);
    });

    // Delete test submissions
    const idsToDelete = testSubmissions.map(sub => sub.id);

    console.log(`\n🗑️  Deleting ${idsToDelete.length} test submissions...`);

    const { error: deleteError } = await supabase
      .from('contact_submissions')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      console.error('❌ Error deleting submissions:', deleteError);
      return;
    }

    console.log(`✅ Successfully deleted ${idsToDelete.length} test submissions!\n`);

    // Show remaining submissions
    const { data: remainingSubmissions } = await supabase
      .from('contact_submissions')
      .select('id, name, email, subject, created_at')
      .order('created_at', { ascending: false });

    console.log(`📊 Remaining submissions: ${remainingSubmissions?.length || 0}`);
    if (remainingSubmissions && remainingSubmissions.length > 0) {
      console.log('\nRemaining submissions:');
      remainingSubmissions.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.name} (${sub.email}) - "${sub.subject}" - ${new Date(sub.created_at).toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the cleanup
cleanupTestData()
  .then(() => {
    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  });
