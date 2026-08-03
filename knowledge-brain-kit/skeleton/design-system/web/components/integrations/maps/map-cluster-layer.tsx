'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '~/components/integrations/maps/map/map';
import type { GeoJSONSource } from 'maplibre-gl';

export interface ClusterPoint {
    longitude: number;
    latitude: number;
    id: string | number;
}

export interface MapClusterLayerProps {
    points: ClusterPoint[];
    clusterColor?: string;
    clusterTextColor?: string;
    pointColor?: string;
    clusterRadius?: number;
    clusterMaxZoom?: number;
}

const SOURCE_ID = 'mapcn-cluster-source';

/**
 * Cluster layer using raw maplibre-gl imperatively via MapCN's useMap() hook.
 * Must be rendered inside a MapWrapper (which uses @mapcn/map as context).
 */
export function MapClusterLayer({
    points,
    clusterColor = '#3b82f6',
    clusterTextColor = '#ffffff',
    pointColor = '#3b82f6',
    clusterRadius = 50,
    clusterMaxZoom = 14,
}: MapClusterLayerProps) {
    const { map, isLoaded } = useMap();
    const addedRef = useRef(false);

    const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: points.map((p) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
            properties: { id: p.id },
        })),
    };

    useEffect(() => {
        if (!map || !isLoaded) return;

        const addLayers = () => {
            // Add or update the GeoJSON source
            if (map.getSource(SOURCE_ID)) {
                (map.getSource(SOURCE_ID) as GeoJSONSource).setData(geojson);
                return;
            }

            map.addSource(SOURCE_ID, {
                type: 'geojson',
                data: geojson,
                cluster: true,
                clusterRadius,
                clusterMaxZoom,
            });

            // Cluster circles
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: SOURCE_ID,
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': ['step', ['get', 'point_count'], clusterColor, 10, '#2563eb', 30, '#1d4ed8'],
                    'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
                    'circle-opacity': 0.9,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
            });

            // Cluster count labels
            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: SOURCE_ID,
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 13,
                },
                paint: { 'text-color': clusterTextColor },
            });

            // Individual unclustered points
            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: SOURCE_ID,
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': pointColor,
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
            });

            addedRef.current = true;
        };

        // Style may already be loaded or we may need to wait for styledata
        if (map.isStyleLoaded()) {
            addLayers();
        } else {
            map.once('styledata', addLayers);
        }

        return () => {
            if (!map || map._removed) return;
            ['clusters', 'cluster-count', 'unclustered-point'].forEach(id => {
                if (map.getLayer(id)) map.removeLayer(id);
            });
            if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
            addedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded]);

    // Update data when points change
    useEffect(() => {
        if (!map || !isLoaded || !addedRef.current) return;
        const src = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
        src?.setData(geojson);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points]);

    return null;
}

export default MapClusterLayer;
