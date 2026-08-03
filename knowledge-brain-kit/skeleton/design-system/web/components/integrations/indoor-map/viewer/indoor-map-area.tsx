'use client';

import * as React from 'react';
import type { MapArea, AreaCategory } from '../types';

// ---------------------------------------------------------------------------
// IndoorMapArea — a clickable/hoverable area in the floor plan SVG
// ---------------------------------------------------------------------------

export interface IndoorMapAreaProps {
  area: MapArea;
  category?: AreaCategory;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  onClick?: (area: MapArea) => void;
  onHoverStart?: (area: MapArea) => void;
  onHoverEnd?: () => void;
}

export const IndoorMapArea = React.memo(function IndoorMapArea({
  area,
  category,
  isHighlighted = false,
  isSelected = false,
  isDimmed = false,
  onClick,
  onHoverStart,
  onHoverEnd,
}: IndoorMapAreaProps) {
  const isLinked = area.data !== null;
  const isInteractive = area.status !== 'disabled';

  // Determine fill color
  const baseFill = category?.color ?? (isLinked ? 'var(--primary)' : 'var(--muted)');
  const fillOpacity = isDimmed ? 0.15 : isHighlighted ? 0.5 : isLinked ? 0.3 : 0.1;
  const strokeColor = isSelected
    ? 'var(--primary)'
    : isHighlighted
      ? 'var(--primary)'
      : 'var(--border)';
  const strokeWidth = isSelected ? 2.5 : isHighlighted ? 1.5 : 0.8;

  // Reconstruct the SVG element from stored attributes
  const { svgTag, svgAttributes } = area;

  const commonProps: React.SVGAttributes<SVGElement> = {
    ...svgAttributes,
    style: {
      fill: baseFill,
      fillOpacity,
      stroke: strokeColor,
      strokeWidth,
      cursor: isInteractive ? 'pointer' : 'default',
      transition: 'fill-opacity 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease',
    },
    onClick: isInteractive ? () => onClick?.(area) : undefined,
    onMouseEnter: isInteractive ? () => onHoverStart?.(area) : undefined,
    onMouseLeave: isInteractive ? () => onHoverEnd?.() : undefined,
    role: isInteractive ? 'button' : undefined,
    tabIndex: isInteractive ? 0 : undefined,
    'aria-label': area.data?.name ?? area.id,
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && isInteractive) {
        e.preventDefault();
        onClick?.(area);
      }
    },
  };

  // Render the appropriate SVG element
  return React.createElement(svgTag, {
    key: area.id,
    'data-area-id': area.id,
    ...commonProps,
  });
});
