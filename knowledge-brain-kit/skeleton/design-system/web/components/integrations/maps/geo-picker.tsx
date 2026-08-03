'use client';

/**
 * GeoPicker — selector de coordenadas en un mapa.
 * Toca el mapa o arrastra el marcador para fijar la ubicación de un drop.
 * Marcador CONTROLADO por lat/lng del padre. Sobre el módulo de mapas del DS.
 */

import * as React from 'react';
import { MapWrapper } from '~/components/integrations/maps/map-wrapper';
import { MapMarker } from '~/components/integrations/maps/map-marker';
import { useMap } from '~/components/integrations/maps/map/map';

export interface GeoPickerProps {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
    zoom?: number;
    className?: string;
}

/** Captura el clic del mapa (vía useMap) y lo reporta como lat/lng. */
function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
    const { map, isLoaded } = useMap();
    const cb = React.useRef(onPick);
    cb.current = onPick;
    React.useEffect(() => {
        if (!map || !isLoaded) return;
        const handler = (e: { lngLat: { lat: number; lng: number } }) => cb.current(e.lngLat.lat, e.lngLat.lng);
        map.on('click', handler);
        return () => {
            if (!map._removed) map.off('click', handler);
        };
    }, [map, isLoaded]);
    return null;
}

export function GeoPicker({ lat, lng, onChange, zoom = 13, className }: GeoPickerProps) {
    // MapLibre toca `window`: montamos solo en cliente.
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className={`grid place-items-center rounded-2xl border border-neutral-300/70 bg-muted ${className ?? ''}`}>
                <span className="text-sm text-neutral-600">Cargando mapa…</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-neutral-300/70 ${className ?? ''}`}>
            <MapWrapper
                showNavigation
                initialViewState={{ longitude: lng, latitude: lat, zoom }}
                className="h-full w-full"
            >
                <ClickCapture onPick={onChange} />
                <MapMarker
                    longitude={lng}
                    latitude={lat}
                    draggable
                    onDragEnd={(p) => onChange(p.lat, p.lng)}
                >
                    <div className="grid -translate-y-1/2 place-items-center">
                        <span className="block h-6 w-6 rounded-full bg-primary ring-2 ring-background shadow-lg" />
                    </div>
                </MapMarker>
            </MapWrapper>
            <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-background/90 px-3 py-1 text-xs text-neutral-600 shadow-sm">
                {lat.toFixed(5)}, {lng.toFixed(5)} · toca o arrastra
            </div>
        </div>
    );
}

export default GeoPicker;
