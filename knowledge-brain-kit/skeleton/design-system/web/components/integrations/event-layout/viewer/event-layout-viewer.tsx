'use client';

import * as React from 'react';
import type { EventLayout, LayoutElement } from '../types';
import type { ViewportConfig } from '../../venue-core/types';
import { useViewport } from '../../venue-core/hooks/use-viewport';
import { SvgViewport } from '../../venue-core/svg/svg-viewport';
import { SvgControls } from '../../venue-core/svg/svg-controls';
import { EventLayoutLegend } from './event-layout-legend';
import { TableRound } from '../editor/elements/table-round';
import { TableRect } from '../editor/elements/table-rect';
import { ChairElement } from '../editor/elements/chair-element';
import { StageElement } from '../editor/elements/stage-element';
import { BarElement } from '../editor/elements/bar-element';
import { VipZoneElement } from '../editor/elements/vip-zone-element';
import { Tooltip } from '~/components/primitives/tooltip';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// EventLayoutViewer — read-only renderer for event layouts
// ---------------------------------------------------------------------------

export interface EventLayoutViewerProps {
  layout: EventLayout;
  /** Callback when an element is clicked */
  onElementClick?: (element: LayoutElement) => void;
  /** Show the legend */
  showLegend?: boolean;
  /** Viewport configuration */
  viewportConfig?: ViewportConfig;
  className?: string;
}

function renderElement(element: LayoutElement) {
  const props = { element, isSelected: false };
  switch (element.type) {
    case 'table-round': return <TableRound {...props} />;
    case 'table-rect':  return <TableRect {...props} />;
    case 'chair':       return <ChairElement {...props} />;
    case 'stage':       return <StageElement {...props} />;
    case 'bar':         return <BarElement {...props} />;
    case 'vip-zone':    return <VipZoneElement {...props} />;
  }
}

export function EventLayoutViewer({
  layout,
  onElementClick,
  showLegend = true,
  viewportConfig,
  className,
}: EventLayoutViewerProps) {
  const viewport = useViewport(viewportConfig);
  const [hoveredElement, setHoveredElement] = React.useState<LayoutElement | null>(null);

  const viewBox = `0 0 ${layout.canvasWidth} ${layout.canvasHeight}`;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative">
        <SvgViewport
          viewBox={viewBox}
          viewportConfig={viewportConfig}
          readOnly
          className="min-h-[300px] aspect-video"
        >
          {/* Canvas background */}
          <rect
            width={layout.canvasWidth}
            height={layout.canvasHeight}
            fill="var(--background)"
            stroke="var(--border)"
            strokeWidth={1}
          />

          {/* Elements */}
          {layout.elements.map((element) => (
            <g
              key={element.id}
              style={{ cursor: onElementClick ? 'pointer' : 'default' }}
              onClick={() => onElementClick?.(element)}
              onMouseEnter={() => setHoveredElement(element)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {renderElement(element)}
            </g>
          ))}
        </SvgViewport>

        {/* Controls */}
        <SvgControls
          onZoomIn={viewport.zoomIn}
          onZoomOut={viewport.zoomOut}
          onReset={viewport.resetView}
          zoom={viewport.state.zoom}
          position="bottom-right"
        />

        {/* Hover tooltip */}
        {hoveredElement && (
          <div
            className="absolute z-20 pointer-events-none bg-popover text-popover-foreground border border-border rounded-md shadow-md px-3 py-1.5 text-xs"
            style={{ left: '50%', bottom: 8, transform: 'translateX(-50%)' }}
          >
            <span className="font-medium">{hoveredElement.label}</span>
            {hoveredElement.capacity !== undefined && (
              <span className="text-muted-foreground ml-2">(cap: {hoveredElement.capacity})</span>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <EventLayoutLegend className="bg-card border border-border rounded-lg" />
      )}
    </div>
  );
}
