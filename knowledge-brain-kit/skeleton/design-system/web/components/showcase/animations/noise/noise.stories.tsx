import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Noise from './noise';

const meta: Meta<typeof Noise> = {
    title: 'Showcase/Animations/Noise',
    component: Noise,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Canvas 2D random noise grain effect. Very lightweight.",
            },
        },
    },
};
export default meta;
type Story = StoryObj<typeof Noise>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center">
            {/* The noise creates a textured overlay */}
            <Noise {...args} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <h1 className="text-foreground text-7xl font-black tracking-tighter opacity-80">GRUNGE</h1>
            </div>
        </div>
    ),
    args: {
        patternSize: 250,
        patternScaleX: 2,
        patternScaleY: 2,
        patternRefreshInterval: 2,
        patternAlpha: 45,
    },
    argTypes: {
        patternSize: { control: { type: 'range', min: 50, max: 1000, step: 10 } },
        patternScaleX: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
        patternScaleY: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
        patternRefreshInterval: { control: { type: 'range', min: 1, max: 10, step: 1 } },
        patternAlpha: { control: { type: 'range', min: 1, max: 255, step: 1 } },
    }
};
