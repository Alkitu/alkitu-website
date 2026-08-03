import { z } from 'zod/v4';

// ---------------------------------------------------------------------------
// Base Zod schemas for venue layout serialization
// Each module extends these with its own specific fields.
// ---------------------------------------------------------------------------

/** Base metadata schema for all venue layouts */
export const venueLayoutMetaSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.iso.datetime({ offset: true }).optional().or(z.string()),
  updatedAt: z.iso.datetime({ offset: true }).optional().or(z.string()),
  version: z.number().int().min(1),
});

/** 2D point schema */
export const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

/** Bounding rectangle schema */
export const rectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().min(0),
  height: z.number().min(0),
});
