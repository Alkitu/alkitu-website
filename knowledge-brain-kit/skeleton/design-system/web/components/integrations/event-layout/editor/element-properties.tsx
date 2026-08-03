'use client';

import * as React from 'react';
import type { LayoutElement } from '../types';
import { Input } from '~/components/primitives/input';
import { Label } from '~/components/primitives/label';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/primitives/card';
import { Button } from '~/components/primitives/button';
import { Switch } from '~/components/primitives/switch';
import { Slider } from '~/components/primitives/slider';
import { Trash2, Copy, Settings2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// ElementProperties — property panel for the selected element
// ---------------------------------------------------------------------------

export interface ElementPropertiesProps {
  element: LayoutElement | null;
  onChange: (updated: LayoutElement) => void;
  onDuplicate: (elementId: string) => void;
  onDelete: (elementId: string) => void;
}

export function ElementProperties({
  element,
  onChange,
  onDuplicate,
  onDelete,
}: ElementPropertiesProps) {
  if (!element) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[200px]">
        <CardContent className="text-center text-muted-foreground">
          <Settings2 size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an element to edit properties</p>
        </CardContent>
      </Card>
    );
  }

  const update = <K extends keyof LayoutElement>(key: K, value: LayoutElement[K]) => {
    onChange({ ...element, [key]: value });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Properties</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(element.id)} title="Duplicate">
              <Copy size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(element.id)} title="Delete">
              <Trash2 size={14} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Label</Label>
          <Input
            value={element.label}
            onChange={(e) => update('label', e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => update('x', parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => update('y', parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              min={10}
              value={element.width}
              onChange={(e) => update('width', parseInt(e.target.value, 10) || 10)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              min={10}
              value={element.height}
              onChange={(e) => update('height', parseInt(e.target.value, 10) || 10)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Rotation ({element.rotation}°)</Label>
          <Slider
            value={[element.rotation]}
            onValueChange={([val]) => update('rotation', val)}
            min={0}
            max={360}
            step={5}
          />
        </div>

        {element.capacity !== undefined && (
          <div className="space-y-1.5">
            <Label className="text-xs">Capacity</Label>
            <Input
              type="number"
              min={0}
              value={element.capacity}
              onChange={(e) => update('capacity', parseInt(e.target.value, 10) || 0)}
              className="h-8 text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Switch
            checked={!!element.locked}
            onCheckedChange={(checked) => update('locked', !!checked)}
          />
          <Label className="text-xs">Locked</Label>
        </div>
      </CardContent>
    </Card>
  );
}
