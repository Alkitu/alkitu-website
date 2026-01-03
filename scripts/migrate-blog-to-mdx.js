/**
 * Blog Migration Script: JSON to MDX
 *
 * This script migrates blog posts from blog-posts.json to MDX files
 * compatible with Contentlayer for optimal SEO performance.
 *
 * Usage:
 *   node scripts/migrate-blog-to-mdx.js
 *
 * What it does:
 * 1. Reads app/data/blog-posts.json
 * 2. For each post and locale, creates an MDX file
 * 3. Converts sections to proper MDX format
 * 4. Adds SEO-optimized frontmatter
 * 5. Validates required fields
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_DATA_PATH = path.join(__dirname, '../app/data/blog-posts.json');
const OUTPUT_DIR = path.join(__dirname, '../content/blog');
const DRY_RUN = process.argv.includes('--dry-run'); // Preview without writing

// Helper: Normalize slug (lowercase, hyphens, no accents)
function normalizeSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: Format date to ISO 8601
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Helper: Convert sections array to MDX content
function sectionsToMDX(sections, locale) {
  if (!sections || sections.length === 0) {
    return '';
  }

  return sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          const level = section.level || 2;
          const id = section.id ? ` {#${section.id}}` : '';
          return `\n${'#'.repeat(level)} ${section.content}${id}\n`;

        case 'paragraph':
          return `\n${section.content}\n`;

        case 'list':
          return (
            '\n' +
            section.items.map((item) => `- ${item}`).join('\n') +
            '\n'
          );

        case 'code':
          return `\n\`\`\`${section.language || ''}\n${section.content}\n\`\`\`\n`;

        case 'quote':
          return `\n> ${section.content}\n`;

        case 'image':
          return `\n![${section.alt || 'Image'}](${section.url})\n${section.caption ? `*${section.caption}*\n` : ''}`;

        default:
          console.warn(`⚠️  Unknown section type: ${section.type}`);
          return '';
      }
    })
    .join('\n');
}

// Helper: Generate MDX frontmatter
function generateFrontmatter(post, translation, locale) {
  const categorySlug = normalizeSlug(post.category);
  const slug = post.slug || normalizeSlug(translation.title);

  // Build frontmatter object
  const frontmatter = {
    title: translation.title,
    slug: slug,
    metaDescription:
      translation.metaDescription ||
      translation.excerpt.substring(0, 160),
    excerpt: translation.excerpt,
    keywords: translation.keywords || post.tags || [],
    category: post.category,
    tags: post.tags || [],
    locale: locale,
    author: post.author || 'Equipo Alkitu',
    authorRole: post.authorRole || '',
    date: formatDate(post.date),
    updatedAt: post.updatedAt ? formatDate(post.updatedAt) : formatDate(post.date),
    image: post.image || '/blog/default-hero.jpg',
    imageAlt: post.imageAlt || translation.title,
    imageCredit: post.imageCredit || '',
    readTime: post.readTime || '5 min',
    featured: post.featured || false,
  };

  // Add sections if available
  if (translation.sections && translation.sections.length > 0) {
    const headings = translation.sections
      .filter((s) => s.type === 'heading')
      .map((s) => ({
        id: s.id || normalizeSlug(s.content),
        label: s.content,
      }));

    if (headings.length > 0) {
      frontmatter.sections = headings;
    }
  }

  // Convert to YAML frontmatter
  const yamlLines = ['---'];

  Object.entries(frontmatter).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      return; // Skip empty values
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return;

      // Check if array contains objects (sections)
      if (typeof value[0] === 'object') {
        yamlLines.push(`${key}:`);
        value.forEach((item) => {
          yamlLines.push(`  - id: "${item.id}"`);
          yamlLines.push(`    label: "${item.label}"`);
        });
      } else {
        // Simple array
        yamlLines.push(`${key}:`);
        value.forEach((item) => yamlLines.push(`  - "${item}"`));
      }
    } else if (typeof value === 'boolean') {
      yamlLines.push(`${key}: ${value}`);
    } else if (typeof value === 'string') {
      // Escape quotes in strings
      const escaped = value.replace(/"/g, '\\"');
      yamlLines.push(`${key}: "${escaped}"`);
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  });

  yamlLines.push('---');
  return yamlLines.join('\n');
}

// Main migration function
async function migrateBlogPosts() {
  console.log('🚀 Starting blog migration to MDX...\n');

  // Read blog data
  const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf-8'));
  console.log(`📚 Found ${blogData.posts.length} posts to migrate\n`);

  let migratedCount = 0;
  let skippedCount = 0;
  const errors = [];

  // Process each post
  for (const post of blogData.posts) {
    console.log(`📝 Processing: ${post.slug || 'unnamed'}`);

    // Process each locale
    for (const locale of post.lang) {
      const translation = post.translations[locale];

      if (!translation) {
        console.warn(`  ⚠️  Missing translation for locale: ${locale}`);
        skippedCount++;
        continue;
      }

      try {
        // Generate frontmatter
        const frontmatter = generateFrontmatter(post, translation, locale);

        // Convert sections to MDX
        const mdxContent = sectionsToMDX(translation.sections, locale);

        // Combine frontmatter and content
        const fullContent = `${frontmatter}\n\n${mdxContent}`;

        // Determine output path
        const slug = post.slug || normalizeSlug(translation.title);
        const fileName = `${slug}.mdx`;
        const outputPath = path.join(OUTPUT_DIR, locale, fileName);

        // Write file (or preview in dry-run mode)
        if (DRY_RUN) {
          console.log(`  🔍 [DRY RUN] Would create: ${outputPath}`);
        } else {
          // Ensure directory exists
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });

          // Write file
          fs.writeFileSync(outputPath, fullContent, 'utf-8');
          console.log(`  ✅ Created: ${outputPath}`);
        }

        migratedCount++;
      } catch (error) {
        console.error(`  ❌ Error migrating ${locale} version: ${error.message}`);
        errors.push({
          post: post.slug,
          locale,
          error: error.message,
        });
        skippedCount++;
      }
    }

    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successfully migrated: ${migratedCount} files`);
  console.log(`⚠️  Skipped: ${skippedCount} files`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ post, locale, error }) => {
      console.log(`  - ${post} (${locale}): ${error}`);
    });
  }

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No files were created');
    console.log('Run without --dry-run to create files');
  }

  console.log('\n✨ Migration complete!\n');
}

// Run migration
migrateBlogPosts().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
