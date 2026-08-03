'use client';

/**
 * MapWrapper — a thin shim over the official @mapcn/map component.
 * 
 * Delegates all dark mode logic to the official Map component's built-in
 * MutationObserver + setStyle() mechanism, which correctly handles theme 
 * switching in both Next.js AND Storybook contexts.
 */

import * as React from 'react';
import {
    Map,
    MapControls,
} from '~/components/integrations/maps/map/map';
import { cn } from '~/lib/utils';

export interface MapWrapperProps {
    /** Light mode map style URL */
    lightStyle?: string;
    /** Dark mode map style URL */
    darkStyle?: string;
    /** Whether to show the official MapCN navigation controls */
    showNavigation?: boolean;
    /** Initial viewport: { longitude, latitude, zoom, bearing?, pitch? } */
    initialViewState?: {
        longitude: number;
        latitude: number;
        zoom?: number;
        bearing?: number;
        pitch?: number;
    };
    className?: string;
    children?: React.ReactNode;
    /** Pass-through click handler for the map container */
    onClick?: (e: any) => void;
    /** Forwarded ref to the underlying MapLibre.Map instance */
    ref?: React.Ref<any>;
}

const DEFAULT_LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DEFAULT_DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const MapWrapper = React.forwardRef<any, MapWrapperProps>(function MapWrapper(
    {
        lightStyle = DEFAULT_LIGHT_STYLE,
        darkStyle = DEFAULT_DARK_STYLE,
        showNavigation = true,
        initialViewState,
        className,
        children,
        onClick,
    },
    ref
) {
    // Convert our initialViewState to MapCN's viewport/center/zoom props
    const mapProps: Record<string, any> = {};
    if (initialViewState) {
        mapProps.center = [initialViewState.longitude, initialViewState.latitude] as [number, number];
        if (initialViewState.zoom !== undefined) mapProps.zoom = initialViewState.zoom;
        if (initialViewState.bearing !== undefined) mapProps.bearing = initialViewState.bearing;
        if (initialViewState.pitch !== undefined) mapProps.pitch = initialViewState.pitch;
    }

    return (
        <div
            className={cn('font-sans w-full h-[500px] rounded-xl overflow-hidden border border-border', className)}
            onClick={onClick}
        >
            <Map
                ref={ref}
                styles={{
                    light: lightStyle,
                    dark: darkStyle,
                }}
                className="w-full h-full"
                {...mapProps}
            >
                {showNavigation && (
                    <MapControls
                        position="top-right"
                        showZoom
                        showCompass={false}
                    />
                )}
                {children}
            </Map>
        </div>
    );
});

MapWrapper.displayName = 'MapWrapper';

export default MapWrapper;
