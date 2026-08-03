'use client';

import * as React from 'react';
import type { PointOfInterest, PoiType } from '../types';

// ---------------------------------------------------------------------------
// IndoorMapPoi — SVG pin icons for points of interest
// ---------------------------------------------------------------------------

/** Default emoji/symbol for each POI type */
const POI_ICONS: Record<PoiType, string> = {
  restroom: '🚻',
  elevator: '🛗',
  stairs: '🪜',
  escalator: '↗',
  exit: '🚪',
  info: 'ℹ️',
  atm: '🏧',
  parking: '🅿️',
  'food-court': '🍽️',
  custom: '📍',
};

const POI_COLORS: Record<PoiType, string> = {
  restroom: '#3b82f6',
  elevator: '#8b5cf6',
  stairs: '#f97316',
  escalator: '#f97316',
  exit: '#ef4444',
  info: '#06b6d4',
  atm: '#22c55e',
  parking: '#6366f1',
  'food-court': '#eab308',
  custom: '#6b7280',
};

export interface IndoorMapPoiProps {
  poi: PointOfInterest;
  size?: number;
  onHover?: (poi: PointOfInterest | null) => void;
  onClick?: (poi: PointOfInterest) => void;
}

export const IndoorMapPoi = React.memo(function IndoorMapPoi({
  poi,
  size = 24,
  onHover,
  onClick,
}: IndoorMapPoiProps) {
  const icon = poi.icon ?? POI_ICONS[poi.type];
  const color = POI_COLORS[poi.type];
  const half = size / 2;

  return (
    <g
      transform={`translate(${poi.x}, ${poi.y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover?.(poi)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(poi)}
    >
      {/* Pin drop shadow */}
      <ellipse cx={0} cy={2} rx={half * 0.5} ry={3} fill="black" opacity={0.2} />

      {/* Pin body */}
      <circle
        cx={0}
        cy={-half}
        r={half}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />

      {/* Pin pointer */}
      <path
        d={`M${-half * 0.4},${-4} L0,${2} L${half * 0.4},${-4}`}
        fill={color}
      />

      {/* Icon */}
      <text
        x={0}
        y={-half}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.5}
        className="select-none"
        pointerEvents="none"
      >
        {icon}
      </text>

      {/* Label below pin */}
      {poi.label && (
        <text
          x={0}
          y={half * 0.6}
          textAnchor="middle"
          dominantBaseline="hanging"
          fontSize={7}
          fontWeight={500}
          fill="var(--foreground)"
          className="select-none"
          pointerEvents="none"
        >
          {poi.label}
        </text>
      )}
    </g>
  );
});

/** Legend for POI types */
export const POI_TYPE_INFO: Record<PoiType, { label: string; icon: string; color: string }> = {
  restroom: { label: 'Restroom', icon: POI_ICONS.restroom, color: POI_COLORS.restroom },
  elevator: { label: 'Elevator', icon: POI_ICONS.elevator, color: POI_COLORS.elevator },
  stairs: { label: 'Stairs', icon: POI_ICONS.stairs, color: POI_COLORS.stairs },
  escalator: { label: 'Escalator', icon: POI_ICONS.escalator, color: POI_COLORS.escalator },
  exit: { label: 'Exit', icon: POI_ICONS.exit, color: POI_COLORS.exit },
  info: { label: 'Information', icon: POI_ICONS.info, color: POI_COLORS.info },
  atm: { label: 'ATM', icon: POI_ICONS.atm, color: POI_COLORS.atm },
  parking: { label: 'Parking', icon: POI_ICONS.parking, color: POI_COLORS.parking },
  'food-court': { label: 'Food Court', icon: POI_ICONS['food-court'], color: POI_COLORS['food-court'] },
  custom: { label: 'Custom', icon: POI_ICONS.custom, color: POI_COLORS.custom },
};
