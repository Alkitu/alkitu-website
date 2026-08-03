// indoor-map — floor plans, stands, and commercial center mapping

// Types
export type * from './types';

// Admin
export { IndoorMapAdmin } from './admin/indoor-map-admin';
export type { IndoorMapAdminProps } from './admin/indoor-map-admin';
export { SvgImporter } from './admin/svg-importer';
export { AreaDataLinker } from './admin/area-data-linker';
export { FloorManager } from './admin/floor-manager';
export { AreaNavigator } from './admin/area-navigator';
export { PoiPlacer } from './admin/poi-placer';

// Viewer
export { IndoorMapViewer } from './viewer/indoor-map-viewer';
export type { IndoorMapViewerProps } from './viewer/indoor-map-viewer';
export { IndoorMapArea } from './viewer/indoor-map-area';
export { IndoorMapTooltip } from './viewer/indoor-map-tooltip';
export { IndoorMapFilters } from './viewer/indoor-map-filters';
export { IndoorMapSearch } from './viewer/indoor-map-search';
export { IndoorMapFloor } from './viewer/indoor-map-floor';
export { IndoorMapPoi, POI_TYPE_INFO } from './viewer/indoor-map-poi';

// Utils
export { parseSvgToAreas } from './utils/svg-parser';
export type { SvgParseOptions } from './utils/svg-parser';
export { hitTestArea, findAreaAtPoint } from './utils/area-hit-test';
