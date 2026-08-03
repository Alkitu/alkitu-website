'use client';

import { useMap } from '~/components/integrations/maps/map/map';
import { ZoomIn, ZoomOut, LocateFixed, RotateCcw, Maximize2, Navigation } from 'lucide-react';
import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';

export interface MapControlsPanelProps {
    homePosition?: { latitude: number; longitude: number; zoom?: number };
    className?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Controls panel that uses MapCN's useMap() to get the live map instance.
 * No external ref needed — the map is accessed directly from context.
 */
export function MapControlsPanel({
    homePosition,
    className,
    position = 'bottom-left',
}: MapControlsPanelProps) {
    const { map } = useMap();

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };

    const controls = [
        {
            label: 'Zoom In',
            icon: ZoomIn,
            action: () => map?.zoomIn({ duration: 300 }),
        },
        {
            label: 'Zoom Out',
            icon: ZoomOut,
            action: () => map?.zoomOut({ duration: 300 }),
        },
        {
            label: 'Reset North',
            icon: RotateCcw,
            action: () => map?.resetNorth({ duration: 500 }),
        },
        ...(homePosition ? [{
            label: 'Fly Home',
            icon: LocateFixed,
            action: () => map?.flyTo({
                center: [homePosition.longitude, homePosition.latitude],
                zoom: homePosition.zoom ?? 12,
                duration: 1000,
            }),
        }] : []),
        {
            label: 'Fit World',
            icon: Maximize2,
            action: () => map?.fitBounds([[-180, -85], [180, 85]], { duration: 800 }),
        },
        {
            label: 'Toggle 3D Pitch',
            icon: Navigation,
            action: () => {
                const currentPitch = map?.getPitch() ?? 0;
                map?.easeTo({ pitch: currentPitch > 0 ? 0 : 45, duration: 500 });
            },
        },
    ];

    return (
        <div className={cn('absolute z-10 flex flex-col gap-1', positionClasses[position], className)}>
            <div className="bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-1.5 flex flex-col gap-0.5">
                {controls.map((ctrl) => (
                    <Button
                        key={ctrl.label}
                        variant="ghost"
                        size="sm"
                        onClick={ctrl.action}
                        iconLeft={<ctrl.icon size={15} />}
                        className="justify-start min-w-[140px]"
                    >
                        {ctrl.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default MapControlsPanel;
