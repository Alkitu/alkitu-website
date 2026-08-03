import React, { useState, useRef, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MapWrapper } from './map-wrapper';
import { MapMarker } from './map-marker';
import { MapPopup } from './map-popup';
import { MapClusterLayer } from './map-cluster-layer';
import { MapRoute, RoutePoint } from './map-route';
import { MapDraggableMarker } from './map-draggable-marker';
import { MapControlsPanel } from './map-controls-panel';
import { MapPoster } from './map-poster';
import { Map as MapCN } from '~/components/integrations/maps/map/map';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapPin } from 'lucide-react';
import { Button } from '~/components/primitives/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/primitives/select';

// OpenFreeMap style URLs — valid MapLibre GL style specs (free, no API key)
const OFM_BRIGHT = 'https://tiles.openfreemap.org/styles/bright';
const OFM_LIBERTY = 'https://tiles.openfreemap.org/styles/liberty';
const OFM_POSITRON = 'https://tiles.openfreemap.org/styles/positron';

const meta = {
    title: 'Integrations/Maps/Advanced Variants',
    component: MapWrapper,
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof MapWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shared constants
const MADRID = { longitude: -3.703790, latitude: 40.416775 };

// ============================================================
// 1. POSTER PREVIEW
// ============================================================
export const PosterPreview: Story = {
    args: { showNavigation: true },
    render: () => (
        <MapPoster
            center={{ latitude: MADRID.latitude, longitude: MADRID.longitude, zoom: 13 }}
            className="h-[600px]"
            initialViewState={{ ...MADRID, zoom: 13 }}
        />
    ),
};

// ============================================================
// 2. CLUSTER LAYER
// ============================================================
// Generate 80 random points around Madrid for clustering demo
const clusterPoints = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    longitude: MADRID.longitude + (Math.random() - 0.5) * 0.3,
    latitude: MADRID.latitude + (Math.random() - 0.5) * 0.3,
}));

export const ClusterLayer: Story = {
    args: { showNavigation: true },
    render: () => (
        <MapWrapper
            className="h-[600px]"
            initialViewState={{ ...MADRID, zoom: 10 }}
            showNavigation
        >
            <MapClusterLayer points={clusterPoints} clusterColor="hsl(217, 91%, 60%)" />
        </MapWrapper>
    ),
};

// ============================================================
// 3. ROUTE PLANNING
// ============================================================
const RoutePlanningTemplate = () => {
    const initialWaypoints: RoutePoint[] = [
        { longitude: -3.75, latitude: 40.45 },
        { longitude: -3.72, latitude: 40.43 },
        { longitude: -3.703790, latitude: 40.416775 },
    ];
    const [waypoints, setWaypoints] = useState<RoutePoint[]>(initialWaypoints);

    const handleMapClick = useCallback((e: any) => {
        setWaypoints(prev => [...prev, { longitude: e.lngLat.lng, latitude: e.lngLat.lat }]);
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>Click on the map to add waypoints. Showing {waypoints.length} points.</span>
            </div>
            <MapWrapper
                className="h-[600px]"
                initialViewState={{ ...MADRID, zoom: 11 }}
                showNavigation
                onClick={handleMapClick}
            >
                <MapRoute waypoints={waypoints} lineColor="#3b82f6" />
            </MapWrapper>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => setWaypoints(initialWaypoints)}
            >
                Reset Route
            </Button>
        </div>
    );
};

export const RoutePlanning: Story = {
    args: { showNavigation: true },
    render: () => <RoutePlanningTemplate />,
};

