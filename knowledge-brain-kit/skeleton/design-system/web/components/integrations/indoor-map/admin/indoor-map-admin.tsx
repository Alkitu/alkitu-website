'use client';

import * as React from 'react';
import type { IndoorMapConfig, MapArea, AreaData, AreaCategory, AreaStatus, FloorLevel, PoiType, PointOfInterest } from '../types';
import { FloorManager } from './floor-manager';
import { AreaDataLinker } from './area-data-linker';
import { AreaNavigator } from './area-navigator';
import { PoiPlacer } from './poi-placer';
import { SvgViewport } from '../../venue-core/svg/svg-viewport';
import { SvgControls } from '../../venue-core/svg/svg-controls';
import { useViewport } from '../../venue-core/hooks/use-viewport';
import { IndoorMapFloor } from '../viewer/indoor-map-floor';
import { IndoorMapViewer } from '../viewer/indoor-map-viewer';
import { POI_TYPE_INFO } from '../viewer/indoor-map-poi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/primitives/tabs';
import { Button } from '~/components/primitives/button';
import { Input } from '~/components/primitives/input';
import { Card, CardContent } from '~/components/primitives/card';
import { Badge } from '~/components/primitives/badge';
import { Plus, Trash2, Save } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// IndoorMapAdmin — admin interface for configuring indoor maps
// ---------------------------------------------------------------------------

export interface IndoorMapAdminProps {
  initialConfig?: IndoorMapConfig;
  onChange?: (config: IndoorMapConfig) => void;
  onSave?: (config: IndoorMapConfig) => void;
  className?: string;
}

