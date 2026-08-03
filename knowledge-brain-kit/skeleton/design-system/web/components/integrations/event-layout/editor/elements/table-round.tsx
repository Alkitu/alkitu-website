'use client';

import * as React from 'react';
import type { LayoutElement } from '../../types';

export interface TableRoundProps {
  element: LayoutElement;
  isSelected?: boolean;
}

export const TableRound = React.memo(function TableRound({ element, isSelected }: TableRoundProps) {
  const r = Math.min(element.width, element.height) / 2;
  const chairR = 5;
  const chairCount = element.capacity ?? 8;

  return (
    <g transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation})`}>
      {/* Table */}
      <circle
        r={r}
        fill="var(--secondary)"
        stroke={isSelected ? 'var(--primary)' : 'var(--border)'}
        strokeWidth={isSelected ? 2 : 1}
      />
      {/* Chairs around the table */}
      {Array.from({ length: chairCount }, (_, i) => {
        const angle = (i / chairCount) * Math.PI * 2 - Math.PI / 2;
        const cx = Math.cos(angle) * (r + chairR + 3);
        const cy = Math.sin(angle) * (r + chairR + 3);
        return (
          <circle key={i} cx={cx} cy={cy} r={chairR} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.5} />
        );
      })}
      {/* Label */}
      <text textAnchor="middle" dominantBaseline="central" fontSize={9} fill="var(--secondary-foreground)" className="select-none" pointerEvents="none">
        {element.label}
      </text>
    </g>
  );
});
