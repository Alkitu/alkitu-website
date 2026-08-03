'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Play, Map as MapIcon, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/primitives/button';
import { MapWrapper, MapWrapperProps } from './map-wrapper';

// Gran Vía, Madrid — street-level default
const GRAN_VIA: Required<{ latitude: number; longitude: number; zoom: number }> = {
    latitude: 40.4200,
    longitude: -3.7038,
    zoom: 16,
};

const DEFAULT_LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DEFAULT_DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export interface MapPosterProps extends MapWrapperProps {
    posterAlt?: string;
    /** Center used for both the capture and the live map. Defaults to Gran Vía, Madrid zoom 16. */
    center?: { latitude: number; longitude: number; zoom?: number };
    className?: string;
}

/**
 * MapPoster — static image preview of a map (no interaction needed until the user clicks).
 *
 * - On mount, renders maplibre-gl twice in a hidden off-screen container:
 *   once with the LIGHT style, once with the DARK style.
 * - Stores both data URLs and displays the correct one based on the active theme.
 * - No Puppeteer, no server, no API key. Pure client-side canvas capture.
 * - Clicking "Activate Map" transitions to a full interactive MapWrapper.
 */
async function captureMapSnapshot(
    style: string,
    center: { latitude: number; longitude: number; zoom: number },
): Promise<string | null> {
    const maplibregl = (await import('maplibre-gl')).default;

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1400px;height:700px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(container);

    let mapInstance: any = null;

    try {
        mapInstance = new maplibregl.Map({
            container,
            style,
            center: [center.longitude, center.latitude],
            zoom: center.zoom,
            interactive: false,
            attributionControl: false,
            preserveDrawingBuffer: true,
            fadeDuration: 0,
        } as any);

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Map idle timeout')), 18000);
            mapInstance.once('idle', () => {
                clearTimeout(timeout);
                resolve();
            });
        });

        // Extra render frame to ensure all tiles are painted
        await new Promise(r => setTimeout(r, 600));

        const canvas = mapInstance.getCanvas();
        return canvas.toDataURL('image/jpeg', 0.93);
    } catch (err: any) {
        console.warn('[MapPoster] Snapshot failed:', err?.message);
        return null;
    } finally {
        mapInstance?.remove();
        if (document.body.contains(container)) document.body.removeChild(container);
    }
}

function getDocumentIsDark(): boolean {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
}

export const MapPoster: React.FC<MapPosterProps> = ({
    posterAlt = 'Map preview',
    center,
    className,
    lightStyle = DEFAULT_LIGHT_STYLE,
    darkStyle = DEFAULT_DARK_STYLE,
    showNavigation,
    children,
    ...wrapperProps
}) => {
    const resolvedCenter = {
        latitude: center?.latitude ?? GRAN_VIA.latitude,
        longitude: center?.longitude ?? GRAN_VIA.longitude,
        zoom: center?.zoom ?? GRAN_VIA.zoom,
    };

    const [isActive, setIsActive] = useState(false);
    const [lightSnapshot, setLightSnapshot] = useState<string | null>(null);
    const [darkSnapshot, setDarkSnapshot] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isDark, setIsDark] = useState(getDocumentIsDark);

    // Track theme via MutationObserver (works in Storybook & Next.js)
    useEffect(() => {
        const check = () => setIsDark(getDocumentIsDark());
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Capture both light and dark snapshots on mount
    useEffect(() => {
        if (isActive) return;

        let cancelled = false;

        const run = async () => {
            setIsCapturing(true);
            try {
                const [light, dark] = await Promise.all([
                    captureMapSnapshot(lightStyle, resolvedCenter),
                    captureMapSnapshot(darkStyle, resolvedCenter),
                ]);
                if (!cancelled) {
                    setLightSnapshot(light);
                    setDarkSnapshot(dark);
                }
            } finally {
                if (!cancelled) setIsCapturing(false);
            }
        };

        run();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeSnapshot = isDark ? darkSnapshot : lightSnapshot;

    if (isActive) {
        return (
            <MapWrapper
                className={className}
                initialViewState={resolvedCenter}
                lightStyle={lightStyle}
                darkStyle={darkStyle}
                showNavigation={showNavigation}
                {...wrapperProps}
            >
                {children}
            </MapWrapper>
        );
    }

    return (
        <div className={cn('relative w-full h-[500px] overflow-hidden rounded-xl border border-border bg-muted', className)}>
            {/* Poster image */}
            {activeSnapshot ? (
                <img
                    src={activeSnapshot}
                    alt={posterAlt}
                    className="w-full h-full object-cover"
                    style={{ transition: 'opacity 0.4s ease' }}
                />
            ) : isCapturing ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 size={32} className="animate-spin text-primary" />
                        <span className="text-sm font-medium">Generating map previews…</span>
                        <span className="text-xs text-muted-foreground/70">Capturing light &amp; dark mode</span>
                    </div>
                </div>
            ) : (
                /* No center / capture failed — show gradient placeholder */
                <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute inset-0"
                        style={{
                            background: isDark
                                ? 'linear-gradient(135deg, #0a0a1a 0%, #0f172a 40%, #1e1b4b 100%)'
                                : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #bfdbfe 100%)',
                        }}
                    />
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'linear-gradient(rgba(59,130,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.6) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_60px_20px_hsl(var(--primary)/0.5)]" />
                    </div>
                </div>
            )}

            {/* Scrim */}
            <div className={cn('absolute inset-0 transition-opacity', activeSnapshot ? 'bg-black/20' : 'bg-black/40')} />

            {/* Activate button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Button
                    onClick={() => setIsActive(true)}
                    disabled={isCapturing}
                    loading={isCapturing}
                    size="lg"
                    iconLeft={!isCapturing ? <Play size={18} fill="currentColor" /> : undefined}
                    className="shadow-2xl backdrop-blur-md"
                >
                    {isCapturing ? 'Loading previews…' : 'Activate Map'}
                </Button>
                <span className="text-white/70 text-xs flex items-center gap-1">
                    <MapIcon size={11} />
                    Interactive map loads on demand · Gran Vía, Madrid
                </span>
            </div>
        </div>
    );
};

export default MapPoster;
