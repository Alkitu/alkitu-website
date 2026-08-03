'use client';

import { ELEMENT_TYPES } from '../types';
import { Circle, Square, Armchair, Presentation, Wine, Crown } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// EventLayoutLegend — legend showing element type icons and labels
// ---------------------------------------------------------------------------

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  circle: Circle,
  square: Square,
  armchair: Armchair,
  presentation: Presentation,
  wine: Wine,
  crown: Crown,
};

export interface EventLayoutLegendProps {
  className?: string;
}

export function EventLayoutLegend({ className }: EventLayoutLegendProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-4 px-3 py-2 text-sm', className)}>
      {ELEMENT_TYPES.map((info) => {
        const Icon = ICONS[info.icon] ?? Square;
        return (
          <div key={info.type} className="flex items-center gap-1.5">
            <Icon size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{info.label}</span>
          </div>
        );
      })}
    </div>
  );
}
