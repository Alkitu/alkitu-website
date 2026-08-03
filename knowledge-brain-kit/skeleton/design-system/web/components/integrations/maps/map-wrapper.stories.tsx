import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MapWrapper } from './map-wrapper';
import { MapMarker } from './map-marker';
import { MapPopup } from './map-popup';
import { MapPin, Navigation, Coffee, MapPinned } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../primitives/avatar';
// Card removed — MapPopup already provides the card-like container
import { Button } from '../../primitives/button';

const meta = {
    title: 'Integrations/Maps/Map Wrapper',
    component: MapWrapper,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        showNavigation: {
            control: 'boolean',
        },
        lightStyle: {
            control: 'text',
        },
        darkStyle: {
            control: 'text',
        },
    },
} satisfies Meta<typeof MapWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// Coordinates for testing (Madrid, Spain)
const MADRID_COORDS = { longitude: -3.703790, latitude: 40.416775 };

export const Default: Story = {
    args: {
        showNavigation: true,
        initialViewState: {
            longitude: MADRID_COORDS.longitude,
            latitude: MADRID_COORDS.latitude,
            zoom: 12,
        },
        className: 'h-[600px] w-full',
    },
};

// Interactive Example with Custom Markers and Popups
const InteractiveMapTemplate = () => {
    const [popupInfo, setPopupInfo] = useState<{ id: string; lon: number; lat: number } | null>(null);

    return (
        <MapWrapper
            showNavigation={true}
            initialViewState={{
                longitude: MADRID_COORDS.longitude,
                latitude: MADRID_COORDS.latitude,
                zoom: 13,
            }}
            className="h-[600px] w-full"
        >
            {/* Standard Primary Marker */}
            <MapMarker
                longitude={MADRID_COORDS.longitude}
                latitude={MADRID_COORDS.latitude}
                onClick={() => setPopupInfo({ id: 'center', lon: MADRID_COORDS.longitude, lat: MADRID_COORDS.latitude })}
            >
                <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                    <MapPin size={24} />
                </div>
            </MapMarker>

            {/* Avatar Marker */}
            <MapMarker
                longitude={-3.712}
                latitude={40.423}
                onClick={() => setPopupInfo({ id: 'avatar', lon: -3.712, lat: 40.423 })}
            >
                <Avatar className="w-10 h-10 border-2 border-primary shadow-xl ring-2 ring-background">
                    <AvatarImage src="/gallery/avatar-01-woman.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </MapMarker>

            {/* Coffee Shop Marker */}
            <MapMarker
                longitude={-3.695}
                latitude={40.411}
                onClick={() => setPopupInfo({ id: 'coffee', lon: -3.695, lat: 40.411 })}
            >
                <div className="bg-amber-500 text-white p-2 rounded-xl shadow-lg border-2 border-background">
                    <Coffee size={20} />
                </div>
            </MapMarker>

            {/* Custom Popups powered by internal Card components */}
            {popupInfo && (
                <MapPopup
                    longitude={popupInfo.lon}
                    latitude={popupInfo.lat}
                    onClose={() => setPopupInfo(null)}
                    className="w-64"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 font-semibold text-sm">
                            {popupInfo.id === 'coffee' ? <Coffee className="text-amber-500 w-4 h-4" /> : <MapPinned className="text-primary w-4 h-4" />}
                            {popupInfo.id === 'avatar' ? 'John Doe spotted' : popupInfo.id === 'coffee' ? 'Artisan Cafe' : 'Plaza Mayor'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {popupInfo.lat.toFixed(4)}, {popupInfo.lon.toFixed(4)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Beautiful destination found using your localized semantic Design Tokens.
                        </p>
                        <Button size="sm" fullWidth iconLeft={<Navigation className="w-4 h-4" />} onClick={() => setPopupInfo(null)}>
                            Get Directions
                        </Button>
                    </div>
                </MapPopup>
            )}
        </MapWrapper>
    );
};

export const InteractiveCards: Story = {
    args: { showNavigation: true },
    render: () => <InteractiveMapTemplate />
};
