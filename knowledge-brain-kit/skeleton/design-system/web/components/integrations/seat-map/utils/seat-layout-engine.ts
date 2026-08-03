import type { Seat, SeatRow, SeatSection, SectionConfig, SeatShape, SeatMapConfig } from '../types';

// ---------------------------------------------------------------------------
// Seat Layout Engine — generates seat coordinates from section configuration
// ---------------------------------------------------------------------------

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Get a row label from an index (0→A, 25→Z, 26→AA, etc.)
 * Handles multi-character startLabel by computing a numeric offset.
 */
function rowLabel(index: number, startLabel: string): string {
  const upper = startLabel.toUpperCase();
  // Convert label like "A"→0, "Z"→25, "AA"→26, "AB"→27
  let startOffset = 0;
  for (let i = 0; i < upper.length; i++) {
    const charIdx = ALPHABET.indexOf(upper[i]);
    if (charIdx < 0) break;
    startOffset = startOffset * 26 + (i === upper.length - 1 ? charIdx : charIdx + 1);
  }
  const absolute = index + startOffset;

  if (absolute < 26) return ALPHABET[absolute];
  const first = ALPHABET[Math.floor(absolute / 26) - 1];
  const second = ALPHABET[absolute % 26];
  return `${first}${second}`;
}

/** Calculate X offset for aisles before a given column. Aisles are sorted internally. */
function aisleOffset(col: number, aisles: number[], aisleWidth: number): number {
  return aisles.filter((a) => a < col).length * aisleWidth;
}

/** Calculate curvature offset for a seat position */
function curvatureOffset(
  col: number,
  totalCols: number,
  curvature: number,
  seatSize: number,
): number {
  if (curvature === 0) return 0;
  const center = (totalCols - 1) / 2;
  const dist = Math.abs(col - center) / center;
  return curvature * seatSize * 2 * (1 - dist * dist);
}

/** Generate a complete section of seats from a config */
export function generateSection(
  config: SectionConfig,
  seatSize: number,
  seatGap: number,
  _seatShape: SeatShape,
): SeatSection {
  const step = seatSize + seatGap;
  const aisleWidth = seatSize * 1.5;
  // Ensure aisles are sorted ascending for correct offset calculation
  const sortedAisles = [...config.aisles].sort((a, b) => a - b);
  const rows: SeatRow[] = [];

  for (let r = 0; r < config.rows; r++) {
    const label = rowLabel(r, config.startRowLabel);
    const seats: Seat[] = [];
    let colIndex = 0;

    for (let c = 0; c < config.columns; c++) {
      // Skip aisle positions (they are gaps, not seats)
      const aislesBefore = aisleOffset(c, sortedAisles, aisleWidth);
      const curveY = curvatureOffset(c, config.columns, config.curvature, seatSize);

      const x = config.offsetX + c * step + aislesBefore;
      const y = config.offsetY + r * step + curveY;

      seats.push({
        id: `${config.id}-${label}${colIndex + 1}`,
        row: label,
        column: colIndex + 1,
        x,
        y,
        status: 'available',
        label: `${label}${colIndex + 1}`,
      });
      colIndex++;
    }

    rows.push({
      id: `${config.id}-row-${label}`,
      label,
      index: r,
      seats,
    });
  }

  return {
    id: config.id,
    name: config.name,
    config,
    rows,
  };
}

/** Generate all sections from a SeatMapConfig */
export function generateSeatMap(config: SeatMapConfig): SeatSection[] {
  return config.sections.map((sectionConfig) =>
    generateSection(sectionConfig, config.seatSize, config.seatGap, config.seatShape),
  );
}

/** Compute the total bounding box of all sections */
export function computeSeatMapBounds(sections: SeatSection[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const section of sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        if (seat.x < minX) minX = seat.x;
        if (seat.y < minY) minY = seat.y;
        if (seat.x > maxX) maxX = seat.x;
        if (seat.y > maxY) maxY = seat.y;
      }
    }
  }

  const seatPadding = 30; // padding around the map edges
  return {
    minX: minX - seatPadding,
    minY: minY - seatPadding,
    maxX: maxX + seatPadding,
    maxY: maxY + seatPadding,
    width: maxX - minX + seatPadding * 2,
    height: maxY - minY + seatPadding * 2,
  };
}

/** Create a default section config */
export function createDefaultSectionConfig(id: string, name: string): SectionConfig {
  return {
    id,
    name,
    rows: 10,
    columns: 15,
    aisles: [5, 10],
    curvature: 0,
    startRowLabel: 'A',
    offsetX: 0,
    offsetY: 0,
  };
}

/** Create a default SeatMapConfig */
export function createDefaultSeatMapConfig(): SeatMapConfig {
  return {
    id: crypto.randomUUID(),
    name: 'New Seat Map',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    sections: [createDefaultSectionConfig('main', 'Main Floor')],
    zones: [
      { id: 'standard', name: 'Standard', price: 10 },
      { id: 'premium', name: 'Premium', price: 20 },
      { id: 'vip', name: 'VIP', price: 35 },
    ],
    seatShape: 'rect',
    seatSize: 16,
    seatGap: 4,
    showRowLabels: true,
    showSeatNumbers: false,
  };
}
