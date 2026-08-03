import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TiltedCard } from './tilted-card';

const meta = {
    title: 'Showcase/Bit Components/Tilted Card',
    component: TiltedCard,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof TiltedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        imageSrc: '/gallery/landscape-02-forest.png',
        altText: 'A beautiful photograph',
        captionText: 'Hover over me!',
        containerHeight: '400px',
        containerWidth: '400px',
        imageHeight: '400px',
        imageWidth: '400px',
        rotateAmplitude: 12,
        scaleOnHover: 1.05,
        showMobileWarning: false,
        showTooltip: true,
        displayOverlayContent: true,
        overlayContent: (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-white bg-black/10">
                <p className="text-xl font-bold bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md">Tilted Card UI</p>
            </div>
        )
    }
};
