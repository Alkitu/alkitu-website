'use client';

import * as React from 'react';
import { cn } from '~/lib/utils';
import { useViewport } from '../hooks/use-viewport';
import type { ViewportConfig } from '../types';

// ---------------------------------------------------------------------------
// SvgViewport — pannable/zoomable SVG container
// Modeled after MapWrapper (integrations/maps/map-wrapper.tsx)
// ---------------------------------------------------------------------------

export interface SvgViewportProps {
  /** SVG viewBox (e.g. "0 0 800 600"). If omitted, auto-sizing is used. */
  viewBox?: string;
  /** Viewport configuration (zoom limits, initial state) */
  viewportConfig?: ViewportConfig;
  /** Disable pan/zoom interactions (read-only mode) */
  readOnly?: boolean;
  /** Content to render inside the SVG (seats, tables, areas, etc.) */
  children: React.ReactNode;
  /** Additional class names for the outer container */
  className?: string;
  /** SVG width — defaults to "100%" */
  width?: string | number;
  /** SVG height — defaults to "100%" */
  height?: string | number;
  /** Callback exposing the viewport API to parent */
  onViewportReady?: (api: ReturnType<typeof useViewport>) => void;
}

export function SvgViewport({
  viewBox,
  viewportConfig,
  readOnly = false,
  children,
  className,
  width = '100%',
  height = '100%',
  onViewportReady,
}: SvgViewportProps) {
  const viewport = useViewport(viewportConfig);
  const { bind, containerRef, transformMatrix } = viewport;

  // Expose viewport API to parent on mount
  React.useEffect(() => {
    onViewportReady?.(viewport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gestureHandlers = readOnly ? {} : bind();

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-background select-none',
        !readOnly && 'touch-none cursor-grab active:cursor-grabbing',
        className,
      )}
      style={{ width, height }}
      {...gestureHandlers}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <g transform={readOnly ? undefined : transformMatrix}>{children}</g>
      </svg>
    </div>
  );
}
