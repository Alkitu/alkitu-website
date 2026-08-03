'use client';

import * as React from 'react';
import type { MapArea, AreaData, AreaCategory, AreaStatus } from '../types';
import { Input } from '~/components/primitives/input';
import { Label } from '~/components/primitives/label';
import { Button } from '~/components/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/primitives/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/primitives/select';
import { Badge } from '~/components/primitives/badge';
import { Link2, Save } from 'lucide-react';

// ---------------------------------------------------------------------------
// AreaDataLinker — form to link rich data to a floor plan area
// ---------------------------------------------------------------------------

export interface AreaDataLinkerProps {
  area: MapArea | null;
  categories: AreaCategory[];
  onSave: (areaId: string, data: AreaData, status?: AreaStatus) => void;
}

const STATUS_OPTIONS: { value: AreaStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'highlighted', label: 'Highlighted' },
  { value: 'disabled', label: 'Disabled' },
];

export function AreaDataLinker({ area, categories, onSave }: AreaDataLinkerProps) {
  const [areaStatus, setAreaStatus] = React.useState<AreaStatus>('available');
  const [formData, setFormData] = React.useState<AreaData>({
    name: '',
    description: '',
    categoryId: '',
    schedule: '',
    location: '',
    logoUrl: '',
    phone: '',
    email: '',
    website: '',
  });

  // Sync form when selected area changes
  React.useEffect(() => {
    setAreaStatus(area?.status ?? 'available');
    if (area?.data) {
      setFormData(area.data);
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        schedule: '',
        location: '',
        logoUrl: '',
        phone: '',
        email: '',
        website: '',
      });
    }
  }, [area?.id, area?.data]);

  const update = <K extends keyof AreaData>(key: K, value: AreaData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!area) return;
    onSave(area.id, formData, areaStatus);
  };

  if (!area) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[200px]">
        <CardContent className="text-center text-muted-foreground">
          <Link2 size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Click an area on the map to link data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Link2 size={14} />
          Link Data to Area
          <Badge variant="outline" className="ml-auto text-xs">
            {area.id}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Nike Store"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select
            value={formData.categoryId ?? ''}
            onValueChange={(val) => update('categoryId', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input
            value={formData.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Brief description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Schedule</Label>
            <Input
              value={formData.schedule ?? ''}
              onChange={(e) => update('schedule', e.target.value)}
              placeholder="9:00 AM - 6:00 PM"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={formData.location ?? ''}
              onChange={(e) => update('location', e.target.value)}
              placeholder="Level 2, Wing B"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Logo URL</Label>
          <Input
            value={formData.logoUrl ?? ''}
            onChange={(e) => update('logoUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={formData.phone ?? ''}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={formData.email ?? ''}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Website</Label>
          <Input
            value={formData.website ?? ''}
            onChange={(e) => update('website', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={areaStatus}
            onValueChange={(val) => setAreaStatus(val as AreaStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={!formData.name.trim()} className="w-full">
          <Save size={14} className="mr-1.5" />
          Save Data
        </Button>
      </CardContent>
    </Card>
  );
}
