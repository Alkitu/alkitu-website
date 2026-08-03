'use client';

import * as React from 'react';
import type { LayoutElement } from '../../types';

export interface ChairElementProps {
  element: LayoutElement;
  isSelected?: boolean;
}

export const ChairElement = React.memo(function ChairElement({ element, isSelected }: ChairElementProps) {
  const size = Math.min(element.width, element.height);
  const half = size / 2;

  return (
    <g transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
      {/* Chair seat */}
      <rect
        x={-half} y={-half}
        width={size} height={size}
        rx={size * 0.25}
        fill="var(--muted)"
        stroke={isSelected ? 'var(--primary)' : 'var(--border)'}
        strokeWidth={isSelected ? 2 : 0.8}
      />
      {/* Chair back */}
      <rect
        x={-half} y={-half - 4}
        width={size} height={4}
        rx={2}
        fill="var(--muted-foreground)"
        opacity={0.5}
      />
    </g>
  );
});
