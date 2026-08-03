'use client';

import * as React from 'react';
import type { FloorLevel } from '../types';
import { SvgImporter } from './svg-importer';
import { Card, CardContent } from '~/components/primitives/card';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import { Trash2, ArrowUp, ArrowDown, Layers } from 'lucide-react';

// ---------------------------------------------------------------------------
// FloorManager — manage multiple floor levels
// ---------------------------------------------------------------------------

export interface FloorManagerProps {
  floors: FloorLevel[];
  onChange: (floors: FloorLevel[]) => void;
}

export function FloorManager({ floors, onChange }: FloorManagerProps) {
  const [showImporter, setShowImporter] = React.useState(floors.length === 0);

  const sortedFloors = [...floors].sort((a, b) => a.order - b.order);

  const handleImport = (floor: FloorLevel) => {
    onChange([...floors, floor]);
    setShowImporter(false);
  };

  const removeFloor = (floorId: string) => {
    onChange(floors.filter((f) => f.id !== floorId));
  };

  const moveFloor = (floorId: string, direction: 'up' | 'down') => {
    const sorted = [...floors].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((f) => f.id === floorId);
    if (idx < 0) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    // Swap orders
    const tempOrder = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: tempOrder };

    onChange(sorted);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} />
          <span className="font-medium text-sm">Floors</span>
          <Badge variant="outline">{floors.length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowImporter(true)}>
          Add Floor
        </Button>
      </div>

      {/* Floor list */}
      {sortedFloors.map((floor, idx) => (
        <Card key={floor.id}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveFloor(floor.id, 'up')}
                disabled={idx === 0}
                className="h-5 w-5 p-0"
              >
                <ArrowUp size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveFloor(floor.id, 'down')}
                disabled={idx === sortedFloors.length - 1}
                className="h-5 w-5 p-0"
              >
                <ArrowDown size={12} />
              </Button>
            </div>

            <div className="flex-1">
              <p className="font-medium text-sm">{floor.name}</p>
              <p className="text-xs text-muted-foreground">
                {floor.areas.length} areas &middot; {floor.areas.filter((a) => a.data).length} linked
              </p>
            </div>

            <Badge variant="outline" className="text-xs">
              Level {floor.order}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFloor(floor.id)}
            >
              <Trash2 size={14} />
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* SVG Importer */}
      {showImporter && (
        <SvgImporter
          onImport={handleImport}
          floorOrder={floors.length}
          floorName={`Floor ${floors.length + 1}`}
        />
      )}
    </div>
  );
}
