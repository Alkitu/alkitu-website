'use client';

/**
 * GeoMap — mapa público (integración de mapas).
 * Marcadores por estado (sin reclamar = color / reclamado = B&N) y ficha
 * horizontal al tocar (foto, nombre, descripción, enlace opcional, "Claimed by …").
 * NUNCA expone el enlace de claim. Sobre el módulo de mapas del DS (MapLibre/mapcn).
 * `geolocate` añade el control de ubicación (punto azul + precisión) para saber
 * cómo de cerca estás del objetivo. `bare` quita marco/bordes (uso a pantalla completa).
 */

import * as React from 'react';
import MapLibreGL from 'maplibre-gl';
import { Check, ExternalLink } from 'lucide-react';
import { MapWrapper } from '~/components/integrations/maps/map-wrapper';
import { MapMarker } from '~/components/integrations/maps/map-marker';
import { useMap } from '~/components/integrations/maps/map/map';

export type GeoMapPoint = {
    id: string;
    lat: number;
    lng: number;
    nombre: string;
    descripcion: string | null;
    enlaceUrl: string | null;
    enlaceLabel: string | null;
    fotoUrl: string | null;
    markerEmoji: string | null;
    markerIconUrl: string | null;
    claimedBy: string | null;
};

/** Emoji por defecto del marcador cuando el drop no trae PNG ni emoji propio. */
const DEFAULT_EMOJI = '🎁';

/**
 * Marcador del mapa: PNG > emoji > 🎁. Al reclamar, blanco y negro con
 * `filter: grayscale(1)` (soporte universal en móvil; dessatura igual imagen y
 * emoji) + opacidad para el look "ya conseguido".
 */
function DropMarker({ p }: { p: GeoMapPoint }) {
    const claimed = !!p.claimedBy;
    return (
        <span
            title={claimed ? `Claimed by ${p.claimedBy}` : p.nombre}
            className={`relative grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-background shadow-lg ring-2 transition-transform hover:scale-110 ${claimed ? 'ring-neutral-400' : 'ring-primary'}`}
        >
            <span
                className="grid place-items-center"
                style={claimed ? { filter: 'grayscale(1)', opacity: 0.6 } : undefined}
            >
                {p.markerIconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.markerIconUrl} alt="" className="h-6 w-6 object-contain" />
                ) : (
                    <span className="text-[20px] leading-none">{p.markerEmoji || DEFAULT_EMOJI}</span>
                )}
            </span>
            {claimed && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-neutral-500 ring-2 ring-background">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
            )}
        </span>
    );
}

export interface GeoMapProps {
    points: GeoMapPoint[];
    className?: string;
    /** Marco redondeado + borde (embebido). `false` = a sangre (pantalla completa). */
    bare?: boolean;
    /** Controles de zoom del DS (por defecto true). */
    nav?: boolean;
    /** Botón de geolocalización (punto azul + precisión, seguimiento). */
    geolocate?: boolean;
    labels?: { sinReclamar?: string; cerrar?: string; vacio?: string; verMas?: string; cargando?: string };
}

/** Encaja la vista a los drops al cargar (vía useMap). */
function FitBounds({ points }: { points: GeoMapPoint[] }) {
    const { map, isLoaded } = useMap();
    React.useEffect(() => {
        if (!map || !isLoaded || points.length === 0) return;
        if (points.length === 1) {
            map.easeTo({ center: [points[0].lng, points[0].lat], zoom: 14, duration: 0 });
            return;
        }
        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        for (const p of points) {
            minLng = Math.min(minLng, p.lng);
            maxLng = Math.max(maxLng, p.lng);
            minLat = Math.min(minLat, p.lat);
            maxLat = Math.max(maxLat, p.lat);
        }
        map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 64, maxZoom: 15, duration: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded]);
    return null;
}

/** Control nativo de MapLibre: punto de ubicación + círculo de precisión + seguimiento. */
function Geolocate() {
    const { map, isLoaded } = useMap();
    React.useEffect(() => {
        if (!map || !isLoaded) return;
        const ctrl = new MapLibreGL.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserLocation: true,
            showAccuracyCircle: true,
        });
        map.addControl(ctrl, 'bottom-right');
        return () => {
            try {
                map.removeControl(ctrl);
            } catch {
                /* ya retirado */
            }
        };
    }, [map, isLoaded]);
    return null;
}

