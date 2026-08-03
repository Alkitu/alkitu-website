'use client';

import * as React from 'react';
import type { PricingZone } from '../types';
import { Input } from '~/components/primitives/input';
import { Label } from '~/components/primitives/label';
import { Card, CardContent } from '~/components/primitives/card';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import { Plus, Trash2 } from 'lucide-react';
import { getZoneColor } from '../utils/seat-state-manager';

// ---------------------------------------------------------------------------
// SeatMapZoneEditor — manage pricing zones and their colors
// ---------------------------------------------------------------------------

export interface SeatMapZoneEditorProps {
  zones: PricingZone[];
  onChange: (zones: PricingZone[]) => void;
  formatPrice?: (price: number) => string;
}

export function SeatMapZoneEditor({
  zones,
  onChange,
  formatPrice = (p) => `$${p}`,
}: SeatMapZoneEditorProps) {
  const updateZone = (index: number, updates: Partial<PricingZone>) => {
    const next = zones.map((z, i) => (i === index ? { ...z, ...updates } : z));
    onChange(next);
  };

  const addZone = () => {
    const id = `zone-${Date.now()}`;
    onChange([...zones, { id, name: `Zone ${zones.length + 1}`, price: 0 }]);
  };

  const removeZone = (index: number) => {
    onChange(zones.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {zones.map((zone, index) => (
        <Card key={zone.id}>
          <CardContent className="flex items-center gap-3 p-3">
            {/* Color swatch */}
            <span
              className="shrink-0 h-8 w-8 rounded-md border border-border"
              style={{ backgroundColor: getZoneColor(zone.id, zones) }}
            />

            <div className="flex-1 grid grid-cols-3 gap-2 items-end">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                  value={zone.name}
                  onChange={(e) => updateZone(index, { name: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Price</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={zone.price}
                  onChange={(e) => updateZone(index, { price: parseFloat(e.target.value) || 0 })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Color (optional)</Label>
                <Input
                  type="color"
                  value={zone.color || '#888888'}
                  onChange={(e) => updateZone(index, { color: e.target.value })}
                  className="h-8 p-1"
                />
              </div>
            </div>

            <Badge variant="outline" className="shrink-0">
              {formatPrice(zone.price)}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeZone(index)}
              disabled={zones.length <= 1}
            >
              <Trash2 size={14} />
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" size="sm" onClick={addZone} className="w-full">
        <Plus size={14} className="mr-1.5" />
        Add Zone
      </Button>
    </div>
  );
}
