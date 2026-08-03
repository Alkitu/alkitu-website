'use client';

import * as React from 'react';
import type { PointOfInterest, PoiType } from '../types';
import { POI_TYPE_INFO } from '../viewer/indoor-map-poi';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import { ScrollArea } from '~/components/primitives/scroll-area';
import { Trash2, GripVertical, MapPin } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// PoiPlacer — palette to pick POI type + list of placed POIs
// ---------------------------------------------------------------------------

const PLACEABLE_TYPES: PoiType[] = [
  'restroom', 'elevator', 'stairs', 'escalator', 'exit', 'info', 'atm', 'parking', 'food-court',
];

export interface PoiPlacerProps {
  pois: PointOfInterest[];
  /** Currently active POI type for placement (null = not placing) */
  activePlacementType: PoiType | null;
  onStartPlacement: (type: PoiType) => void;
  onCancelPlacement: () => void;
  onRemovePoi: (poiId: string) => void;
  onSelectPoi: (poi: PointOfInterest) => void;
  selectedPoiId?: string;
  className?: string;
}

export function PoiPlacer({
  pois,
  activePlacementType,
  onStartPlacement,
  onCancelPlacement,
  onRemovePoi,
  onSelectPoi,
  selectedPoiId,
  className,
}: PoiPlacerProps) {
  return (
    <div className={cn('flex flex-col border border-border rounded-lg bg-card', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border">
        <MapPin size={14} className="text-muted-foreground" />
        <span className="text-xs font-medium flex-1">Points of Interest</span>
        <Badge variant="outline" className="text-[10px]">{pois.length}</Badge>
      </div>

      {/* Placement palette */}
      <div className="px-2 py-1.5 border-b border-border">
        <p className="text-[10px] text-muted-foreground mb-1.5">
          {activePlacementType
            ? 'Click on the map to place the pin'
            : 'Pick a type, then click on the map'
          }
        </p>
        <div className="flex flex-wrap gap-1">
          {PLACEABLE_TYPES.map((type) => {
            const info = POI_TYPE_INFO[type];
            const isActive = activePlacementType === type;
            return (
              <button
                key={type}
                onClick={() => isActive ? onCancelPlacement() : onStartPlacement(type)}
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary/50 hover:bg-accent/30',
                )}
                title={info.label}
              >
                <span>{info.icon}</span>
                <span className="hidden sm:inline">{info.label}</span>
              </button>
            );
          })}
        </div>
        {activePlacementType && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelPlacement}
            className="w-full mt-1 h-6 text-[10px]"
          >
            Cancel placement
          </Button>
        )}
      </div>

      {/* Placed POIs list */}
      <ScrollArea className="max-h-[200px]">
        {pois.length === 0 ? (
          <p className="text-[10px] text-muted-foreground text-center py-3">No POIs placed yet</p>
        ) : (
          <div className="flex flex-col">
            {pois.map((poi) => {
              const info = POI_TYPE_INFO[poi.type];
              const isSelected = poi.id === selectedPoiId;
              return (
                <div
                  key={poi.id}
                  onClick={() => onSelectPoi(poi)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 text-[11px] cursor-pointer transition-colors',
                    'hover:bg-accent/30',
                    isSelected && 'bg-primary/10 border-l-2 border-primary',
                  )}
                >
                  <span>{info.icon}</span>
                  <span className="flex-1 truncate">
                    {poi.label || info.label}
                  </span>
                  <span className="text-muted-foreground text-[9px]">
                    ({Math.round(poi.x)}, {Math.round(poi.y)})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePoi(poi.id);
                    }}
                    className="h-5 w-5 p-0 shrink-0"
                  >
                    <Trash2 size={10} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
