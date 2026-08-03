import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import OrbitImages from './orbit-images';

// Local gallery images — single source of truth is public/gallery/
const IMAGES = [
    '/gallery/landscape-01-valley.png',
    '/gallery/landscape-02-forest.png',
    '/gallery/landscape-03-coastal.png',
    '/gallery/landscape-04-mountain.png',
    '/gallery/landscape-05-beach.png',
    '/gallery/landscape-06-desert.png',
];

const meta: Meta<typeof OrbitImages> = {
    title: 'Showcase/Animations/Orbit Images',
    component: OrbitImages,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Images orbiting around a central point using `motion/react` CSS `offset-path`. Fully adaptive to light and dark backgrounds.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof OrbitImages>;

export const Ellipse: Story = {
    render: (args) => (
        <div className="w-full h-[500px] relative bg-background flex items-center justify-center overflow-hidden">
            {/* Subtle grid dot pattern — visible in both modes via CSS var */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, hsl(var(--foreground) / 0.3) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            <OrbitImages {...args} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-card border-2 border-border shadow-md flex items-center justify-center">
                    <span className="text-2xl font-black text-foreground">✦</span>
                </div>
            </div>
        </div>
    ),
    args: {
        images: IMAGES,
        shape: "ellipse",
        radiusX: 340,
        radiusY: 80,
        rotation: -8,
        duration: 30,
        itemSize: 80,
        responsive: true,
        direction: "normal",
        fill: true,
        showPath: true,
        pathColor: "hsl(var(--border))",
        paused: false,
    },
    argTypes: {
        shape: { control: 'select', options: ['ellipse', 'circle', 'square', 'rectangle', 'triangle', 'star', 'heart', 'infinity', 'wave'] },
        direction: { control: 'select', options: ['normal', 'reverse'] },
        fill: { control: 'boolean' },
        showPath: { control: 'boolean' },
        paused: { control: 'boolean' },
        duration: { control: { type: 'range', min: 5, max: 120, step: 5 } },
        itemSize: { control: { type: 'range', min: 30, max: 200, step: 10 } },
        radiusX: { control: { type: 'range', min: 50, max: 700, step: 10 } },
        radiusY: { control: { type: 'range', min: 20, max: 400, step: 10 } },
        rotation: { control: { type: 'range', min: -180, max: 180, step: 1 } },
    }
};

export const Circle: Story = {
    render: (args) => (
        <div className="w-full h-[500px] relative bg-background flex items-center justify-center overflow-hidden">
            <OrbitImages {...args} />
        </div>
    ),
    args: {
        images: IMAGES,
        shape: "circle",
        radius: 160,
        rotation: 0,
        duration: 20,
        itemSize: 60,
        responsive: true,
        fill: true,
        showPath: true,
        pathColor: "hsl(var(--border))",
    },
};
