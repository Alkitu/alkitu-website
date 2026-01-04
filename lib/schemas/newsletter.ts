import { z } from 'zod';

/**
 * Zod schema for newsletter subscription validation
 *
 * Validates newsletter subscription requests including:
 * - Email (required, valid email format)
 * - Locale (required, 'en' or 'es')
 *
 * Used by:
 * - POST /api/newsletter/subscribe endpoint
 * - Frontend newsletter form validation
 */
export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .email('Formato de email inválido / Invalid email format')
    .min(5, 'El email debe tener al menos 5 caracteres / Email must be at least 5 characters')
    .max(255, 'El email no puede exceder 255 caracteres / Email cannot exceed 255 characters')
    .toLowerCase()
    .trim(),

  locale: z
    .enum(['en', 'es'], {
      errorMap: () => ({ message: 'Idioma debe ser "en" o "es" / Locale must be "en" or "es"' }),
    }),
});

/**
 * TypeScript type inferred from the Zod schema
 * Use this type for type-safe subscription handling
 */
export type NewsletterSubscribeData = z.infer<typeof newsletterSubscribeSchema>;

/**
 * Schema for newsletter subscriber with metadata
 * Includes database fields and computed properties
 *
 * Used by:
 * - Admin panel display
 * - Database operations
 */
export const newsletterSubscriberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  status: z.enum(['pending', 'active', 'inactive', 'unsubscribed']),
  locale: z.enum(['en', 'es']),
  verification_token: z.string().nullable(),
  unsubscribe_token: z.string(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  verified_at: z.string().nullable(), // ISO datetime string
  unsubscribed_at: z.string().nullable(), // ISO datetime string
  created_at: z.string(), // ISO datetime string
  updated_at: z.string(), // ISO datetime string
});

/**
 * TypeScript type for complete newsletter subscriber
 */
export type NewsletterSubscriber = z.infer<typeof newsletterSubscriberSchema>;

/**
 * Schema for admin query parameters (list endpoint)
 *
 * Used by:
 * - GET /api/admin/newsletter-subscribers endpoint
 */
export const newsletterAdminQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),

  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100)),

  status: z
    .enum(['pending', 'active', 'inactive', 'unsubscribed', 'all'])
    .optional()
    .default('all'),

  locale: z
    .enum(['en', 'es', 'all'])
    .optional()
    .default('all'),

  search: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined),
});

/**
 * TypeScript type for admin query parameters
 */
export type NewsletterAdminQuery = z.infer<typeof newsletterAdminQuerySchema>;

/**
 * Schema for updating unsubscribe status
 *
 * Used by:
 * - POST /api/newsletter/unsubscribe/[token] endpoint
 */
export const newsletterUnsubscribeSchema = z.object({
  exitTime: z.string().datetime().optional(), // ISO datetime string
});

/**
 * TypeScript type for unsubscribe data
 */
export type NewsletterUnsubscribeData = z.infer<typeof newsletterUnsubscribeSchema>;