// ============================================================
// 4. DRAGGABLE MARKERS
// ============================================================
const DraggableMarkersTemplate = () => {
    const [positions, setPositions] = useState([
        { id: 'A', longitude: -3.72, latitude: 40.43 },
        { id: 'B', longitude: -3.695, latitude: 40.41 },
        { id: 'C', longitude: -3.680, latitude: 40.425 },
    ]);

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
                {positions.map(pos => (
                    <div key={pos.id} className="px-3 py-2 bg-muted rounded-lg text-xs font-mono text-muted-foreground">
                        <span className="text-foreground font-semibold">Pin {pos.id}:</span>{' '}
                        {pos.latitude.toFixed(4)}, {pos.longitude.toFixed(4)}
                    </div>
                ))}
            </div>
            <MapWrapper className="h-[600px]" initialViewState={{ ...MADRID, zoom: 12 }} showNavigation>
                {positions.map((pos, i) => (
                    <MapDraggableMarker
                        key={pos.id}
                        initialPosition={{ longitude: pos.longitude, latitude: pos.latitude }}
                        label={`Pin ${pos.id}`}
                        color={['#1e40af', '#c2410c', '#166534'][i % 3]}  // dark blue / dark orange / dark green
                        showCoords
                        onPositionChange={(newPos) =>
                            setPositions(prev => prev.map(p => p.id === pos.id ? { ...p, ...newPos } : p))
                        }
                    />
                ))}
            </MapWrapper>
        </div>
    );
};

export const DraggableMarkers: Story = {
    args: { showNavigation: false },
    render: () => <DraggableMarkersTemplate />,
};

// ============================================================
// 5. CONTROLS PANEL
// ============================================================
const ControlsPanelTemplate = () => {
    return (
        <MapWrapper
            className="h-[600px]"
            initialViewState={{ ...MADRID, zoom: 12 }}
            showNavigation={false}
        >
            <MapControlsPanel
                homePosition={{ ...MADRID, zoom: 12 }}
                position="bottom-left"
            />
            <MapMarker longitude={MADRID.longitude} latitude={MADRID.latitude}>
                <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                    <MapPin size={20} />
                </div>
            </MapMarker>
        </MapWrapper>
    );
};

export const ControlsPanel: Story = {
    args: { showNavigation: false },
    render: () => <ControlsPanelTemplate />,
};

// ============================================================
// 6. CUSTOM DS STYLE — OpenFreeMap tiles, style picker
// ============================================================
const STYLE_OPTIONS = [
    { label: 'Carto Positron (Light)', lightUrl: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', darkUrl: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
    { label: 'OpenFreeMap Bright (Light)', lightUrl: OFM_BRIGHT, darkUrl: OFM_LIBERTY },
    { label: 'OpenFreeMap Liberty (Dark-first)', lightUrl: OFM_LIBERTY, darkUrl: OFM_LIBERTY },
    { label: 'OpenFreeMap Positron', lightUrl: OFM_POSITRON, darkUrl: OFM_LIBERTY },
];

const CustomDSStyleTemplate = () => {
    const [selectedIdx, setSelectedIdx] = useState(1); // default: OFM Bright
    const selected = STYLE_OPTIONS[selectedIdx];

    return (
        <div className="flex flex-col gap-4">
            {/* Style picker */}
            <div className="flex items-center gap-3 px-1">
                <label className="text-sm font-medium text-foreground">Map Style:</label>
                <Select
                    value={String(selectedIdx)}
                    onValueChange={(value) => setSelectedIdx(Number(value))}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {STYLE_OPTIONS.map((opt, i) => (
                            <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">
                    Toggle Dark mode in the toolbar to see the paired dark style.
                </span>
            </div>

            <MapWrapper
                className="h-[600px]"
                initialViewState={{ ...MADRID, zoom: 13 }}
                showNavigation
                lightStyle={selected.lightUrl}
                darkStyle={selected.darkUrl}
            >
                <MapMarker longitude={MADRID.longitude} latitude={MADRID.latitude}>
                    <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-xl border-2 border-white">
                        <MapPin size={22} />
                    </div>
                </MapMarker>
            </MapWrapper>
        </div>
    );
};

export const CustomDSStyle: Story = {
    args: { showNavigation: true },
    render: () => <CustomDSStyleTemplate />,
};
