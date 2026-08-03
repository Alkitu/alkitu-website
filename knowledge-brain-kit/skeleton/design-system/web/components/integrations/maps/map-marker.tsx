'use client';

/**
 * MapMarker — delegates to @mapcn MapMarker + MarkerContent.
 * The official MapCN component handles portal rendering into the map canvas 
 * and works correctly within the Map context.
 */

import * as React from 'react';
import { MapMarker as McnMapMarker, MarkerContent } from '~/components/integrations/maps/map/map';

export interface MapMarkerProps {
    longitude: number;
    latitude: number;
    children?: React.ReactNode;
    onClick?: (e: MouseEvent) => void;
    anchor?: string;
    draggable?: boolean;
    onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
    onDrag?: (lngLat: { lng: number; lat: number }) => void;
    onDragStart?: (lngLat: { lng: number; lat: number }) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
    longitude,
    latitude,
    children,
    onClick,
    draggable,
    onDragEnd,
    onDrag,
    onDragStart,
}) => {
    return (
        <McnMapMarker
            longitude={longitude}
            latitude={latitude}
            onClick={onClick}
            draggable={draggable}
            onDragEnd={onDragEnd}
            onDrag={onDrag}
            onDragStart={onDragStart}
        >
            <MarkerContent>
                {children}
            </MarkerContent>
        </McnMapMarker>
    );
};

export default MapMarker;
