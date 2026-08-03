'use client';

/**
 * AnalyticsMap — mapamundi de visitas para el panel de analíticas.
 * Un marcador por ubicación (ciudad con lat/lng real, o país por centroide),
 * con tamaño proporcional al nº de visitas y popup al hacer clic.
 * Construido sobre el módulo de mapas del DS (MapLibre/mapcn). Piel 100% tokens.
 */

import * as React from 'react';
import { MapWrapper } from '~/components/integrations/maps/map-wrapper';
import { MapMarker } from '~/components/integrations/maps/map-marker';
import { MapPopup } from '~/components/integrations/maps/map-popup';

export type AnalyticsMapPoint = {
    id: string;
    lat: number;
    lng: number;
    count: number;
    label: string;
    /** "city" = lat/lng real; "country" = centroide aproximado. */
    kind: 'city' | 'country';
};

export interface AnalyticsMapProps {
    points: AnalyticsMapPoint[];
    className?: string;
}

export function AnalyticsMap({ points, className }: AnalyticsMapProps) {
    // MapLibre toca `window`: montamos solo en cliente para no romper el SSR.
    const [mounted, setMounted] = React.useState(false);
    const [selected, setSelected] = React.useState<AnalyticsMapPoint | null>(null);
    React.useEffect(() => setMounted(true), []);

    const maxCount = React.useMemo(
        () => Math.max(1, ...points.map((p) => p.count)),
        [points],
    );

    // Tamaño 18–56px según √(visitas/máx) para que un outlier no aplaste el resto.
    const sizeFor = React.useCallback(
        (count: number) => Math.round(18 + Math.sqrt(count / maxCount) * 38),
        [maxCount],
    );

    if (!mounted) {
        return (
            <div
                className={`grid place-items-center rounded-2xl border border-neutral-300/70 bg-muted ${className ?? ''}`}
            >
                <span className="text-sm text-neutral-600">Cargando mapa…</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-neutral-300/70 ${className ?? ''}`}>
            <MapWrapper
                showNavigation
                initialViewState={{ longitude: 8, latitude: 30, zoom: 1.15 }}
                className="h-full w-full"
            >
                {points.map((p) => {
                    const size = sizeFor(p.count);
                    const isCountry = p.kind === 'country';
                    return (
                        <MapMarker
                            key={p.id}
                            longitude={p.lng}
                            latitude={p.lat}
                            onClick={() => setSelected(p)}
                        >
                            <div
                                title={`${p.label} · ${p.count}`}
                                style={{ width: size, height: size }}
                                className={[
                                    'grid cursor-pointer place-items-center rounded-full ring-2 ring-background transition-transform hover:scale-110',
                                    isCountry
                                        ? 'bg-primary/55 ring-primary/40'
                                        : 'bg-primary shadow-lg',
                                ].join(' ')}
                            >
                                {size >= 28 && (
                                    <span className="text-[11px] font-semibold leading-none text-primary-foreground tabular-nums">
                                        {p.count}
                                    </span>
                                )}
                            </div>
                        </MapMarker>
                    );
                })}

                {selected && (
                    <MapPopup
                        longitude={selected.lng}
                        latitude={selected.lat}
                        onClose={() => setSelected(null)}
                        closeButton
                        className="min-w-44"
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{selected.label}</p>
                            <p className="text-sm text-neutral-600">
                                <span className="font-medium tabular-nums text-foreground">{selected.count}</span>{' '}
                                {selected.count === 1 ? 'visita' : 'visitas'}
                            </p>
                            {selected.kind === 'country' && (
                                <p className="text-xs text-neutral-500">Ubicación aproximada (país)</p>
                            )}
                        </div>
                    </MapPopup>
                )}
            </MapWrapper>

            {points.length === 0 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-background/90 px-4 py-2 text-sm text-neutral-600 shadow-sm">
                    Sin ubicaciones en este periodo (la geo llega por Vercel; en local no).
                </div>
            )}
        </div>
    );
}

export default AnalyticsMap;
