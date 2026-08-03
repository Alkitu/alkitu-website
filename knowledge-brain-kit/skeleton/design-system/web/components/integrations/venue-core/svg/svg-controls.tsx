'use client';

import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// SvgControls — floating zoom/pan controls for SVG viewports
// Modeled after MapControlsPanel (integrations/maps/map-controls-panel.tsx)
// ---------------------------------------------------------------------------

export interface SvgControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitContent?: () => void;
  /** Position of the controls panel */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Current zoom level (for display) */
  zoom?: number;
  className?: string;
}

const positionClasses = {
  'top-left': 'top-3 left-3',
  'top-right': 'top-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'bottom-right': 'bottom-3 right-3',
};

export function SvgControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onFitContent,
  position = 'bottom-right',
  zoom,
  className,
}: SvgControlsProps) {
  const controls = [
    { label: 'Zoom In', icon: ZoomIn, action: onZoomIn },
    { label: 'Zoom Out', icon: ZoomOut, action: onZoomOut },
    ...(onFitContent ? [{ label: 'Fit Content', icon: Maximize2, action: onFitContent }] : []),
    { label: 'Reset View', icon: RotateCcw, action: onReset },
  ];

  return (
    <div className={cn('absolute z-10 flex flex-col gap-1', positionClasses[position], className)}>
      <div className="bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-1 flex flex-col gap-0.5">
        {controls.map((ctrl) => (
          <Button
            key={ctrl.label}
            variant="ghost"
            size="sm"
            onClick={ctrl.action}
            iconLeft={<ctrl.icon size={15} />}
            aria-label={ctrl.label}
            className="justify-start min-w-[130px]"
          >
            {ctrl.label}
          </Button>
        ))}
        {zoom !== undefined && (
          <div className="text-center text-xs text-muted-foreground py-1 border-t border-border mt-0.5">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}
