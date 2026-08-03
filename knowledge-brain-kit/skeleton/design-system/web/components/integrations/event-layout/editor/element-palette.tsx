'use client';

import * as React from 'react';
import type { ElementType } from '../types';
import { ELEMENT_TYPES } from '../types';
import { Button } from '~/components/primitives/button';
import { ScrollArea } from '~/components/primitives/scroll-area';
import { Circle, Square, Armchair, Presentation, Wine, Crown } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// ElementPalette — sidebar with draggable element types
// ---------------------------------------------------------------------------

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  circle: Circle,
  square: Square,
  armchair: Armchair,
  presentation: Presentation,
  wine: Wine,
  crown: Crown,
};

export interface ElementPaletteProps {
  onAddElement: (type: ElementType) => void;
  className?: string;
}

export function ElementPalette({ onAddElement, className }: ElementPaletteProps) {
  return (
    <div className={cn('w-48 border-r border-border bg-card p-3', className)}>
      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        Elements
      </p>
      <ScrollArea className="h-full">
        <div className="space-y-1">
          {ELEMENT_TYPES.map((info) => {
            const Icon = ICONS[info.icon] ?? Square;
            return (
              <Button
                key={info.type}
                variant="ghost"
                size="sm"
                onClick={() => onAddElement(info.type)}
                className="w-full justify-start gap-2"
              >
                <Icon size={14} />
                <span className="text-xs">{info.label}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
