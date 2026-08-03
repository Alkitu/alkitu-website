'use client';

import * as React from 'react';
import { MapPopup as McnMapPopup } from '~/components/integrations/maps/map/map';
import type { PopupOptions } from 'maplibre-gl';

export interface MapPopupProps extends Omit<PopupOptions, 'className'> {
    longitude: number;
    latitude: number;
    children?: React.ReactNode;
    onClose?: () => void;
    className?: string;
    closeButton?: boolean;
}

export const MapPopup: React.FC<MapPopupProps> = ({
    longitude,
    latitude,
    children,
    onClose,
    className,
    closeButton = false,
    closeOnClick = false,    // default false so the popup stays open on map click
    focusAfterOpen = false,  // prevent scroll jumps in Storybook
    ...rest
}) => {
    return (
        <McnMapPopup
            longitude={longitude}
            latitude={latitude}
            onClose={onClose}
            className={className}
            closeButton={closeButton}
            closeOnClick={closeOnClick}
            focusAfterOpen={focusAfterOpen}
            {...rest}
        >
            {children}
        </McnMapPopup>
    );
};

export default MapPopup;
