import type { VenueLayoutMeta } from '../venue-core/types';

// ---------------------------------------------------------------------------
// Indoor Map — types for floor plans, stands, and commercial centers
// ---------------------------------------------------------------------------

/** Status of a mappable area */
export type AreaStatus = 'available' | 'occupied' | 'highlighted' | 'disabled';

/** Category for grouping/filtering areas */
export interface AreaCategory {
  id: string;
  name: string;
  /** Icon name (from lucide-react) or emoji */
  icon?: string;
  /** Color for the category (hex or CSS variable) */
  color?: string;
}

/** Rich data associated with a mapped area (stand, store, booth, etc.) */
export interface AreaData {
  name: string;
  description?: string;
  categoryId?: string;
  /** Operating schedule (free text, e.g. "9:00 AM - 6:00 PM") */
  schedule?: string;
  /** Location reference (e.g. "Level 2, Wing B") */
  location?: string;
  /** Logo or image URL */
  logoUrl?: string;
  /** Contact info */
  phone?: string;
  email?: string;
  website?: string;
  /** Arbitrary extra metadata */
  metadata?: Record<string, string>;
}

/** A single mappable area extracted from an SVG floor plan */
export interface MapArea {
  /** Unique identifier (matches the SVG element id) */
  id: string;
  /** SVG path data (d attribute) or element type info */
  svgPath: string;
  /** Original SVG element tag (path, rect, polygon, circle, etc.) */
  svgTag: string;
  /** Original SVG attributes (for faithful re-rendering) */
  svgAttributes: Record<string, string>;
  /** Centroid of the area (for label/tooltip positioning) */
  centroidX: number;
  centroidY: number;
  /** Linked data (null if not yet linked by admin) */
  data: AreaData | null;
  /** Current display status */
  status: AreaStatus;
}

// FloorLevel is defined below after POI types

// ---------------------------------------------------------------------------
// Points of Interest (POI) — pins for bathrooms, elevators, stairs, etc.
// ---------------------------------------------------------------------------

export type PoiType = 'restroom' | 'elevator' | 'stairs' | 'escalator' | 'exit' | 'info' | 'atm' | 'parking' | 'food-court' | 'custom';

export interface PointOfInterest {
  id: string;
  type: PoiType;
  label?: string;
  x: number;
  y: number;
  /** Custom icon override (emoji or lucide icon name) */
  icon?: string;
}

/** Complete indoor map configuration */
export interface IndoorMapConfig extends VenueLayoutMeta {
  floors: FloorLevel[];
  categories: AreaCategory[];
}

/** A single floor/level extended with POIs */
export interface FloorLevel {
  id: string;
  name: string;
  order: number;
  svgContent: string;
  areas: MapArea[];
  viewBox: string;
  /** Points of interest on this floor */
  pois?: PointOfInterest[];
}

/** Callback when an area is clicked */
export type OnAreaClick = (area: MapArea) => void;
/** Callback when areas are filtered */
export type OnFilterChange = (activeCategoryIds: string[]) => void;
