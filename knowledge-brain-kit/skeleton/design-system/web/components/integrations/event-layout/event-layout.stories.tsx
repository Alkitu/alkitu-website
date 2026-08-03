import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventLayoutEditor } from './editor/event-layout-editor';
import { EventLayoutViewer } from './viewer/event-layout-viewer';
import type { EventLayout } from './types';

const meta: Meta = {
  title: 'Integrations/Spatial/Event Layout',
};
export default meta;

// ---------------------------------------------------------------------------
// Editor — empty canvas
// ---------------------------------------------------------------------------

export const Editor: StoryObj = {
  render: () => (
    <div className="h-[700px] border border-border rounded-lg overflow-hidden">
      <EventLayoutEditor
        onSave={(layout) => console.log('Save layout:', layout)}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Editor — pre-populated layout
// ---------------------------------------------------------------------------

export const EditorWithData: StoryObj = {
  render: () => {
    const layout: EventLayout = {
      id: 'demo-1',
      name: 'Wedding Reception',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      canvasWidth: 1000,
      canvasHeight: 600,
      gridSize: 10,
      elements: [
        { id: 'stage-1', type: 'stage', x: 500, y: 60, width: 250, height: 60, rotation: 0, label: 'Main Stage' },
        { id: 'bar-1', type: 'bar', x: 900, y: 300, width: 30, height: 200, rotation: 90, label: 'Open Bar' },
        { id: 'rt-1', type: 'table-round', x: 200, y: 200, width: 60, height: 60, rotation: 0, label: 'Table 1', capacity: 8 },
        { id: 'rt-2', type: 'table-round', x: 350, y: 200, width: 60, height: 60, rotation: 0, label: 'Table 2', capacity: 8 },
        { id: 'rt-3', type: 'table-round', x: 500, y: 200, width: 60, height: 60, rotation: 0, label: 'Table 3', capacity: 8 },
        { id: 'rt-4', type: 'table-round', x: 650, y: 200, width: 60, height: 60, rotation: 0, label: 'Table 4', capacity: 8 },
        { id: 'rt-5', type: 'table-round', x: 200, y: 350, width: 60, height: 60, rotation: 0, label: 'Table 5', capacity: 8 },
        { id: 'rt-6', type: 'table-round', x: 350, y: 350, width: 60, height: 60, rotation: 0, label: 'Table 6', capacity: 8 },
        { id: 'rect-1', type: 'table-rect', x: 500, y: 400, width: 120, height: 50, rotation: 0, label: 'Head Table', capacity: 10 },
        { id: 'vip-1', type: 'vip-zone', x: 150, y: 500, width: 200, height: 80, rotation: 0, label: 'VIP Lounge', capacity: 20 },
      ],
    };

    return (
      <div className="h-[700px] border border-border rounded-lg overflow-hidden">
        <EventLayoutEditor
          initialLayout={layout}
          onSave={(l) => console.log('Save layout:', l)}
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Viewer — read-only
// ---------------------------------------------------------------------------

export const Viewer: StoryObj = {
  render: () => {
    const layout: EventLayout = {
      id: 'demo-view',
      name: 'Conference Setup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      canvasWidth: 800,
      canvasHeight: 500,
      gridSize: 0,
      elements: [
        { id: 'stage-1', type: 'stage', x: 400, y: 50, width: 300, height: 70, rotation: 0, label: 'Keynote Stage' },
        { id: 'rt-1', type: 'table-rect', x: 150, y: 200, width: 100, height: 50, rotation: 0, label: 'Row A', capacity: 6 },
        { id: 'rt-2', type: 'table-rect', x: 350, y: 200, width: 100, height: 50, rotation: 0, label: 'Row B', capacity: 6 },
        { id: 'rt-3', type: 'table-rect', x: 550, y: 200, width: 100, height: 50, rotation: 0, label: 'Row C', capacity: 6 },
        { id: 'rt-4', type: 'table-rect', x: 150, y: 300, width: 100, height: 50, rotation: 0, label: 'Row D', capacity: 6 },
        { id: 'rt-5', type: 'table-rect', x: 350, y: 300, width: 100, height: 50, rotation: 0, label: 'Row E', capacity: 6 },
        { id: 'rt-6', type: 'table-rect', x: 550, y: 300, width: 100, height: 50, rotation: 0, label: 'Row F', capacity: 6 },
        { id: 'bar-1', type: 'bar', x: 700, y: 450, width: 120, height: 25, rotation: 0, label: 'Coffee Station' },
      ],
    };

    return (
      <div className="p-4 max-w-4xl">
        <EventLayoutViewer
          layout={layout}
          onElementClick={(el) => console.log('Clicked:', el)}
        />
      </div>
    );
  },
};
