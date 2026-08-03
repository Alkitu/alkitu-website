'use client';

import * as React from 'react';
import type { Seat as SeatData, SeatShape, SeatStatus, PricingZone } from '../types';
import { getStateFill } from '../../venue-core/utils/state-colors';
import { getZoneColor } from '../utils/seat-state-manager';

// ---------------------------------------------------------------------------
// Seat — individual SVG seat element (<rect> or <circle>)
// ---------------------------------------------------------------------------

export interface SeatProps {
  seat: SeatData;
  shape: SeatShape;
  size: number;
  zones?: PricingZone[];
  isSelected?: boolean;
  onSelect?: (seatId: string, event: React.MouseEvent) => void;
  onHover?: (seat: SeatData | null) => void;
  showLabel?: boolean;
}

export const SeatElement = React.memo(function SeatElement({
  seat,
  shape,
  size,
  zones = [],
  isSelected,
  onSelect,
  onHover,
  showLabel,
}: SeatProps) {
  const status: SeatStatus = isSelected ? 'selected' : seat.status;
  const isInteractive = status === 'available' || status === 'selected';

  // Use zone color for available seats, state tokens for everything else
  const zoneColor = status === 'available' ? getZoneColor(seat.zoneId, zones) : undefined;
  const stateStyle = getStateFill(status);
  const fillColor = zoneColor ?? stateStyle.fill;

  const handleClick = (e: React.MouseEvent) => {
    if (isInteractive && onSelect) {
      onSelect(seat.id, e);
    }
  };

  const commonProps: React.SVGAttributes<SVGElement> = {
    style: {
      fill: fillColor,
      stroke: isSelected ? 'var(--primary)' : stateStyle.stroke,
      strokeWidth: isSelected ? 2 : 0.5,
      cursor: isInteractive ? 'pointer' : seat.status === 'occupied' ? 'not-allowed' : 'default',
      transition: 'fill 0.15s ease, stroke 0.15s ease',
    },
    onClick: handleClick,
    onMouseEnter: () => onHover?.(seat),
    onMouseLeave: () => onHover?.(null),
    role: isInteractive ? 'button' : undefined,
    tabIndex: isInteractive ? 0 : undefined,
    'aria-label': `Seat ${seat.label}${status === 'occupied' ? ' (occupied)' : status === 'selected' ? ' (selected)' : ''}`,
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && isInteractive && onSelect) {
        e.preventDefault();
        onSelect(seat.id, e as unknown as React.MouseEvent);
      }
    },
  };

  const half = size / 2;
  const radius = Math.min(size * 0.15, 3);

  return (
    <g>
      {shape === 'circle' ? (
        <circle cx={seat.x + half} cy={seat.y + half} r={half} {...commonProps} />
      ) : (
        <rect x={seat.x} y={seat.y} width={size} height={size} rx={radius} ry={radius} {...commonProps} />
      )}
      {showLabel && (
        <text
          x={seat.x + half}
          y={seat.y + half}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.4}
          fill={stateStyle.color}
          pointerEvents="none"
          className="select-none"
        >
          {seat.column}
        </text>
      )}
    </g>
  );
});
