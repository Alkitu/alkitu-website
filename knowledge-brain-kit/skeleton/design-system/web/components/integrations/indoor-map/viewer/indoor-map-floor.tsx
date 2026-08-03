'use client';

import * as React from 'react';
import type { FloorLevel, MapArea, AreaCategory, PointOfInterest } from '../types';
import { IndoorMapArea } from './indoor-map-area';
import { IndoorMapPoi } from './indoor-map-poi';

// ---------------------------------------------------------------------------
// IndoorMapFloor — renders a single floor's SVG with interactive areas + POIs
// ---------------------------------------------------------------------------

export interface IndoorMapFloorProps {
  floor: FloorLevel;
  categories: AreaCategory[];
  activeFilters: Set<string>;
  selectedAreaId?: string;
  onAreaClick?: (area: MapArea) => void;
  onAreaHoverStart?: (area: MapArea) => void;
  onAreaHoverEnd?: () => void;
  onPoiHover?: (poi: PointOfInterest | null) => void;
  onPoiClick?: (poi: PointOfInterest) => void;
}

export const IndoorMapFloor = React.memo(function IndoorMapFloor({
  floor,
  categories,
  activeFilters,
  selectedAreaId,
  onAreaClick,
  onAreaHoverStart,
  onAreaHoverEnd,
  onPoiHover,
  onPoiClick,
}: IndoorMapFloorProps) {
  const hasActiveFilters = activeFilters.size > 0;

  return (
    <>
      {/* Background elements (walls, corridors, decorations) */}
      {floor.svgContent && (
        <g
          className="pointer-events-none"
          dangerouslySetInnerHTML={{ __html: floor.svgContent }}
          opacity={0.4}
        />
      )}

      {/* Interactive areas */}
      {floor.areas.map((area) => {
        const category = categories.find((c) => c.id === area.data?.categoryId);
        const matchesFilter =
          !hasActiveFilters ||
          (area.data?.categoryId && activeFilters.has(area.data.categoryId));

        return (
          <IndoorMapArea
            key={area.id}
            area={area}
            category={category}
            isSelected={area.id === selectedAreaId}
            isHighlighted={hasActiveFilters && !!matchesFilter}
            isDimmed={hasActiveFilters && !matchesFilter}
            onClick={onAreaClick}
            onHoverStart={onAreaHoverStart}
            onHoverEnd={onAreaHoverEnd}
          />
        );
      })}

      {/* Area labels (rendered on top of areas, below POIs) */}
      {floor.areas
        .filter((a) => a.data?.name)
        .map((area) => {
          const dimmed = hasActiveFilters && !activeFilters.has(area.data?.categoryId ?? '');
          return (
            <text
              key={`label-${area.id}`}
              x={area.centroidX}
              y={area.centroidY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={7}
              fontWeight={600}
              fill="white"
              pointerEvents="none"
              className="select-none"
              opacity={dimmed ? 0.2 : 0.9}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {area.data!.name}
            </text>
          );
        })}

      {/* Points of Interest (topmost layer) */}
      {floor.pois?.map((poi) => (
        <IndoorMapPoi
          key={poi.id}
          poi={poi}
          size={20}
          onHover={onPoiHover}
          onClick={onPoiClick}
        />
      ))}
    </>
  );
});
