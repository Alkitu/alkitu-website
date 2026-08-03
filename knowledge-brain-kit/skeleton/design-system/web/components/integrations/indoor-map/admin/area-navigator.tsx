'use client';

import * as React from 'react';
import type { MapArea } from '../types';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import { ScrollArea } from '~/components/primitives/scroll-area';
import {
  ChevronLeft,
  ChevronRight,
  Link2,
  Link2Off,
  EyeOff,
  CircleDot,
} from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// AreaNavigator — list of detected areas with prev/next arrows and status
// ---------------------------------------------------------------------------

export interface AreaNavigatorProps {
  areas: MapArea[];
  currentAreaId: string | null;
  /** IDs of areas the admin has dismissed (decorations, etc.) */
  ignoredAreaIds: Set<string>;
  onSelectArea: (area: MapArea) => void;
  onIgnoreArea: (areaId: string) => void;
  onRestoreArea: (areaId: string) => void;
  className?: string;
}

export function AreaNavigator({
  areas,
  currentAreaId,
  ignoredAreaIds,
  onSelectArea,
  onIgnoreArea,
  onRestoreArea,
  className,
}: AreaNavigatorProps) {
  // Active areas (not ignored)
  const activeAreas = React.useMemo(
    () => areas.filter((a) => !ignoredAreaIds.has(a.id)),
    [areas, ignoredAreaIds],
  );

  const ignoredAreas = React.useMemo(
    () => areas.filter((a) => ignoredAreaIds.has(a.id)),
    [areas, ignoredAreaIds],
  );

  const currentIndex = activeAreas.findIndex((a) => a.id === currentAreaId);
  const linkedCount = activeAreas.filter((a) => a.data !== null).length;

  // Prev / Next
  const goPrev = () => {
    if (activeAreas.length === 0) return;
    const idx = currentIndex <= 0 ? activeAreas.length - 1 : currentIndex - 1;
    onSelectArea(activeAreas[idx]);
  };

  const goNext = () => {
    if (activeAreas.length === 0) return;
    const idx = currentIndex >= activeAreas.length - 1 ? 0 : currentIndex + 1;
    onSelectArea(activeAreas[idx]);
  };

  // Jump to next unlinked
  const goNextUnlinked = () => {
    const startIdx = currentIndex < 0 ? 0 : currentIndex + 1;
    for (let i = 0; i < activeAreas.length; i++) {
      const idx = (startIdx + i) % activeAreas.length;
      if (!activeAreas[idx].data) {
        onSelectArea(activeAreas[idx]);
        return;
      }
    }
  };

  const listRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to current item
  React.useEffect(() => {
    if (!currentAreaId || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-area-nav="${currentAreaId}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentAreaId]);

  const [showIgnored, setShowIgnored] = React.useState(false);

  return (
    <div className={cn('flex flex-col border border-border rounded-lg bg-card overflow-hidden max-h-[350px]', className)}>
      {/* Header with arrows */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border">
        <Button variant="ghost" size="sm" onClick={goPrev} disabled={activeAreas.length === 0} className="h-7 w-7 p-0">
          <ChevronLeft size={14} />
        </Button>

        <div className="flex-1 text-center text-xs text-muted-foreground">
          {currentIndex >= 0 ? (
            <span>
              <strong>{currentIndex + 1}</strong> / {activeAreas.length}
            </span>
          ) : (
            <span>{activeAreas.length} areas</span>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={goNext} disabled={activeAreas.length === 0} className="h-7 w-7 p-0">
          <ChevronRight size={14} />
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-1.5 px-2 py-1 border-b border-border text-xs">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {linkedCount}/{activeAreas.length} linked
        </Badge>
        {activeAreas.length - linkedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goNextUnlinked}
            className="h-5 text-[10px] px-1.5 ml-auto"
          >
            Next unlinked
          </Button>
        )}
      </div>

      {/* Area list */}
      <ScrollArea className="flex-1 min-h-0 overflow-hidden" ref={listRef}>
        <div className="flex flex-col">
          {activeAreas.map((area, idx) => {
            const isActive = area.id === currentAreaId;
            const isLinked = area.data !== null;
            return (
              <button
                key={area.id}
                data-area-nav={area.id}
                onClick={() => onSelectArea(area)}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 text-left text-xs transition-colors',
                  'hover:bg-accent/50',
                  isActive && 'bg-primary/10 border-l-2 border-primary',
                )}
              >
                {/* Status dot */}
                <span
                  className={cn(
                    'shrink-0 h-2 w-2 rounded-full',
                    isLinked ? 'bg-success' : 'bg-muted-foreground/40',
                  )}
                />

                {/* Label */}
                <span className="flex-1 truncate">
                  {isLinked ? (
                    <span className="font-medium">{area.data!.name}</span>
                  ) : (
                    <span className="text-muted-foreground italic">{area.id}</span>
                  )}
                </span>

                {/* Index */}
                <span className="text-muted-foreground text-[10px] shrink-0">
                  #{idx + 1}
                </span>

                {/* Ignore button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIgnoreArea(area.id);
                  }}
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 shrink-0"
                  title="Ignore this area (decoration)"
                >
                  <EyeOff size={10} />
                </Button>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Ignored section */}
      {ignoredAreas.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setShowIgnored(!showIgnored)}
            className="w-full flex items-center gap-1.5 px-2 py-1 text-[10px] text-muted-foreground hover:bg-accent/30 transition-colors"
          >
            <EyeOff size={10} />
            {ignoredAreas.length} ignored
            <ChevronRight
              size={10}
              className={cn('ml-auto transition-transform', showIgnored && 'rotate-90')}
            />
          </button>
          {showIgnored && (
            <div className="flex flex-col">
              {ignoredAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center gap-2 px-2 py-1 text-[10px] text-muted-foreground/60"
                >
                  <span className="flex-1 truncate">{area.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestoreArea(area.id)}
                    className="h-5 text-[10px] px-1"
                    title="Restore this area"
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
