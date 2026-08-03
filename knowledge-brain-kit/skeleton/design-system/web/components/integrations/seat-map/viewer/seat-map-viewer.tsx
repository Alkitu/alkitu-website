'use client';

import * as React from 'react';
import type { SeatMapData, Seat as SeatData, OnSeatSelect } from '../types';
import type { ViewportConfig } from '../../venue-core/types';
import { useSelection } from '../../venue-core/hooks/use-selection';
import { useViewport } from '../../venue-core/hooks/use-viewport';
import { SvgViewport } from '../../venue-core/svg/svg-viewport';
import { SvgControls } from '../../venue-core/svg/svg-controls';
import { SvgGrid } from '../../venue-core/svg/svg-grid';
import { SeatSectionComponent } from './seat-section';
import { SeatLegend } from './seat-legend';
import { applySeatSelection } from '../utils/seat-state-manager';
import { computeSeatMapBounds } from '../utils/seat-layout-engine';
import { Tooltip } from '~/components/primitives/tooltip';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// SeatMapViewer — public seat selection interface
// ---------------------------------------------------------------------------

export interface SeatMapViewerProps {
  /** Complete seat map data (config + generated sections) */
  data: SeatMapData;
  /** Pre-occupied seat IDs */
  occupiedSeatIds?: Set<string>;
  /** Callback when selection changes */
  onSelectionChange?: OnSeatSelect;
  /** Maximum seats a user can select */
  maxSelection?: number;
  /** Read-only mode (no selection) */
  readOnly?: boolean;
  /** Show the grid overlay */
  showGrid?: boolean;
  /** Viewport configuration */
  viewportConfig?: ViewportConfig;
  /** Format price for the legend */
  formatPrice?: (price: number) => string;
  className?: string;
}

export function SeatMapViewer({
  data,
  occupiedSeatIds,
  onSelectionChange,
  maxSelection,
  readOnly = false,
  showGrid = false,
  viewportConfig,
  formatPrice,
  className,
}: SeatMapViewerProps) {
  const { config, sections, zoneAssignments: _zoneAssignments } = data;
  const [hoveredSeat, setHoveredSeat] = React.useState<SeatData | null>(null);

  const selection = useSelection({
    mode: maxSelection === 1 ? 'single' : 'multiple',
    maxSelection,
  });

  const viewport = useViewport(viewportConfig);

  // Notify parent on selection change
  React.useEffect(() => {
    onSelectionChange?.(Array.from(selection.selected));
  }, [selection.selected, onSelectionChange]);

  // Compute viewBox from seat bounds
  const bounds = React.useMemo(() => computeSeatMapBounds(sections), [sections]);
  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`;

  // Apply selection overlay to sections
  const displaySections = React.useMemo(
    () => applySeatSelection(sections, selection.selected),
    [sections, selection.selected],
  );

  const handleSeatSelect = React.useCallback(
    (seatId: string, event: React.MouseEvent) => {
      if (readOnly) return;
      selection.toggle(seatId, event);
    },
    [readOnly, selection],
  );

  const handleFitContent = React.useCallback(() => {
    viewport.fitToContent({
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.width,
      height: bounds.height,
    });
  }, [viewport, bounds]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative">
        <SvgViewport
          viewBox={viewBox}
          viewportConfig={viewportConfig}
          readOnly={readOnly}
          className="min-h-[300px] aspect-video"
          onViewportReady={() => {
            // Auto-fit on mount
            handleFitContent();
          }}
        >
          {showGrid && <SvgGrid size={config.seatSize + config.seatGap} />}

          {/* Stage / Screen indicator */}
          <rect
            x={bounds.minX + 20}
            y={bounds.minY + 5}
            width={bounds.width - 40}
            height={8}
            rx={4}
            fill="var(--muted)"
            opacity={0.6}
          />
          <text
            x={bounds.minX + bounds.width / 2}
            y={bounds.minY + 10}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={6}
            fill="var(--muted-foreground)"
            className="select-none"
          >
            SCREEN
          </text>

          {/* Seat sections */}
          {displaySections.map((section) => (
            <SeatSectionComponent
              key={section.id}
              section={section}
              shape={config.seatShape}
              seatSize={config.seatSize}
              zones={config.zones}
              selectedIds={selection.selected}
              onSelect={handleSeatSelect}
              onHover={setHoveredSeat}
              showRowLabels={config.showRowLabels}
              showSeatNumbers={config.showSeatNumbers}
            />
          ))}
        </SvgViewport>

        {/* Controls */}
        {!readOnly && (
          <SvgControls
            onZoomIn={viewport.zoomIn}
            onZoomOut={viewport.zoomOut}
            onReset={viewport.resetView}
            onFitContent={handleFitContent}
            zoom={viewport.state.zoom}
            position="bottom-right"
          />
        )}

        {/* Hover tooltip */}
        {hoveredSeat && (
          <div
            className="absolute z-20 pointer-events-none bg-popover text-popover-foreground border border-border rounded-md shadow-md px-3 py-1.5 text-xs"
            style={{
              left: '50%',
              bottom: 8,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="font-medium">Seat {hoveredSeat.label}</span>
            {hoveredSeat.zoneId && (
              <span className="text-muted-foreground ml-2">
                ({config.zones.find((z) => z.id === hoveredSeat.zoneId)?.name ?? hoveredSeat.zoneId})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <SeatLegend
        zones={config.zones}
        formatPrice={formatPrice}
        className="bg-card border border-border rounded-lg"
      />

      {/* Selection summary */}
      {!readOnly && selection.selected.size > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <span>
            <strong>{selection.selected.size}</strong> seat{selection.selected.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={selection.clear}
            className="text-primary hover:text-primary/80 underline text-xs"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
