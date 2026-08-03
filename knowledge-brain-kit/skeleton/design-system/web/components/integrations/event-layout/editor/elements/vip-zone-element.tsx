'use client';

import * as React from 'react';
import type { LayoutElement } from '../../types';

export interface VipZoneElementProps {
  element: LayoutElement;
  isSelected?: boolean;
}

export const VipZoneElement = React.memo(function VipZoneElement({ element, isSelected }: VipZoneElementProps) {
  const hw = element.width / 2;
  const hh = element.height / 2;

  return (
    <g transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
      {/* Zone area */}
      <rect
        x={-hw} y={-hh}
        width={element.width} height={element.height}
        rx={8}
        fill="var(--warning)"
        fillOpacity={0.15}
        stroke={isSelected ? 'var(--primary)' : 'var(--warning)'}
        strokeWidth={isSelected ? 2 : 1.5}
        strokeDasharray="6 3"
      />
      {/* VIP label */}
      <text y={-hh + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--warning)" className="select-none" pointerEvents="none">
        VIP
      </text>
      {/* Name */}
      <text textAnchor="middle" dominantBaseline="central" fontSize={9} fill="var(--foreground)" className="select-none" pointerEvents="none">
        {element.label}
      </text>
      {/* Capacity */}
      {element.capacity && (
        <text y={hh - 10} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)" className="select-none" pointerEvents="none">
          Cap: {element.capacity}
        </text>
      )}
    </g>
  );
});
