import { z } from 'zod';

// Schema for project URL
export const projectUrlSchema = z.object({
  name: z.string(),
  fallback: z.string().optional(),
  active: z.boolean(),
  url: z.string().url(),
});

// Schema for individual project
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  categories: z.array(z.string()),
  description: z.string(),
  about: z.string(),
  tags: z.array(z.string()),
  image: z.string().url(),
  gallery: z.array(z.string().url()),
  urls: z.array(projectUrlSchema),
  url: z.string().url(),
});

// Export inferred types
export type Project = z.infer<typeof projectSchema>;
export type ProjectUrl = z.infer<typeof projectUrlSchema>;
