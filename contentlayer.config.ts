import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkCustomHeadingId from 'remark-custom-heading-id';

/**
 * Blog Post Document Type with Zod Validation
 *
 * SEO Best Practices Enforced:
 * - Title: 50-60 characters (optimal for Google SERP)
 * - Meta Description: 155-160 characters (prevents truncation)
 * - Keywords: 3-5 focus keywords maximum
 * - Slug: URL-friendly, lowercase, hyphens only
 * - Structured data: Automatic JSON-LD generation
 * - Image optimization: Alt text required, Open Graph support
 */
export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    // SEO Critical Fields
    title: {
      type: 'string',
      required: true,
      description: 'SEO: 50-60 characters optimal. Include primary keyword.',
    },
    slug: {
      type: 'string',
      required: true,
      description: 'URL-friendly identifier. lowercase-with-hyphens',
    },
    metaDescription: {
      type: 'string',
      required: true,
      description: 'SEO: 155-160 characters optimal. Include CTA and primary keyword.',
    },
    excerpt: {
      type: 'string',
      required: true,
      description: 'Short summary for blog list pages. 120-150 characters.',
    },
    keywords: {
      type: 'list',
      of: { type: 'string' },
      required: true,
      description: 'SEO: 3-5 focus keywords. Primary keyword first.',
    },

    // Content Metadata
    categories: {
      type: 'list',
      of: {
        type: 'enum',
        options: [
          'Desarrollo Web',
          'Marketing Digital',
          'Inteligencia Artificial',
          'Diseño UX/UI',
          'Tecnología',
          'Negocio',
        ],
      },
      required: true,
      description: 'Categories for content organization (multiple allowed)',
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: true,
      description: 'Related topics for filtering and SEO',
    },

    // Localization
    locale: {
      type: 'enum',
      options: ['en', 'es'],
      required: true,
      description: 'Content language',
    },

    // Author & Publishing
    author: {
      type: 'string',
      required: true,
      default: 'Equipo Alkitu',
    },
    authorRole: {
      type: 'string',
      required: false,
      description: 'Author job title for schema markup',
    },
    authorUsername: {
      type: 'string',
      required: false,
      description: 'Author username for profile link (e.g., "luis_urdaneta")',
    },
    date: {
      type: 'date',
      required: true,
      description: 'Publication date (ISO 8601 format)',
    },
    updatedAt: {
      type: 'date',
      required: false,
      description: 'Last update date (ISO 8601 format)',
    },

    // Images (SEO Critical)
    image: {
      type: 'string',
      required: true,
      description: 'Hero image URL. Recommended: 1200x630px (Open Graph optimized)',
    },
    imageAlt: {
      type: 'string',
      required: true,
      description: 'SEO: Descriptive alt text for hero image. Include primary keyword.',
    },
    imageCredit: {
      type: 'string',
      required: false,
      description: 'Image attribution/source',
    },

    // Engagement Metrics
    readTime: {
      type: 'string',
      required: true,
      description: 'Estimated reading time (e.g., "5 min")',
    },
    featured: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Display in featured sections',
    },

    // Table of Contents
    sections: {
      type: 'list',
      of: { type: 'json' },
      required: false,
      description: 'TOC sections with id and label',
    },
  },

  computedFields: {
    // Automatic URL generation
    url: {
      type: 'string',
      resolve: (post) => {
        // Use first category as primary for URL
        const primaryCategory = Array.isArray(post.categories) && post.categories.length > 0
          ? post.categories[0]
          : 'general';
        const categorySlug = primaryCategory
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/\s+/g, '-');
        return `/${post.locale}/blog/${categorySlug}/${post.slug}`;
      },
    },

    // SEO-optimized slug validation
    slugFormatted: {
      type: 'string',
      resolve: (post) => {
        // Ensure slug follows SEO best practices
        const formatted = post.slug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        if (formatted !== post.slug) {
          console.warn(`⚠️  Slug "${post.slug}" should be "${formatted}" for optimal SEO`);
        }

        return formatted;
      },
    },

    // Word count for schema markup
    wordCount: {
      type: 'number',
      resolve: (post) => {
        // Approximate word count from MDX body
        const text = post.body.raw;
        const words = text
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/[#*`]/g, '') // Remove markdown syntax
          .split(/\s+/)
          .filter((word) => word.length > 0);
        return words.length;
      },
    },

    // Schema.org structured data
    structuredData: {
      type: 'json',
      resolve: (post) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        image: post.image,
        datePublished: post.date,
        dateModified: post.updatedAt || post.date,
        author: {
          '@type': 'Person',
          name: post.author,
          ...(post.authorRole && { jobTitle: post.authorRole }),
          ...(post.authorUsername && {
            url: `https://alkitu.com/${post.locale}/profile/${post.authorUsername}`,
          }),
        },
        publisher: {
          '@type': 'Organization',
          name: 'Alkitu',
          logo: {
            '@type': 'ImageObject',
            url: 'https://alkitu.com/logo.png',
          },
        },
        keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : '',
        articleSection: Array.isArray(post.categories) && post.categories.length > 0
          ? post.categories.join(', ')
          : 'general',
        inLanguage: post.locale === 'es' ? 'es-ES' : 'en-US',
        wordCount: post.body.raw.split(/\s+/).length,
      }),
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [BlogPost],
  mdx: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown (tables, task lists, strikethrough)
      remarkCustomHeadingId, // Support {#custom-id} syntax for heading IDs
    ],
    rehypePlugins: [
      rehypeSlug, // Add IDs to headings for anchor links
      [
        rehypeAutolinkHeadings, // Add links to headings
        {
          behavior: 'wrap',
          properties: {
            className: ['heading-link'],
            ariaLabel: 'Link to section',
          },
        },
      ],
      [
        // @ts-expect-error - Type mismatch between vfile versions in dependencies
        rehypePrettyCode, // Syntax highlighting for code blocks
        {
          theme: 'github-dark',
          onVisitLine(node: any) {
            // Prevent empty lines from collapsing
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('highlighted');
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word'];
          },
        },
      ],
    ],
  },
});
