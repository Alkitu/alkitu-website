import { z } from 'zod';

// Schema for blog post translations
export const blogPostTranslationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
});

// Schema for individual blog post
export const blogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  translations: z.record(z.string(), blogPostTranslationSchema),
  image: z.string().url(),
  category: z.string(),
  date: z.string(), // ISO 8601 date string
  readTime: z.string(),
  author: z.string(),
  featured: z.boolean().optional(),
  lang: z.array(z.enum(['en', 'es'])),
});

// Schema for blog category
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

// Export inferred types
export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostRaw = z.infer<typeof blogPostSchema>;
export type BlogPostTranslation = z.infer<typeof blogPostTranslationSchema>;
export type Category = z.infer<typeof categorySchema>;
