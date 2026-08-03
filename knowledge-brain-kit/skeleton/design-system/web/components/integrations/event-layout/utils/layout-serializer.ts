import { z } from 'zod/v4';
import { venueLayoutMetaSchema, pointSchema } from '../../venue-core/utils/serialization';
import type { EventLayout } from '../types';

// ---------------------------------------------------------------------------
// Layout Serializer — JSON serialization/deserialization for event layouts
// ---------------------------------------------------------------------------

const elementTypeSchema = z.enum([
  'table-round',
  'table-rect',
  'chair',
  'stage',
  'bar',
  'vip-zone',
]);

const layoutElementSchema = z.object({
  id: z.string(),
  type: elementTypeSchema,
  x: z.number(),
  y: z.number(),
  width: z.number().min(1),
  height: z.number().min(1),
  rotation: z.number().min(0).max(360),
  label: z.string(),
  capacity: z.number().int().min(0).optional(),
  category: z.string().optional(),
  locked: z.boolean().optional(),
});

export const eventLayoutSchema = venueLayoutMetaSchema.extend({
  canvasWidth: z.number().min(100),
  canvasHeight: z.number().min(100),
  elements: z.array(layoutElementSchema),
  gridSize: z.number().min(0),
});

/** Serialize an event layout to a JSON string */
export function serializeLayout(layout: EventLayout): string {
  return JSON.stringify(layout, null, 2);
}

/** Deserialize and validate a JSON string into an EventLayout */
export function deserializeLayout(json: string): EventLayout {
  const parsed = JSON.parse(json);
  return eventLayoutSchema.parse(parsed) as EventLayout;
}

/** Validate a layout object */
export function validateLayout(layout: unknown): { success: boolean; error?: string } {
  const result = eventLayoutSchema.safeParse(layout);
  if (result.success) return { success: true };
  return { success: false, error: result.error.message };
}
