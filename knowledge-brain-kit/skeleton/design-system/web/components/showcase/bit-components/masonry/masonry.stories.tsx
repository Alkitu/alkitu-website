import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Masonry, type MasonryItem } from './masonry';

const meta = {
    title: 'Showcase/Bit Components/Masonry',
    component: Masonry,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Masonry>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoItems: MasonryItem[] = [
    { id: '1', img: '/gallery/landscape-01-valley.png', url: '#', height: 400 },
    { id: '2', img: '/gallery/tech-01-laptop.png', url: '#', height: 600 },
    { id: '3', img: '/gallery/landscape-03-coastal.png', url: '#', height: 300 },
    { id: '4', img: '/gallery/landscape-06-desert.png', url: '#', height: 500 },
    { id: '5', img: '/gallery/landscape-04-mountain.png', url: '#', height: 350 },
    { id: '6', img: '/gallery/landscape-07-aurora.png', url: '#', height: 550 },
    { id: '7', img: '/gallery/landscape-02-forest.png', url: '#', height: 450 },
    { id: '8', img: '/gallery/landscape-05-beach.png', url: '#', height: 650 },
    { id: '9', img: '/gallery/landscape-01-valley.png', url: '#', height: 400 },
    { id: '10', img: '/gallery/landscape-03-coastal.png', url: '#', height: 500 },
];

export const Default: Story = {
    args: {
        items: demoItems,
        animateFrom: 'bottom',
        colorShiftOnHover: true,
        blurToFocus: true
    },
    render: (args) => (
        <div className="w-full flex justify-center pt-24 min-h-[1000px]">
            <div className="max-w-7xl w-full px-8 pb-48">
                <div className="mb-16 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Animated Masonry Grid</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">A responsive masonry layout with enter animations and hover effects driven by GSAP.</p>
                </div>
                <div className="min-h-[800px] w-full">
                    <Masonry {...args} />
                </div>
            </div>
        </div>
    )
};