export function GeoMap({ points, className, bare = false, nav = true, geolocate = false, labels }: GeoMapProps) {
    const [mounted, setMounted] = React.useState(false);
    const [selected, setSelected] = React.useState<GeoMapPoint | null>(null);
    React.useEffect(() => setMounted(true), []);

    const sinReclamar = labels?.sinReclamar ?? 'Sin reclamar · ve a encontrarlo';
    const cerrar = labels?.cerrar ?? 'Cerrar';
    const vacio = labels?.vacio ?? 'Aún no hay drops activos. Vuelve pronto.';
    const verMas = labels?.verMas ?? 'Ver más';
    const cargando = labels?.cargando ?? 'Cargando mapa…';

    const shell = bare ? '' : 'rounded-2xl border border-neutral-300/70';

    if (!mounted) {
        return (
            <div className={`grid place-items-center bg-muted ${shell} ${className ?? ''}`}>
                <span className="text-sm text-neutral-600">{cargando}</span>
            </div>
        );
    }

    const center =
        points.length > 0
            ? { longitude: points[0].lng, latitude: points[0].lat, zoom: 11 }
            : { longitude: 8, latitude: 30, zoom: 1.4 };

    return (
        <div className={`geo-map-root relative overflow-hidden ${shell} ${className ?? ''}`}>
            {geolocate && (
                // Agranda el control de ubicación de MapLibre (más tap-area, más visible en móvil).
                <style>{`
                    .geo-map-root .maplibregl-ctrl-bottom-right { margin-bottom: 8px; }
                    .geo-map-root .maplibregl-ctrl-group button.maplibregl-ctrl-geolocate { width: 44px; height: 44px; }
                    .geo-map-root .maplibregl-ctrl-group button.maplibregl-ctrl-geolocate .maplibregl-ctrl-icon { transform: scale(1.35); }
                `}</style>
            )}
            <MapWrapper showNavigation={nav} initialViewState={center} className="h-full w-full">
                <FitBounds points={points} />
                {geolocate && <Geolocate />}
                {points.map((p) => (
                    <MapMarker key={p.id} longitude={p.lng} latitude={p.lat} onClick={() => setSelected(p)}>
                        <DropMarker p={p} />
                    </MapMarker>
                ))}
            </MapWrapper>

            {selected && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 sm:p-4">
                    <div className="pointer-events-auto flex w-full max-w-2xl gap-3 rounded-2xl border border-neutral-200 bg-background p-3 shadow-2xl">
                        {selected.fotoUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={selected.fotoUrl}
                                alt={selected.nombre}
                                className="h-24 w-24 flex-none rounded-xl bg-neutral-100 object-cover sm:h-28 sm:w-28"
                                style={selected.claimedBy ? { filter: 'grayscale(1)', opacity: 0.7 } : undefined}
                            />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                                    {selected.nombre}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    aria-label={cerrar}
                                    className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-lg leading-none text-neutral-500 hover:text-foreground"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                                <span
                                    aria-hidden
                                    className={`inline-block h-2 w-2 rounded-full ${selected.claimedBy ? 'bg-green-600' : 'bg-amber-500'}`}
                                />
                                {selected.claimedBy ? (
                                    <span className="text-green-700">Claimed by {selected.claimedBy}</span>
                                ) : (
                                    <span className="text-amber-700">{sinReclamar}</span>
                                )}
                            </p>
                            {selected.descripcion && (
                                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-neutral-600 sm:line-clamp-3">
                                    {selected.descripcion}
                                </p>
                            )}
                            {selected.enlaceUrl && (
                                <a
                                    href={selected.enlaceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
                                >
                                    {selected.enlaceLabel || verMas}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {points.length === 0 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-background/90 px-4 py-2 text-sm text-neutral-600 shadow-sm">
                    {vacio}
                </div>
            )}
        </div>
    );
}

export default GeoMap;
