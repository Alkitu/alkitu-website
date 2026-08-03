'use client';

import * as React from 'react';
import type { LayoutElement } from '../../types';

export interface BarElementProps {
  element: LayoutElement;
  isSelected?: boolean;
}

export const BarElement = React.memo(function BarElement({ element, isSelected }: BarElementProps) {
  const hw = element.width / 2;
  const hh = element.height / 2;
  const stoolR = 4;
  const stoolCount = Math.max(3, Math.floor(element.width / 20));

  return (
    <g transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
      {/* Counter */}
      <rect
        x={-hw} y={-hh}
        width={element.width} height={element.height}
        rx={element.height / 2}
        fill="var(--secondary)"
        stroke={isSelected ? 'var(--primary)' : 'var(--border)'}
        strokeWidth={isSelected ? 2 : 1}
      />
      {/* Bar stools along front */}
      {Array.from({ length: stoolCount }, (_, i) => {
        const frac = (i + 0.5) / stoolCount;
        const cx = -hw + frac * element.width;
        return (
          <circle key={i} cx={cx} cy={hh + stoolR + 4} r={stoolR} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.5} />
        );
      })}
      {/* Label */}
      <text textAnchor="middle" dominantBaseline="central" fontSize={8} fill="var(--secondary-foreground)" className="select-none" pointerEvents="none">
        {element.label}
      </text>
    </g>
  );
});
