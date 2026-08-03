import type { VenueElementState, VenueLayoutMeta } from '../venue-core/types';

// ---------------------------------------------------------------------------
// Seat Map — types for fixed venue layouts (theaters, cinemas, airplanes)
// ---------------------------------------------------------------------------

/** Shape of an individual seat SVG element */
export type SeatShape = 'rect' | 'circle';

/** State of a single seat */
export type SeatStatus = Extract<VenueElementState, 'available' | 'occupied' | 'selected' | 'disabled' | 'reserved'>;

/** Individual seat */
export interface Seat {
  id: string;
  /** Row label (e.g. "A", "B", "C") */
  row: string;
  /** Column number within the row */
  column: number;
  /** Computed SVG x coordinate */
  x: number;
  /** Computed SVG y coordinate */
  y: number;
  /** Current status */
  status: SeatStatus;
  /** Pricing zone this seat belongs to */
  zoneId?: string;
  /** Display label (e.g. "A12") */
  label: string;
}

/** A row of seats */
export interface SeatRow {
  id: string;
  /** Row label (e.g. "A") */
  label: string;
  /** Index of the row (0-based from front) */
  index: number;
  seats: Seat[];
}

/** Configuration for a section of seats */
export interface SectionConfig {
  id: string;
  name: string;
  /** Number of rows */
  rows: number;
  /** Number of columns (seats per row) */
  columns: number;
  /** Columns after which to insert an aisle (0-indexed) */
  aisles: number[];
  /** Curvature factor for curved sections (0 = straight, 1 = max curve) */
  curvature: number;
  /** Starting row label (e.g. "A") */
  startRowLabel: string;
  /** Offset position of this section in the venue */
  offsetX: number;
  offsetY: number;
}

/** A generated section containing rows of seats */
export interface SeatSection {
  id: string;
  name: string;
  config: SectionConfig;
  rows: SeatRow[];
}

/** Pricing zone definition */
export interface PricingZone {
  id: string;
  name: string;
  /** Price value (currency-agnostic) */
  price: number;
  /** Custom color override (hex). Falls back to auto-generated if not set. */
  color?: string;
}

/** Complete seat map configuration (admin) */
export interface SeatMapConfig extends VenueLayoutMeta {
  sections: SectionConfig[];
  zones: PricingZone[];
  /** Shape for seat elements */
  seatShape: SeatShape;
  /** Size of each seat element in SVG units */
  seatSize: number;
  /** Gap between seats in SVG units */
  seatGap: number;
  /** Whether to show row labels */
  showRowLabels: boolean;
  /** Whether to show seat numbers */
  showSeatNumbers: boolean;
}

/** Complete seat map data (viewer) — config + generated seat data + statuses */
export interface SeatMapData {
  config: SeatMapConfig;
  sections: SeatSection[];
  /** Zone ID → section IDs + row ranges that belong to it */
  zoneAssignments: Record<string, ZoneAssignment[]>;
}

export interface ZoneAssignment {
  sectionId: string;
  /** Row range (inclusive). If omitted, the entire section is in this zone. */
  startRow?: number;
  endRow?: number;
}

/** Callback when seats are selected/deselected */
export type OnSeatSelect = (selectedSeatIds: string[]) => void;
