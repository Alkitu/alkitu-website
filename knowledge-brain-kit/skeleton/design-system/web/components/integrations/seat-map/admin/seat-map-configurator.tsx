'use client';

import * as React from 'react';
import type { SeatMapConfig, SectionConfig, SeatMapData } from '../types';
import { createDefaultSeatMapConfig, createDefaultSectionConfig, generateSeatMap } from '../utils/seat-layout-engine';
import { SeatMapSectionEditor } from './seat-map-section-editor';
import { SeatMapZoneEditor } from './seat-map-zone-editor';
import { SeatMapViewer } from '../viewer/seat-map-viewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/primitives/tabs';
import { Button } from '~/components/primitives/button';
import { Input } from '~/components/primitives/input';
import { Label } from '~/components/primitives/label';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/primitives/card';
import { Switch } from '~/components/primitives/switch';
import { Badge } from '~/components/primitives/badge';
import { Plus } from 'lucide-react';
import { cn } from '~/lib/utils';
import { totalSeatCount } from '../utils/seat-state-manager';

// ---------------------------------------------------------------------------
// SeatMapConfigurator — admin interface for building a seat map
// ---------------------------------------------------------------------------

export interface SeatMapConfiguratorProps {
  /** Initial configuration (for editing an existing map) */
  initialConfig?: SeatMapConfig;
  /** Callback when configuration changes */
  onChange?: (config: SeatMapConfig) => void;
  /** Callback when the user saves/exports the map */
  onSave?: (data: SeatMapData) => void;
  className?: string;
}

export function SeatMapConfigurator({
  initialConfig,
  onChange,
  onSave,
  className,
}: SeatMapConfiguratorProps) {
  const [config, setConfig] = React.useState<SeatMapConfig>(
    initialConfig ?? createDefaultSeatMapConfig(),
  );

  // Generate seat data from config
  const sections = React.useMemo(() => generateSeatMap(config), [config]);
  const seatCount = React.useMemo(() => totalSeatCount(sections), [sections]);

  const mapData: SeatMapData = React.useMemo(
    () => ({
      config,
      sections,
      zoneAssignments: {},
    }),
    [config, sections],
  );

  const updateConfig = (updates: Partial<SeatMapConfig>) => {
    const next = { ...config, ...updates, updatedAt: new Date().toISOString() };
    setConfig(next);
    onChange?.(next);
  };

  const updateSection = (index: number, updated: SectionConfig) => {
    const next = [...config.sections];
    next[index] = updated;
    updateConfig({ sections: next });
  };

  const removeSection = (index: number) => {
    updateConfig({ sections: config.sections.filter((_, i) => i !== index) });
  };

  const addSection = () => {
    const id = `section-${Date.now()}`;
    const offsetY = config.sections.length * 250;
    const newSection = { ...createDefaultSectionConfig(id, `Section ${config.sections.length + 1}`), offsetY };
    updateConfig({ sections: [...config.sections, newSection] });
  };

  const handleSave = () => {
    onSave?.(mapData);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Seat Map Configurator</h2>
          <p className="text-sm text-muted-foreground">
            Configure sections, zones, and preview the seat layout
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{seatCount} seats</Badge>
          <Button onClick={handleSave}>Save Map</Button>
        </div>
      </div>

      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="zones">Pricing Zones</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Sections tab */}
        <TabsContent value="sections" className="space-y-3 mt-4">
          {config.sections.map((section, i) => (
            <SeatMapSectionEditor
              key={section.id}
              section={section}
              onChange={(updated) => updateSection(i, updated)}
              onRemove={() => removeSection(i)}
              canRemove={config.sections.length > 1}
            />
          ))}
          <Button variant="outline" onClick={addSection} className="w-full">
            <Plus size={14} className="mr-1.5" />
            Add Section
          </Button>
        </TabsContent>

        {/* Zones tab */}
        <TabsContent value="zones" className="mt-4">
          <SeatMapZoneEditor
            zones={config.zones}
            onChange={(zones) => updateConfig({ zones })}
          />
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Map Name</Label>
                <Input
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Seat Shape</Label>
                <div className="flex gap-2">
                  <Button
                    variant={config.seatShape === 'rect' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateConfig({ seatShape: 'rect' })}
                  >
                    Square
                  </Button>
                  <Button
                    variant={config.seatShape === 'circle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateConfig({ seatShape: 'circle' })}
                  >
                    Circle
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Seat Size (px)</Label>
                <Input
                  type="number"
                  min={8}
                  max={40}
                  value={config.seatSize}
                  onChange={(e) => updateConfig({ seatSize: parseInt(e.target.value, 10) || 16 })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Seat Gap (px)</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={config.seatGap}
                  onChange={(e) => updateConfig({ seatGap: parseInt(e.target.value, 10) || 4 })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={config.showRowLabels}
                  onCheckedChange={(checked) => updateConfig({ showRowLabels: !!checked })}
                />
                <Label>Show Row Labels</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={config.showSeatNumbers}
                  onCheckedChange={(checked) => updateConfig({ showSeatNumbers: !!checked })}
                />
                <Label>Show Seat Numbers</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview tab */}
        <TabsContent value="preview" className="mt-4">
          <SeatMapViewer data={mapData} readOnly />
        </TabsContent>
      </Tabs>
    </div>
  );
}
