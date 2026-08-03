// ---------------------------------------------------------------------------
// Venue-Core — Shared types for seat-map, event-layout, and indoor-map modules
// ---------------------------------------------------------------------------

/** 2D point in SVG coordinate space */
export interface Point {
  x: number;
  y: number;
}

/** Axis-aligned bounding rectangle */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Transform state for a viewport (pan + zoom) */
export interface ViewportState {
  /** Horizontal pan offset (px) */
  x: number;
  /** Vertical pan offset (px) */
  y: number;
  /** Zoom scale factor (1 = 100%) */
  zoom: number;
}

export interface ViewportConfig {
  /** Minimum zoom level (default 0.1) */
  minZoom?: number;
  /** Maximum zoom level (default 5) */
  maxZoom?: number;
  /** Initial viewport state */
  initial?: Partial<ViewportState>;
  /** Zoom step multiplier for button controls (default 0.25) */
  zoomStep?: number;
}

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

export type SelectionMode = 'single' | 'multiple';

export interface SelectionConfig {
  mode?: SelectionMode;
  /** Maximum number of items that can be selected (only for 'multiple') */
  maxSelection?: number;
}

// ---------------------------------------------------------------------------
// Element states (shared across modules)
// ---------------------------------------------------------------------------

export type VenueElementState =
  | 'available'
  | 'occupied'
  | 'selected'
  | 'disabled'
  | 'reserved'
  | 'hover';

// ---------------------------------------------------------------------------
// Undo / Redo
// ---------------------------------------------------------------------------

/** A reversible command for the undo/redo stack */
export interface UndoableCommand<T = unknown> {
  /** Human-readable label for the action */
  label: string;
  /** Execute the action, returning the new state */
  execute: (state: T) => T;
  /** Reverse the action, returning the previous state */
  undo: (state: T) => T;
}

// ---------------------------------------------------------------------------
// Serialization base
// ---------------------------------------------------------------------------

/** Base metadata shared by all venue layout types */
export interface VenueLayoutMeta {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
