// event-layout — dynamic event space layout editor

// Types
export type * from './types';
export { ELEMENT_TYPES, createLayoutElement, createDefaultEventLayout } from './types';

// Editor
export { EventLayoutEditor } from './editor/event-layout-editor';
export type { EventLayoutEditorProps } from './editor/event-layout-editor';
export { ElementPalette } from './editor/element-palette';
export { ElementProperties } from './editor/element-properties';
export { EditorToolbar } from './editor/editor-toolbar';

// Element SVG components
export { TableRound } from './editor/elements/table-round';
export { TableRect } from './editor/elements/table-rect';
export { ChairElement } from './editor/elements/chair-element';
export { StageElement } from './editor/elements/stage-element';
export { BarElement } from './editor/elements/bar-element';
export { VipZoneElement } from './editor/elements/vip-zone-element';

// Viewer
export { EventLayoutViewer } from './viewer/event-layout-viewer';
export type { EventLayoutViewerProps } from './viewer/event-layout-viewer';
export { EventLayoutLegend } from './viewer/event-layout-legend';

// Utils
export { snapToLayoutGrid, findAlignmentGuides, distributeHorizontally, distributeVertically, alignCenterH, alignCenterV } from './utils/snap-engine';
export { serializeLayout, deserializeLayout, validateLayout, eventLayoutSchema } from './utils/layout-serializer';
