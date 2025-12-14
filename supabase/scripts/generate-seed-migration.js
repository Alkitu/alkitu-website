#!/usr/bin/env node

/**
 * Generate Projects Seed Migration
 *
 * This script reads from app/data/projects/seed.json and generates
 * a SQL migration file to seed the projects table with all data.
 *
 * Usage: node supabase/scripts/generate-seed-migration.js
 */

const fs = require('fs');
const path = require('path');

// =====================================================
// Configuration
// =====================================================
const SEED_JSON_PATH = path.join(__dirname, '../../app/data/projects/seed.json');
const OUTPUT_PATH = path.join(__dirname, '../migrations/projects/20241215000003_seed_projects.sql');

// Category slug mapping
const CATEGORY_SLUG_MAP = {
  'Web_Development': 'web_development',
  'Web_Apps': 'web_apps',
  'Web_Design': 'web_design',
  'Video_Games': 'video_games',
  'Logos': 'logos',
  'Branding': 'branding',
  'SEO': 'seo',
  'SEM': 'sem',
  'Audiovisuals': 'audiovisuals',
  'Offline_Designs': 'offline_designs',
  'UX/UI': 'ux_ui'
};

// =====================================================
// Helper Functions
// =====================================================

/**
 * Escape single quotes in SQL strings
 */
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

/**
 * Format a value for SQL
 */
function formatSqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${escapeSql(value)}'`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return value;
  }
  if (Array.isArray(value) || typeof value === 'object') {
    return `'${escapeSql(JSON.stringify(value))}'::jsonb`;
  }
  return `'${escapeSql(String(value))}'`;
}

/**
 * Generate INSERT statement for a project
 */
function generateProjectInsert(project, locale) {
  const isEnglish = locale === 'en';

  // Extract data
  const legacyId = project.id;
  const slug = project.url;
  const title = project.title;
  const description = project.description;
  const about = project.about || null;
  const image = project.image;
  const gallery = project.gallery || [];
  const tags = project.tags || [];
  const urls = project.urls || [];
  const categories = project.categories || [];

  return {
    legacyId,
    slug,
    title,
    description,
    about,
    image,
    gallery,
    tags,
    urls,
    categories,
    locale
  };
}

/**
 * Generate SQL migration file
 */
function generateMigration() {
  console.log('🔍 Reading seed.json...');

  // Read seed.json
  const seedData = JSON.parse(fs.readFileSync(SEED_JSON_PATH, 'utf8'));

  const enProjects = seedData.en.projects;
  const esProjects = seedData.es.projects;

  console.log(`✅ Found ${enProjects.length} English projects and ${esProjects.length} Spanish projects`);

  // Build a map of projects by ID
  const projectsMap = new Map();

  // Process English projects
  enProjects.forEach(project => {
    if (!projectsMap.has(project.id)) {
      projectsMap.set(project.id, {
        en: generateProjectInsert(project, 'en'),
        es: null
      });
    }
  });

  // Process Spanish projects
  esProjects.forEach(project => {
    if (projectsMap.has(project.id)) {
      projectsMap.get(project.id).es = generateProjectInsert(project, 'es');
    } else {
      projectsMap.set(project.id, {
        en: null,
        es: generateProjectInsert(project, 'es')
      });
    }
  });

  console.log('📝 Generating SQL migration...');

  // Start building SQL
  let sql = `-- =====================================================
-- Seed Projects Data
-- =====================================================
-- Description: Auto-generated migration to seed projects from seed.json
-- Created: ${new Date().toISOString().split('T')[0]}
-- Total Projects: ${projectsMap.size}
-- =====================================================

-- Temporary table to store category mappings
CREATE TEMP TABLE temp_category_map (
  slug text PRIMARY KEY,
  id uuid
);

-- Populate category map
INSERT INTO temp_category_map (slug, id)
SELECT slug, id FROM categories;

`;

  // Generate INSERT statements for projects
  const projectInserts = [];
  const categoryAssociations = [];

  projectsMap.forEach((data, projectId) => {
    const en = data.en;
    const es = data.es;

    if (!en || !es) {
      console.warn(`⚠️  Warning: Project ${projectId} missing ${!en ? 'English' : 'Spanish'} translation`);
      return;
    }

    // Generate project INSERT
    const insert = `  (
    ${projectId}, -- legacy_id
    ${formatSqlValue(en.slug)}, -- slug
    ${formatSqlValue(en.title)}, -- title_en
    ${formatSqlValue(es.title)}, -- title_es
    ${formatSqlValue(en.description)}, -- description_en
    ${formatSqlValue(es.description)}, -- description_es
    ${formatSqlValue(en.about)}, -- about_en
    ${formatSqlValue(es.about)}, -- about_es
    ${formatSqlValue(en.image)}, -- image
    ${formatSqlValue(en.gallery)}, -- gallery
    ${formatSqlValue(en.tags)}, -- tags
    ${formatSqlValue(en.urls)}, -- urls
    true, -- is_active
    ${projectId} -- display_order (using legacy_id as order)
  )`;

    projectInserts.push(insert);

    // Generate category associations
    en.categories.forEach(categoryName => {
      const categorySlug = CATEGORY_SLUG_MAP[categoryName];
      if (categorySlug) {
        categoryAssociations.push({
          projectSlug: en.slug,
          categorySlug
        });
      } else {
        console.warn(`⚠️  Warning: Unknown category "${categoryName}" in project ${projectId}`);
      }
    });
  });

  // Add projects INSERT
  sql += `-- Insert projects
INSERT INTO projects (
  legacy_id,
  slug,
  title_en,
  title_es,
  description_en,
  description_es,
  about_en,
  about_es,
  image,
  gallery,
  tags,
  urls,
  is_active,
  display_order
) VALUES
${projectInserts.join(',\n')}
ON CONFLICT (slug) DO NOTHING;

`;

  // Add project-category associations
  sql += `-- Create project-category associations
INSERT INTO project_categories (project_id, category_id)
SELECT
  p.id as project_id,
  c.id as category_id
FROM (VALUES
`;

  const associations = categoryAssociations.map(assoc =>
    `  (${formatSqlValue(assoc.projectSlug)}, ${formatSqlValue(assoc.categorySlug)})`
  );

  sql += associations.join(',\n');
  sql += `
) AS data(project_slug, category_slug)
JOIN projects p ON p.slug = data.project_slug
JOIN temp_category_map c ON c.slug = data.category_slug
ON CONFLICT (project_id, category_id) DO NOTHING;

`;

  // Add verification
  sql += `-- Verify insertion
DO $$
DECLARE
  project_count integer;
  association_count integer;
BEGIN
  SELECT COUNT(*) INTO project_count FROM projects;
  SELECT COUNT(*) INTO association_count FROM project_categories;

  RAISE NOTICE '✅ Total projects inserted: %', project_count;
  RAISE NOTICE '✅ Total project-category associations: %', association_count;
END $$;
`;

  // Write to file
  console.log(`💾 Writing migration to ${OUTPUT_PATH}...`);
  fs.writeFileSync(OUTPUT_PATH, sql, 'utf8');

  console.log('✅ Migration file generated successfully!');
  console.log(`📊 Stats:`);
  console.log(`   - Projects: ${projectInserts.length}`);
  console.log(`   - Category Associations: ${categoryAssociations.length}`);
  console.log(`   - File size: ${(sql.length / 1024).toFixed(2)} KB`);
}

// =====================================================
// Main Execution
// =====================================================

try {
  generateMigration();
} catch (error) {
  console.error('❌ Error generating migration:', error);
  process.exit(1);
}
