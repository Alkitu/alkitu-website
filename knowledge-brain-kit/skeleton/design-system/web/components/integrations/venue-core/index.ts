// venue-core — shared infrastructure for seat-map, event-layout, indoor-map

// Types
export type * from './types';

// Hooks
export { useViewport } from './hooks/use-viewport';
export { useSelection } from './hooks/use-selection';
export { useUndoRedo } from './hooks/use-undo-redo';

// SVG Components
export { SvgViewport } from './svg/svg-viewport';
export type { SvgViewportProps } from './svg/svg-viewport';
export { SvgGrid } from './svg/svg-grid';
export type { SvgGridProps } from './svg/svg-grid';
export { SvgControls } from './svg/svg-controls';
export type { SvgControlsProps } from './svg/svg-controls';

// Utilities
export { getStateTokens, getStateFill, getAllStateTokens } from './utils/state-colors';
export type { StateColorTokens } from './utils/state-colors';
export * from './utils/geometry';
export { venueLayoutMetaSchema, pointSchema, rectSchema } from './utils/serialization';
