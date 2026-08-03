'use client';

import * as React from 'react';
import type { IndoorMapConfig, MapArea } from '../types';
import type { ViewportConfig } from '../../venue-core/types';
import { useViewport } from '../../venue-core/hooks/use-viewport';
import { SvgViewport } from '../../venue-core/svg/svg-viewport';
import { SvgControls } from '../../venue-core/svg/svg-controls';
import { IndoorMapFloor } from './indoor-map-floor';
import { IndoorMapTooltip } from './indoor-map-tooltip';
import { IndoorMapFilters } from './indoor-map-filters';
import { IndoorMapSearch } from './indoor-map-search';
import { Tabs, TabsList, TabsTrigger } from '~/components/primitives/tabs';
import { Separator } from '~/components/primitives/separator';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// IndoorMapViewer — public navigable indoor map
// ---------------------------------------------------------------------------

export interface IndoorMapViewerProps {
  config: IndoorMapConfig;
  /** Callback when an area is clicked */
  onAreaClick?: (area: MapArea) => void;
  /** Show filters panel */
  showFilters?: boolean;
  /** Show search */
  showSearch?: boolean;
  /** Viewport configuration */
  viewportConfig?: ViewportConfig;
  /** Read-only mode (no interactions) */
  readOnly?: boolean;
  className?: string;
}

export function IndoorMapViewer({
  config,
  onAreaClick,
  showFilters = true,
  showSearch = true,
  viewportConfig,
  readOnly = false,
  className,
}: IndoorMapViewerProps) {
  const [currentFloorId, setCurrentFloorId] = React.useState(
    config.floors[0]?.id ?? '',
  );
  const [hoveredArea, setHoveredArea] = React.useState<MapArea | null>(null);
  const [selectedAreaId, setSelectedAreaId] = React.useState<string>();
  const [activeFilters, setActiveFilters] = React.useState<Set<string>>(new Set());

  const viewport = useViewport(viewportConfig);

  const currentFloor = config.floors.find((f) => f.id === currentFloorId);
  const allAreas = currentFloor?.areas ?? [];

  const handleAreaClick = (area: MapArea) => {
    setSelectedAreaId(area.id);
    onAreaClick?.(area);
  };

  const handleSearchSelect = (area: MapArea) => {
    // Find which floor this area is on
    for (const floor of config.floors) {
      const found = floor.areas.find((a) => a.id === area.id);
      if (found) {
        setCurrentFloorId(floor.id);
        setSelectedAreaId(area.id);
        onAreaClick?.(area);
        break;
      }
    }
  };

  const allAreasAcrossFloors = React.useMemo(
    () => config.floors.flatMap((f) => f.areas),
    [config.floors],
  );

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Left sidebar: filters + search */}
      {(showFilters || showSearch) && (
        <div className="w-56 shrink-0 space-y-3">
          {showSearch && (
            <IndoorMapSearch
              areas={allAreasAcrossFloors}
              onSelect={handleSearchSelect}
            />
          )}

          {showSearch && showFilters && <Separator />}

          {showFilters && config.categories.length > 0 && (
            <IndoorMapFilters
              categories={config.categories}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          )}
        </div>
      )}

      {/* Main map area */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Floor tabs */}
        {config.floors.length > 1 && (
          <Tabs value={currentFloorId} onValueChange={setCurrentFloorId}>
            <TabsList>
              {config.floors
                .sort((a, b) => a.order - b.order)
                .map((floor) => (
                  <TabsTrigger key={floor.id} value={floor.id}>
                    {floor.name}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        )}

        {/* Map viewport */}
        <div className="relative flex-1">
          {currentFloor && (
            <SvgViewport
              viewBox={currentFloor.viewBox}
              viewportConfig={viewportConfig}
              readOnly={readOnly}
              className="min-h-[400px]"
            >
              <IndoorMapFloor
                floor={currentFloor}
                categories={config.categories}
                activeFilters={activeFilters}
                selectedAreaId={selectedAreaId}
                onAreaClick={handleAreaClick}
                onAreaHoverStart={setHoveredArea}
                onAreaHoverEnd={() => setHoveredArea(null)}
              />
            </SvgViewport>
          )}

          {/* Controls */}
          {!readOnly && (
            <SvgControls
              onZoomIn={viewport.zoomIn}
              onZoomOut={viewport.zoomOut}
              onReset={viewport.resetView}
              zoom={viewport.state.zoom}
              position="bottom-right"
            />
          )}

          {/* Tooltip */}
          <IndoorMapTooltip
            area={hoveredArea}
            categories={config.categories}
          />
        </div>
      </div>
    </div>
  );
}
