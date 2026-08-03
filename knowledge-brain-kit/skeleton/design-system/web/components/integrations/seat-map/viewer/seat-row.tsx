'use client';

import * as React from 'react';
import type { SeatRow as SeatRowData, SeatShape, PricingZone, Seat as SeatData } from '../types';
import { SeatElement } from './seat';

// ---------------------------------------------------------------------------
// SeatRow — renders a row of seats with an optional label
// ---------------------------------------------------------------------------

export interface SeatRowProps {
  row: SeatRowData;
  shape: SeatShape;
  seatSize: number;
  zones?: PricingZone[];
  selectedIds: Set<string>;
  onSelect?: (seatId: string, event: React.MouseEvent) => void;
  onHover?: (seat: SeatData | null) => void;
  showRowLabel?: boolean;
  showSeatNumbers?: boolean;
}

export const SeatRowComponent = React.memo(function SeatRowComponent({
  row,
  shape,
  seatSize,
  zones = [],
  selectedIds,
  onSelect,
  onHover,
  showRowLabel = true,
  showSeatNumbers = false,
}: SeatRowProps) {
  // Calculate row label position (left of first seat)
  const firstSeat = row.seats[0];
  const labelX = firstSeat ? firstSeat.x - seatSize * 1.5 : 0;
  const labelY = firstSeat ? firstSeat.y + seatSize / 2 : 0;

  return (
    <g data-row={row.label}>
      {showRowLabel && firstSeat && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={seatSize * 0.65}
          fill="var(--muted-foreground)"
          className="select-none"
          pointerEvents="none"
        >
          {row.label}
        </text>
      )}
      {row.seats.map((seat) => (
        <SeatElement
          key={seat.id}
          seat={seat}
          shape={shape}
          size={seatSize}
          zones={zones}
          isSelected={selectedIds.has(seat.id)}
          onSelect={onSelect}
          onHover={onHover}
          showLabel={showSeatNumbers}
        />
      ))}
    </g>
  );
});
