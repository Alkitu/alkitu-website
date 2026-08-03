import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DomeGallery } from './dome-gallery';

const meta = {
    title: 'Showcase/Bit Components/Dome Gallery',
    component: DomeGallery,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof DomeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        grayscale: true,
        fit: 0.6,
        overlayBlurColor: '#000000',
    },
    render: (args) => (
        <div className="w-full h-[600px] relative bg-black">
            <DomeGallery {...args} />
        </div>
    )
};
