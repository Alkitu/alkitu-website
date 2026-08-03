import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Cubes from './cubes';

const meta: Meta<typeof Cubes> = {
    title: 'Showcase/Animations/Cubes',
    component: Cubes,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "GSAP-powered 3D Cubes grid. Auto-animates a ripple or responds to cursor/click.",
            },
        },
    },
};
export default meta;
type Story = StoryObj<typeof Cubes>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full min-h-[600px] bg-background flex items-center justify-center p-8">
            <div className="w-full max-w-[500px]">
                <Cubes {...args} />
            </div>
        </div>
    ),
    args: {
        gridSize: 8,
        cubeSize: undefined, // Let it use 1fr automatically
        maxAngle: 45,
        radius: 3,
        borderStyle: "1px solid var(--color-muted-foreground)",
        faceColor: "var(--color-card)",
        rippleColor: "var(--color-primary)",
        rippleSpeed: 1.5,
        autoAnimate: true,
        rippleOnClick: true,
    },
};
