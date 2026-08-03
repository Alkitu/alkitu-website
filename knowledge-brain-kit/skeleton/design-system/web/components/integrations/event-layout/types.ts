import type { Point, VenueLayoutMeta } from '../venue-core/types';

// ---------------------------------------------------------------------------
// Event Layout — types for dynamic event space layouts
// ---------------------------------------------------------------------------

/** Available element types that can be placed on the canvas */
export type ElementType =
  | 'table-round'
  | 'table-rect'
  | 'chair'
  | 'stage'
  | 'bar'
  | 'vip-zone';

/** Tool modes for the editor */
export type ToolMode = 'select' | 'pan';

/** A single placed element on the canvas */
export interface LayoutElement {
  id: string;
  type: ElementType;
  /** Position (center point) */
  x: number;
  y: number;
  /** Dimensions */
  width: number;
  height: number;
  /** Rotation in degrees (0-360) */
  rotation: number;
  /** Display label */
  label: string;
  /** Capacity (seats at table, people in zone, etc.) */
  capacity?: number;
  /** Category/grouping */
  category?: string;
  /** Whether the element is locked (cannot be moved) */
  locked?: boolean;
}

/** Element type metadata for the palette */
export interface ElementTypeInfo {
  type: ElementType;
  label: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultCapacity?: number;
}

/** Complete event layout */
export interface EventLayout extends VenueLayoutMeta {
  /** Canvas dimensions (SVG viewBox) */
  canvasWidth: number;
  canvasHeight: number;
  /** All placed elements */
  elements: LayoutElement[];
  /** Grid size for snap-to-grid (0 = disabled) */
  gridSize: number;
}

/** Callback when the layout changes */
export type OnLayoutChange = (layout: EventLayout) => void;

// ---------------------------------------------------------------------------
// Element type definitions
// ---------------------------------------------------------------------------

export const ELEMENT_TYPES: ElementTypeInfo[] = [
  { type: 'table-round', label: 'Round Table', icon: 'circle', defaultWidth: 60, defaultHeight: 60, defaultCapacity: 8 },
  { type: 'table-rect', label: 'Rect Table', icon: 'square', defaultWidth: 80, defaultHeight: 40, defaultCapacity: 6 },
  { type: 'chair', label: 'Chair', icon: 'armchair', defaultWidth: 20, defaultHeight: 20, defaultCapacity: 1 },
  { type: 'stage', label: 'Stage', icon: 'presentation', defaultWidth: 200, defaultHeight: 80 },
  { type: 'bar', label: 'Bar / Counter', icon: 'wine', defaultWidth: 120, defaultHeight: 30 },
  { type: 'vip-zone', label: 'VIP Zone', icon: 'crown', defaultWidth: 150, defaultHeight: 100 },
];

/** Create a new element with defaults */
export function createLayoutElement(
  type: ElementType,
  position: Point,
  label?: string,
): LayoutElement {
  const info = ELEMENT_TYPES.find((t) => t.type === type)!;
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    x: position.x,
    y: position.y,
    width: info.defaultWidth,
    height: info.defaultHeight,
    rotation: 0,
    label: label ?? info.label,
    capacity: info.defaultCapacity,
  };
}

/** Create a default empty event layout */
export function createDefaultEventLayout(): EventLayout {
  return {
    id: crypto.randomUUID(),
    name: 'New Event Layout',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    canvasWidth: 1000,
    canvasHeight: 600,
    elements: [],
    gridSize: 10,
  };
}
