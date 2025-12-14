import { z } from 'zod';

/**
 * Schema for page view tracking events
 */
export const PageViewSchema = z.object({
  action: z.literal('page_view'),
  sessionFingerprint: z.string().min(1, 'Session fingerprint is required'),
  pagePath: z.string().min(1, 'Page path is required'),
  locale: z.string().min(2).max(5),
  referrer: z.string().optional().default(''),
});

/**
 * Schema for page exit tracking events
 */
export const PageExitSchema = z.object({
  action: z.literal('page_exit'),
  sessionFingerprint: z.string().min(1, 'Session fingerprint is required'),
  pageViewId: z.string().uuid('Invalid page view ID'),
  timeOnPage: z.number().int().nonnegative(),
});

/**
 * Combined schema for all tracking events
 */
export const TrackingEventSchema = z.discriminatedUnion('action', [
  PageViewSchema,
  PageExitSchema,
]);

/**
 * Type exports
 */
export type PageViewEvent = z.infer<typeof PageViewSchema>;
export type PageExitEvent = z.infer<typeof PageExitSchema>;
export type TrackingEvent = z.infer<typeof TrackingEventSchema>;
