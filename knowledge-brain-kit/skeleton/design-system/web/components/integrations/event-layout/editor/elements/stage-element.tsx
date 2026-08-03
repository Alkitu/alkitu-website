'use client';

import * as React from 'react';
import type { LayoutElement } from '../../types';

export interface StageElementProps {
  element: LayoutElement;
  isSelected?: boolean;
}

export const StageElement = React.memo(function StageElement({ element, isSelected }: StageElementProps) {
  const hw = element.width / 2;
  const hh = element.height / 2;

  return (
    <g transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
      {/* Stage platform */}
      <rect
        x={-hw} y={-hh}
        width={element.width} height={element.height}
        rx={6}
        fill="var(--accent)"
        stroke={isSelected ? 'var(--primary)' : 'var(--accent-foreground)'}
        strokeWidth={isSelected ? 2 : 1.5}
        strokeDasharray={isSelected ? undefined : '4 2'}
      />
      {/* Stage label */}
      <text textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600} fill="var(--accent-foreground)" className="select-none" pointerEvents="none">
        {element.label}
      </text>
    </g>
  );
});
