// seat-map — fixed venue seat layouts (theaters, cinemas, airplanes)

// Types
export type * from './types';

// Admin
export { SeatMapConfigurator } from './admin/seat-map-configurator';
export type { SeatMapConfiguratorProps } from './admin/seat-map-configurator';
export { SeatMapSectionEditor } from './admin/seat-map-section-editor';
export { SeatMapZoneEditor } from './admin/seat-map-zone-editor';

// Viewer
export { SeatMapViewer } from './viewer/seat-map-viewer';
export type { SeatMapViewerProps } from './viewer/seat-map-viewer';
export { SeatElement } from './viewer/seat';
export { SeatLegend } from './viewer/seat-legend';

// Utils
export {
  generateSeatMap,
  generateSection,
  computeSeatMapBounds,
  createDefaultSeatMapConfig,
  createDefaultSectionConfig,
} from './utils/seat-layout-engine';
export {
  applyOccupiedSeats,
  applySeatSelection,
  toggleSeatSelection,
  applyZoneAssignments,
  findSeat,
  countByStatus,
  totalSeatCount,
} from './utils/seat-state-manager';
