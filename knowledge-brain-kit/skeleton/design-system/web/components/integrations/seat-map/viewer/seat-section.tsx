'use client';

import * as React from 'react';
import type { SeatSection as SeatSectionData, SeatShape, PricingZone, Seat as SeatData } from '../types';
import { SeatRowComponent } from './seat-row';

// ---------------------------------------------------------------------------
// SeatSection — renders a named section of seat rows
// ---------------------------------------------------------------------------

export interface SeatSectionProps {
  section: SeatSectionData;
  shape: SeatShape;
  seatSize: number;
  zones?: PricingZone[];
  selectedIds: Set<string>;
  onSelect?: (seatId: string, event: React.MouseEvent) => void;
  onHover?: (seat: SeatData | null) => void;
  showRowLabels?: boolean;
  showSeatNumbers?: boolean;
  showSectionTitle?: boolean;
}

export const SeatSectionComponent = React.memo(function SeatSectionComponent({
  section,
  shape,
  seatSize,
  zones = [],
  selectedIds,
  onSelect,
  onHover,
  showRowLabels = true,
  showSeatNumbers = false,
  showSectionTitle = true,
}: SeatSectionProps) {
  // Section title position: centered above the section
  const firstRow = section.rows[0];
  const lastSeatInFirstRow = firstRow?.seats[firstRow.seats.length - 1];
  const firstSeatInFirstRow = firstRow?.seats[0];

  const titleX =
    firstSeatInFirstRow && lastSeatInFirstRow
      ? (firstSeatInFirstRow.x + lastSeatInFirstRow.x + seatSize) / 2
      : section.config.offsetX;
  const titleY = firstSeatInFirstRow ? firstSeatInFirstRow.y - seatSize * 1.8 : section.config.offsetY;

  return (
    <g data-section={section.id}>
      {showSectionTitle && (
        <text
          x={titleX}
          y={titleY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={seatSize * 0.8}
          fontWeight={600}
          fill="var(--foreground)"
          className="select-none"
          pointerEvents="none"
        >
          {section.name}
        </text>
      )}
      {section.rows.map((row) => (
        <SeatRowComponent
          key={row.id}
          row={row}
          shape={shape}
          seatSize={seatSize}
          zones={zones}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onHover={onHover}
          showRowLabel={showRowLabels}
          showSeatNumbers={showSeatNumbers}
        />
      ))}
    </g>
  );
});
