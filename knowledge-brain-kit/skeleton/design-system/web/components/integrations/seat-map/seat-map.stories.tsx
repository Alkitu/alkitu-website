import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SeatMapConfigurator } from './admin/seat-map-configurator';
import { SeatMapViewer } from './viewer/seat-map-viewer';
import { generateSeatMap, createDefaultSeatMapConfig } from './utils/seat-layout-engine';
import { applyOccupiedSeats } from './utils/seat-state-manager';
import type { SeatMapData } from './types';

const meta: Meta = {
  title: 'Integrations/Spatial/Seat Map',
};
export default meta;

// ---------------------------------------------------------------------------
// Admin Configurator
// ---------------------------------------------------------------------------

export const Configurator: StoryObj = {
  render: () => (
    <div className="p-4">
      <SeatMapConfigurator
        onSave={(data) => console.log('Save seat map:', data)}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Public Viewer — Cinema
// ---------------------------------------------------------------------------

export const CinemaViewer: StoryObj = {
  render: () => {
    const config = {
      ...createDefaultSeatMapConfig(),
      name: 'Cinema Hall 1',
      seatShape: 'rect' as const,
      seatSize: 16,
      seatGap: 4,
      sections: [
        {
          id: 'main',
          name: 'Main Floor',
          rows: 12,
          columns: 20,
          aisles: [6, 14],
          curvature: 0.3,
          startRowLabel: 'A',
          offsetX: 50,
          offsetY: 60,
        },
      ],
      zones: [
        { id: 'standard', name: 'Standard', price: 8 },
        { id: 'premium', name: 'Premium', price: 15 },
        { id: 'vip', name: 'VIP', price: 25, color: '#eab308' },
      ],
    };

    const sections = generateSeatMap(config);

    // Simulate some occupied seats
    const occupiedIds = new Set(
      sections.flatMap((s) =>
        s.rows.flatMap((r) =>
          r.seats.filter(() => Math.random() < 0.25).map((seat) => seat.id),
        ),
      ),
    );
    const withOccupied = applyOccupiedSeats(sections, occupiedIds);

    const data: SeatMapData = { config, sections: withOccupied, zoneAssignments: {} };

    return (
      <div className="p-4 max-w-4xl">
        <SeatMapViewer
          data={data}
          maxSelection={6}
          onSelectionChange={(ids) => console.log('Selected:', ids)}
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Public Viewer — Theater with circles
// ---------------------------------------------------------------------------

export const TheaterViewer: StoryObj = {
  render: () => {
    const config = {
      ...createDefaultSeatMapConfig(),
      name: 'Grand Theater',
      seatShape: 'circle' as const,
      seatSize: 14,
      seatGap: 5,
      showSeatNumbers: true,
      sections: [
        {
          id: 'orchestra',
          name: 'Orchestra',
          rows: 15,
          columns: 25,
          aisles: [8, 17],
          curvature: 0.5,
          startRowLabel: 'A',
          offsetX: 40,
          offsetY: 60,
        },
        {
          id: 'balcony',
          name: 'Balcony',
          rows: 5,
          columns: 20,
          aisles: [7, 14],
          curvature: 0.2,
          startRowLabel: 'P',
          offsetX: 80,
          offsetY: 420,
        },
      ],
      zones: [
        { id: 'standard', name: 'Standard', price: 45 },
        { id: 'premium', name: 'Premium', price: 75 },
        { id: 'box', name: 'Box Seats', price: 120, color: '#a855f7' },
      ],
    };

    const sections = generateSeatMap(config);
    const data: SeatMapData = { config, sections, zoneAssignments: {} };

    return (
      <div className="p-4 max-w-5xl">
        <SeatMapViewer
          data={data}
          onSelectionChange={(ids) => console.log('Selected:', ids)}
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Read-only mode
// ---------------------------------------------------------------------------

export const ReadOnly: StoryObj = {
  render: () => {
    const config = createDefaultSeatMapConfig();
    const sections = generateSeatMap(config);
    const data: SeatMapData = { config, sections, zoneAssignments: {} };

    return (
      <div className="p-4 max-w-3xl">
        <SeatMapViewer data={data} readOnly />
      </div>
    );
  },
};
