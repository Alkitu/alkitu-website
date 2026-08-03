'use client';

import * as React from 'react';
import type { SectionConfig } from '../types';
import { Input } from '~/components/primitives/input';
import { Label } from '~/components/primitives/label';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/primitives/card';
import { Button } from '~/components/primitives/button';
import { Trash2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// SeatMapSectionEditor — form to configure a single section
// ---------------------------------------------------------------------------

export interface SeatMapSectionEditorProps {
  section: SectionConfig;
  onChange: (updated: SectionConfig) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}

export function SeatMapSectionEditor({
  section,
  onChange,
  onRemove,
  canRemove = true,
}: SeatMapSectionEditorProps) {
  const update = <K extends keyof SectionConfig>(key: K, value: SectionConfig[K]) => {
    onChange({ ...section, [key]: value });
  };

  const handleAislesChange = (value: string) => {
    const aisles = value
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    update('aisles', aisles);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">{section.name}</CardTitle>
        {canRemove && onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 size={14} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-name`}>Section Name</Label>
          <Input
            id={`${section.id}-name`}
            value={section.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-startRow`}>Start Row Label</Label>
          <Input
            id={`${section.id}-startRow`}
            value={section.startRowLabel}
            maxLength={2}
            onChange={(e) => update('startRowLabel', e.target.value.toUpperCase())}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-rows`}>Rows</Label>
          <Input
            id={`${section.id}-rows`}
            type="number"
            min={1}
            max={100}
            value={section.rows}
            onChange={(e) => update('rows', parseInt(e.target.value, 10) || 1)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-cols`}>Columns</Label>
          <Input
            id={`${section.id}-cols`}
            type="number"
            min={1}
            max={100}
            value={section.columns}
            onChange={(e) => update('columns', parseInt(e.target.value, 10) || 1)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-aisles`}>Aisles (comma-separated columns)</Label>
          <Input
            id={`${section.id}-aisles`}
            value={section.aisles.join(', ')}
            placeholder="e.g. 5, 10"
            onChange={(e) => handleAislesChange(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-curvature`}>Curvature (0-1)</Label>
          <Input
            id={`${section.id}-curvature`}
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={section.curvature}
            onChange={(e) => update('curvature', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-offsetX`}>Offset X</Label>
          <Input
            id={`${section.id}-offsetX`}
            type="number"
            value={section.offsetX}
            onChange={(e) => update('offsetX', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${section.id}-offsetY`}>Offset Y</Label>
          <Input
            id={`${section.id}-offsetY`}
            type="number"
            value={section.offsetY}
            onChange={(e) => update('offsetY', parseFloat(e.target.value) || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
