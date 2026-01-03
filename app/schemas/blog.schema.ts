import { z } from 'zod';

// Schema for content sections within blog posts
export const blogSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['heading', 'paragraph', 'list', 'blockquote', 'code', 'image', 'callout']),
  level: z.number().min(2).max(4).optional(), // For headings: h2, h3, h4
  content: z.string(),
  items: z.array(z.string()).optional(), // For lists
  language: z.string().optional(), // For code blocks
  src: z.string().optional(), // For images
  alt: z.string().optional(), // For images
  caption: z.string().optional(), // For images
  variant: z.enum(['info', 'warning', 'tip', 'important']).optional(), // For callouts
});

// Schema for blog post translations
export const blogPostTranslationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  sections: z.array(blogSectionSchema).optional(),
});

// Schema for individual blog post
export const blogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  translations: z.record(z.string(), blogPostTranslationSchema),
  image: z.string().url(),
  imageAlt: z.string().optional(),
  category: z.string(),
  date: z.string(), // ISO 8601 date string
  updatedAt: z.string().optional(),
  readTime: z.string(),
  author: z.string(),
  featured: z.boolean().optional(),
  lang: z.array(z.enum(['en', 'es'])),
  tags: z.array(z.string()).optional(),
});

// Schema for blog category
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

// Export inferred types
export type BlogSection = z.infer<typeof blogSectionSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostRaw = z.infer<typeof blogPostSchema>;
export type BlogPostTranslation = z.infer<typeof blogPostTranslationSchema>;
export type Category = z.infer<typeof categorySchema>;
