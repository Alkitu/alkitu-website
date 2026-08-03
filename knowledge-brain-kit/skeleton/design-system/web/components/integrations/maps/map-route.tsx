'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '~/components/integrations/maps/map/map';
import type { GeoJSONSource } from 'maplibre-gl';
import {
    MapMarker,
    MarkerContent,
} from '~/components/integrations/maps/map/map';
import { MapPin, Navigation } from 'lucide-react';

export interface RoutePoint {
    longitude: number;
    latitude: number;
}

export interface MapRouteProps {
    waypoints: RoutePoint[];
    lineColor?: string;
    lineWidth?: number;
}

const ROUTE_SOURCE = 'mapcn-route-source';

/**
 * Route layer using raw maplibre-gl imperatively via MapCN's useMap() hook.
 * Start marker = green Navigation icon. End marker = primary MapPin icon.
 * Intermediate waypoints = small blue dots.
 */
export function MapRoute({
    waypoints,
    lineColor = '#3b82f6',
    lineWidth = 4,
}: MapRouteProps) {
    const { map, isLoaded } = useMap();
    const addedRef = useRef(false);

    const coordinates = waypoints.map((w) => [w.longitude, w.latitude]);

    const geojson: GeoJSON.Feature = {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates },
        properties: {},
    };

    useEffect(() => {
        if (!map || !isLoaded || waypoints.length < 2) return;

        const addLayers = () => {
            if (map.getSource(ROUTE_SOURCE)) {
                (map.getSource(ROUTE_SOURCE) as GeoJSONSource).setData(geojson);
                return;
            }

            map.addSource(ROUTE_SOURCE, { type: 'geojson', data: geojson });

            // Glow layer
            map.addLayer({
                id: 'route-glow',
                type: 'line',
                source: ROUTE_SOURCE,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': lineColor,
                    'line-width': lineWidth + 6,
                    'line-opacity': 0.15,
                },
            });

            // Main line
            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: ROUTE_SOURCE,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': lineColor,
                    'line-width': lineWidth,
                    'line-dasharray': [2, 1],
                    'line-opacity': 0.9,
                },
            });

            addedRef.current = true;
        };

        if (map.isStyleLoaded()) {
            addLayers();
        } else {
            map.once('styledata', addLayers);
        }

        return () => {
            if (!map || (map as any)._removed) return;
            ['route-line', 'route-glow'].forEach(id => {
                if (map.getLayer(id)) map.removeLayer(id);
            });
            if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
            addedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded]);

    // Update line when waypoints change
    useEffect(() => {
        if (!map || !isLoaded || !addedRef.current || waypoints.length < 2) return;
        const src = map.getSource(ROUTE_SOURCE) as GeoJSONSource | undefined;
        src?.setData(geojson);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waypoints]);

    if (waypoints.length < 2) return null;

    const start = waypoints[0];
    const end = waypoints[waypoints.length - 1];
    const middleWaypoints = waypoints.slice(1, -1);

    return (
        <>
            {/* Start marker */}
            <MapMarker longitude={start.longitude} latitude={start.latitude}>
                <MarkerContent>
                    <div className="bg-success text-success-foreground p-2 rounded-full shadow-lg border-2 border-background">
                        <Navigation size={18} />
                    </div>
                </MarkerContent>
            </MapMarker>

            {/* End marker */}
            <MapMarker longitude={end.longitude} latitude={end.latitude}>
                <MarkerContent>
                    <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-2 border-white">
                        <MapPin size={18} />
                    </div>
                </MarkerContent>
            </MapMarker>

            {/* Intermediate waypoints */}
            {middleWaypoints.map((wp, i) => (
                <MapMarker key={i} longitude={wp.longitude} latitude={wp.latitude}>
                    <MarkerContent>
                        <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md" />
                    </MarkerContent>
                </MapMarker>
            ))}
        </>
    );
}

export default MapRoute;
