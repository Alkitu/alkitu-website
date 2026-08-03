'use client';

import * as React from 'react';
import type { LayoutElement } from '../../types';

export interface TableRectProps {
  element: LayoutElement;
  isSelected?: boolean;
}

export const TableRect = React.memo(function TableRect({ element, isSelected }: TableRectProps) {
  const hw = element.width / 2;
  const hh = element.height / 2;
  const chairR = 5;
  const capacity = element.capacity ?? 6;
  const longSideChairs = Math.ceil(capacity / 2);

  return (
    <g transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
      {/* Table */}
      <rect
        x={-hw} y={-hh}
        width={element.width} height={element.height}
        rx={4}
        fill="var(--secondary)"
        stroke={isSelected ? 'var(--primary)' : 'var(--border)'}
        strokeWidth={isSelected ? 2 : 1}
      />
      {/* Chairs along long sides */}
      {Array.from({ length: longSideChairs }, (_, i) => {
        const frac = (i + 0.5) / longSideChairs;
        const cx = -hw + frac * element.width;
        return (
          <React.Fragment key={`pair-${i}`}>
            <circle cx={cx} cy={-hh - chairR - 3} r={chairR} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.5} />
            {i < capacity - longSideChairs && (
              <circle cx={cx} cy={hh + chairR + 3} r={chairR} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.5} />
            )}
          </React.Fragment>
        );
      })}
      {/* Label */}
      <text textAnchor="middle" dominantBaseline="central" fontSize={9} fill="var(--secondary-foreground)" className="select-none" pointerEvents="none">
        {element.label}
      </text>
    </g>
  );
});
