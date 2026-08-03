import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollVelocity } from './scroll-velocity';

const meta: Meta<typeof ScrollVelocity> = {
    title: 'Showcase/Text Animations/Scroll Velocity',
    component: ScrollVelocity,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "A marquee text effect that dynamically increases speed based on scroll velocity.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ScrollVelocity>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col border border-border rounded-xl bg-card overflow-x-hidden min-h-[500px]">
            <div className="p-8 pb-32">
                <p className="text-muted-foreground mb-4">¡Desplázate hacia abajo/arriba para ver cómo el texto acelera según tu velocidad de scroll!</p>
                <div className="h-[20vh]" />
            </div>

            <h2 className="text-7xl font-black tracking-tighter text-foreground uppercase pt-32 pb-64 overflow-hidden w-full m-0">
                <ScrollVelocity {...args} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-3" />
            </h2>

            <div className="h-[50vh]" />
        </div>
    ),
    args: {
        text: "SCROLL VELOCITY COMPONENT • UI DESIGN SYSTEM • ",
        baseVelocity: -2
    },
    argTypes: {
        baseVelocity: { control: { type: 'range', min: -10, max: 10, step: 1 } },
    }
};
