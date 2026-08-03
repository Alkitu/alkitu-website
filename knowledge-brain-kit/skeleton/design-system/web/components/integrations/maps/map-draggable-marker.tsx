'use client';

import { useState } from 'react';
import { MapMarker, MarkerContent } from '~/components/integrations/maps/map/map';
import { GripVertical } from 'lucide-react';

export interface DraggableMarkerPosition {
    longitude: number;
    latitude: number;
}

export interface MapDraggableMarkerProps {
    initialPosition: DraggableMarkerPosition;
    onPositionChange?: (position: DraggableMarkerPosition) => void;
    label?: string;
    showCoords?: boolean;
    color?: string;
}

/**
 * Draggable marker using MapCN's MapMarker with draggable prop.
 * Uses onDragEnd callback to report the new position.
 */
export function MapDraggableMarker({
    initialPosition,
    onPositionChange,
    label,
    showCoords = true,
    color = 'hsl(var(--primary))',
}: MapDraggableMarkerProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => setIsDragging(true);

    const handleDrag = (lngLat: { lng: number; lat: number }) => {
        setPosition({ longitude: lngLat.lng, latitude: lngLat.lat });
    };

    const handleDragEnd = (lngLat: { lng: number; lat: number }) => {
        const newPos = { longitude: lngLat.lng, latitude: lngLat.lat };
        setPosition(newPos);
        setIsDragging(false);
        onPositionChange?.(newPos);
    };

    return (
        <MapMarker
            longitude={position.longitude}
            latitude={position.latitude}
            draggable
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
        >
            <MarkerContent>
                <div className="flex flex-col items-center select-none">
                    {/* Live coordinates tooltip */}
                    {showCoords && (
                        <div className={`mb-1 px-2 py-1 bg-card border border-border rounded-lg text-xs text-muted-foreground shadow-md transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
                            {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
                        </div>
                    )}
                    {/* Pin body */}
                    <div
                        className="flex items-center gap-1 px-3 py-2 rounded-xl shadow-lg cursor-grab active:cursor-grabbing border-2 border-white transition-transform"
                        style={{
                            backgroundColor: color,
                            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                        }}
                    >
                        <GripVertical size={14} color="white" />
                        {label && <span className="text-white text-xs font-medium">{label}</span>}
                    </div>
                    {/* Pin tail */}
                    <div
                        className="w-2 h-3 -mt-0.5"
                        style={{
                            background: `linear-gradient(to bottom, ${color}, transparent)`,
                            clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
                        }}
                    />
                </div>
            </MarkerContent>
        </MapMarker>
    );
}

export default MapDraggableMarker;
