import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import MagnetLines from './magnet-lines';

const meta: Meta<typeof MagnetLines> = {
    title: 'Showcase/Animations/Magnet Lines',
    component: MagnetLines,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "A grid of bars that rotate to point at your cursor, simulating a magnetic field. Uses `acos`-based angle math and a CSS `--rotate` custom property for smooth pointer tracking. Adaptive to light/dark mode.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof MagnetLines>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col items-center justify-center gap-6 p-12 bg-background min-h-[500px]">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">Move your cursor over the grid</p>
            <MagnetLines {...args} />
        </div>
    ),
    args: {
        rows: 9,
        columns: 9,
        containerSize: '400px',
        lineColor: 'hsl(var(--foreground))',
        lineWidth: '2px',
        lineHeight: '24px',
        baseAngle: -10,
    },
    argTypes: {
        lineColor: { control: 'color' },
        rows: { control: { type: 'range', min: 3, max: 20, step: 1 } },
        columns: { control: { type: 'range', min: 3, max: 20, step: 1 } },
        lineWidth: { control: 'text' },
        lineHeight: { control: 'text' },
        baseAngle: { control: { type: 'range', min: -180, max: 180, step: 5 } },
        containerSize: { control: 'text' },
    }
};
