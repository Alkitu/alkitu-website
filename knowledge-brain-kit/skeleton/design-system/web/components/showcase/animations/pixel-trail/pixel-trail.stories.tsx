import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PixelTrail from './pixel-trail';

const meta: Meta<typeof PixelTrail> = {
    title: 'Showcase/Animations/Pixel Trail',
    component: PixelTrail,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "@react-three/drei based Pixel Trail with optional Gooey SVG filter.",
            },
        },
    },
};
export default meta;
type Story = StoryObj<typeof PixelTrail>;

export const Default: Story = {
    render: (args) => (
        <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <h1 className="text-foreground text-4xl font-bold mix-blend-difference text-white">Move Mouse</h1>
            </div>
            <PixelTrail {...args} />
        </div>
    ),
    args: {
        gridSize: 60,
        trailSize: 0.1,
        maxAge: 250,
        interpolate: 5,
        color: "#5227FF",
        gooeyFilter: { id: "custom-goo-filter", strength: 2 },
    },
    argTypes: {
        color: { control: 'color' },
        gridSize: { control: { type: 'range', min: 10, max: 200, step: 10 } },
        trailSize: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
        maxAge: { control: { type: 'range', min: 50, max: 1000, step: 50 } },
    }
};
