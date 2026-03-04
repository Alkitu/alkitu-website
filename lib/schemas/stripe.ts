/**
 * Stripe Zod Schemas
 *
 * Validation schemas for Stripe-related API routes.
 */

import { z } from 'zod';

/** Schema for Stripe settings in billing_settings */
export const stripeSettingsSchema = z.object({
  stripe_enabled: z.boolean().default(false),
  stripe_auto_invoice: z.boolean().default(false),
  stripe_auto_issue: z.boolean().default(false),
  stripe_secret_key: z.string().nullable().optional(),
  stripe_webhook_secret: z.string().nullable().optional(),
});

export type StripeSettingsInput = z.infer<typeof stripeSettingsSchema>;

/** Schema for Stripe events query */
export const stripeEventsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  event_type: z.string().optional(),
  processed: z.enum(['all', 'true', 'false']).default('all'),
});