export function IndoorMapAdmin({
  initialConfig,
  onChange,
  onSave,
  className,
}: IndoorMapAdminProps) {
  const [config, setConfig] = React.useState<IndoorMapConfig>(
    initialConfig ?? {
      id: crypto.randomUUID(),
      name: 'New Indoor Map',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      floors: [],
      categories: [],
    },
  );

  const [selectedArea, setSelectedArea] = React.useState<MapArea | null>(null);
  const [ignoredAreaIds, setIgnoredAreaIds] = React.useState<Set<string>>(new Set());
  const [activeFloorId, setActiveFloorId] = React.useState<string>(config.floors[0]?.id ?? '');

  // POI placement state
  const [activePlacementType, setActivePlacementType] = React.useState<PoiType | null>(null);
  const [selectedPoiId, setSelectedPoiId] = React.useState<string>();
  // Dragging POI state
  const [draggingPoiId, setDraggingPoiId] = React.useState<string | null>(null);

  const viewport = useViewport({ minZoom: 0.2, maxZoom: 6 });
  const svgRef = React.useRef<SVGSVGElement>(null);

  const updateConfig = (updates: Partial<IndoorMapConfig>) => {
    const next = { ...config, ...updates, updatedAt: new Date().toISOString() };
    setConfig(next);
    onChange?.(next);
  };

  // --- Floor management ---
  const handleFloorsChange = (floors: FloorLevel[]) => {
    updateConfig({ floors });
    if (!floors.find((f) => f.id === activeFloorId) && floors.length > 0) {
      setActiveFloorId(floors[0].id);
    }
  };

  // --- Area data ---
  const handleAreaDataSave = (areaId: string, data: AreaData, status?: AreaStatus) => {
    const floors = config.floors.map((floor) => ({
      ...floor,
      areas: floor.areas.map((area) =>
        area.id === areaId ? { ...area, data, ...(status ? { status } : {}) } : area,
      ),
    }));
    updateConfig({ floors });
    setSelectedArea((prev) =>
      prev?.id === areaId ? { ...prev, data, ...(status ? { status } : {}) } : prev,
    );
  };

  const handleSelectArea = (area: MapArea) => {
    if (activePlacementType) return; // Don't select areas while placing POIs
    setSelectedArea(area);
    for (const floor of config.floors) {
      if (floor.areas.find((a) => a.id === area.id)) {
        setActiveFloorId(floor.id);
        break;
      }
    }
    viewport.setState({
      x: -area.centroidX * viewport.state.zoom + 200,
      y: -area.centroidY * viewport.state.zoom + 150,
      zoom: Math.max(viewport.state.zoom, 1.5),
    });
  };

  const handleIgnoreArea = (areaId: string) => {
    setIgnoredAreaIds((prev) => new Set([...prev, areaId]));
    if (selectedArea?.id === areaId) setSelectedArea(null);
  };

  const handleRestoreArea = (areaId: string) => {
    setIgnoredAreaIds((prev) => {
      const next = new Set(prev);
      next.delete(areaId);
      return next;
    });
  };

  // --- POI management ---
  const clientToSvg = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activePlacementType) return;
    const pos = clientToSvg(e.clientX, e.clientY);
    if (!pos) return;

    const info = POI_TYPE_INFO[activePlacementType];
    const newPoi: PointOfInterest = {
      id: `poi-${activePlacementType}-${Date.now()}`,
      type: activePlacementType,
      label: info.label,
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    };

    const floors = config.floors.map((floor) => {
      if (floor.id !== activeFloorId) return floor;
      return { ...floor, pois: [...(floor.pois ?? []), newPoi] };
    });
    updateConfig({ floors });
    setSelectedPoiId(newPoi.id);
    // Don't cancel placement — allow placing multiple of same type
  };

  const handlePoiMapMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Check if clicking on an existing POI to start drag
    const target = e.target as SVGElement;
    const poiGroup = target.closest('[data-poi-id]');
    if (poiGroup && !activePlacementType) {
      const poiId = poiGroup.getAttribute('data-poi-id')!;
      setDraggingPoiId(poiId);
      setSelectedPoiId(poiId);
      e.preventDefault();
    }
  };

  const handlePoiMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingPoiId) return;
    const pos = clientToSvg(e.clientX, e.clientY);
    if (!pos) return;

    const floors = config.floors.map((floor) => {
      if (floor.id !== activeFloorId) return floor;
      return {
        ...floor,
        pois: (floor.pois ?? []).map((p) =>
          p.id === draggingPoiId ? { ...p, x: Math.round(pos.x), y: Math.round(pos.y) } : p,
        ),
      };
    });
    updateConfig({ floors });
  };

  const handlePoiMapMouseUp = () => {
    setDraggingPoiId(null);
  };

  const handleRemovePoi = (poiId: string) => {
    const floors = config.floors.map((floor) => ({
      ...floor,
      pois: (floor.pois ?? []).filter((p) => p.id !== poiId),
    }));
    updateConfig({ floors });
    if (selectedPoiId === poiId) setSelectedPoiId(undefined);
  };

  const handleSelectPoi = (poi: PointOfInterest) => {
    setSelectedPoiId(poi.id);
    setSelectedArea(null);
  };

  // --- Category management ---
  const addCategory = () => {
    const id = `cat-${Date.now()}`;
    updateConfig({
      categories: [...config.categories, { id, name: 'New Category' }],
    });
  };

  const updateCategory = (index: number, updates: Partial<AreaCategory>) => {
    const categories = config.categories.map((c, i) =>
      i === index ? { ...c, ...updates } : c,
    );
    updateConfig({ categories });
  };

  const removeCategory = (index: number) => {
    updateConfig({ categories: config.categories.filter((_, i) => i !== index) });
  };

  const currentFloor = config.floors.find((f) => f.id === activeFloorId);
  const currentFloorAreas = currentFloor?.areas ?? [];
  const currentFloorPois = currentFloor?.pois ?? [];
  const allAreas = config.floors.flatMap((f) => f.areas);
  const totalAreas = allAreas.length;
  const linkedAreas = allAreas.filter((a) => a.data).length;
  const totalPois = config.floors.reduce((sum, f) => sum + (f.pois?.length ?? 0), 0);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Indoor Map Editor</h2>
          <p className="text-sm text-muted-foreground">
            Import floor plans, link data to areas, and manage categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{config.floors.length} floors</Badge>
          <Badge variant="outline">{linkedAreas}/{totalAreas} areas linked</Badge>
          {totalPois > 0 && <Badge variant="outline">{totalPois} POIs</Badge>}
          {ignoredAreaIds.size > 0 && (
            <Badge variant="secondary">{ignoredAreaIds.size} ignored</Badge>
          )}
          <Button onClick={() => onSave?.(config)}>
            <Save size={14} className="mr-1.5" />
            Save Map
          </Button>
        </div>
      </div>

      <Tabs defaultValue="floors">
        <TabsList>
          <TabsTrigger value="floors">Floors</TabsTrigger>
          <TabsTrigger value="link-data">Link Data</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Floors tab */}
        <TabsContent value="floors" className="mt-4">
          <FloorManager floors={config.floors} onChange={handleFloorsChange} />
        </TabsContent>

        {/* Link Data tab */}
        <TabsContent value="link-data" className="mt-4">
          {config.floors.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                Import a floor plan first to start linking data
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-3">
              {/* Left: Area navigator + POI placer */}
              <div className="w-52 shrink-0 space-y-2">
                <AreaNavigator
                  areas={currentFloorAreas}
                  currentAreaId={selectedArea?.id ?? null}
                  ignoredAreaIds={ignoredAreaIds}
                  onSelectArea={handleSelectArea}
                  onIgnoreArea={handleIgnoreArea}
                  onRestoreArea={handleRestoreArea}
                />

                <PoiPlacer
                  pois={currentFloorPois}
                  activePlacementType={activePlacementType}
                  onStartPlacement={setActivePlacementType}
                  onCancelPlacement={() => setActivePlacementType(null)}
                  onRemovePoi={handleRemovePoi}
                  onSelectPoi={handleSelectPoi}
                  selectedPoiId={selectedPoiId}
                />

                {/* Floor switcher */}
                {config.floors.length > 1 && (
                  <div className="space-y-1">
                    {config.floors
                      .sort((a, b) => a.order - b.order)
                      .map((floor) => (
                        <Button
                          key={floor.id}
                          variant={floor.id === activeFloorId ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setActiveFloorId(floor.id);
                            setSelectedArea(null);
                            setActivePlacementType(null);
                          }}
                          className="w-full justify-start text-xs"
                        >
                          {floor.name}
                          <Badge variant="secondary" className="ml-auto text-[10px]">
                            {floor.areas.filter((a) => a.data).length}/{floor.areas.length}
                          </Badge>
                        </Button>
                      ))}
                  </div>
                )}
              </div>

              {/* Center: SVG Map */}
              <div className="flex-1 relative">
                {currentFloor && (
                  <div className="relative">
                    <div
                      className={cn(
                        'relative overflow-hidden rounded-lg border border-border bg-background',
                        activePlacementType && 'ring-2 ring-primary cursor-crosshair',
                        draggingPoiId && 'cursor-grabbing',
                      )}
                    >
                      {activePlacementType && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                          Click to place {POI_TYPE_INFO[activePlacementType].icon} {POI_TYPE_INFO[activePlacementType].label}
                        </div>
                      )}
                      <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        viewBox={currentFloor.viewBox}
                        className="block min-h-[400px]"
                        style={{ cursor: activePlacementType ? 'crosshair' : draggingPoiId ? 'grabbing' : undefined }}
                        onClick={activePlacementType ? handleMapClick : undefined}
                        onMouseDown={handlePoiMapMouseDown}
                        onMouseMove={draggingPoiId ? handlePoiMapMouseMove : undefined}
                        onMouseUp={handlePoiMapMouseUp}
                        onMouseLeave={handlePoiMapMouseUp}
                      >
                        <IndoorMapFloor
                          floor={{
                            ...currentFloor,
                            areas: currentFloor.areas.filter((a) => !ignoredAreaIds.has(a.id)),
                          }}
                          categories={config.categories}
                          activeFilters={new Set()}
                          selectedAreaId={selectedArea?.id}
                          onAreaClick={handleSelectArea}
                        />
                        {/* Render POIs with data-poi-id for drag detection */}
                        {currentFloorPois.map((poi) => (
                          <g key={poi.id} data-poi-id={poi.id}>
                            {/* Re-use the POI component from the floor renderer — but we need the wrapper for drag detection */}
                            <circle
                              cx={poi.x}
                              cy={poi.y - 10}
                              r={10}
                              fill={selectedPoiId === poi.id ? 'var(--primary)' : POI_TYPE_INFO[poi.type]?.color ?? '#6b7280'}
                              stroke="white"
                              strokeWidth={1.5}
                              style={{ cursor: 'grab' }}
                            />
                            <text
                              x={poi.x}
                              y={poi.y - 10}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={10}
                              pointerEvents="none"
                              className="select-none"
                            >
                              {POI_TYPE_INFO[poi.type]?.icon ?? '📍'}
                            </text>
                            {poi.label && (
                              <text
                                x={poi.x}
                                y={poi.y + 5}
                                textAnchor="middle"
                                dominantBaseline="hanging"
                                fontSize={6}
                                fontWeight={500}
                                fill="var(--foreground)"
                                pointerEvents="none"
                                className="select-none"
                              >
                                {poi.label}
                              </text>
                            )}
                          </g>
                        ))}
                      </svg>
                    </div>
                    <SvgControls
                      onZoomIn={viewport.zoomIn}
                      onZoomOut={viewport.zoomOut}
                      onReset={viewport.resetView}
                      zoom={viewport.state.zoom}
                      position="bottom-right"
                    />
                  </div>
                )}
              </div>

              {/* Right: Data linker form */}
              <div className="w-72 shrink-0">
                <AreaDataLinker
                  area={selectedArea}
                  categories={config.categories}
                  onSave={handleAreaDataSave}
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* Categories tab */}
        <TabsContent value="categories" className="mt-4 space-y-3">
          {config.categories.map((cat, i) => (
            <Card key={cat.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <Input
                  value={cat.name}
                  onChange={(e) => updateCategory(i, { name: e.target.value })}
                  placeholder="Category name"
                  className="h-8 text-sm flex-1"
                />
                <Input
                  value={cat.icon ?? ''}
                  onChange={(e) => updateCategory(i, { icon: e.target.value })}
                  placeholder="Icon/emoji"
                  className="h-8 text-sm w-20"
                />
                <Input
                  type="color"
                  value={cat.color ?? '#888888'}
                  onChange={(e) => updateCategory(i, { color: e.target.value })}
                  className="h-8 w-12 p-1"
                />
                <Button variant="ghost" size="sm" onClick={() => removeCategory(i)}>
                  <Trash2 size={14} />
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addCategory} className="w-full">
            <Plus size={14} className="mr-1.5" />
            Add Category
          </Button>
        </TabsContent>

        {/* Preview tab */}
        <TabsContent value="preview" className="mt-4">
          <IndoorMapViewer config={config} readOnly />
        </TabsContent>
      </Tabs>
    </div>
  );
}
