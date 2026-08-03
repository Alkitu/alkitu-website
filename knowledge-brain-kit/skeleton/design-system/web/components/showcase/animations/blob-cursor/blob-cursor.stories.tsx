import type { Meta, StoryObj } from '@storybook/react';
import { BlobCursor } from './blob-cursor';

const meta = {
    title: 'Showcase/Animations/Blob Cursor',
    component: BlobCursor,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        blobType: {
            control: 'select',
            options: ['circle', 'square'],
        },
        fillColor: { control: 'color' },
        innerColor: { control: 'color' },
        shadowColor: { control: 'color' },
        trailCount: { control: { type: 'range', min: 1, max: 10, step: 1 } },
        useFilter: { control: 'boolean' },
        fastDuration: { control: { type: 'range', min: 0.05, max: 1, step: 0.05 } },
        slowDuration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    }
} satisfies Meta<typeof BlobCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-background border flex flex-col items-center justify-center overflow-hidden">
            <h1 className="text-4xl lg:text-7xl font-black text-foreground z-10 pointer-events-none text-center tracking-tighter mix-blend-difference text-white">
                Gooey Hover
            </h1>
            <p className="text-muted-foreground z-10 pointer-events-none max-w-lg text-center mt-4">
                Move your mouse over this container to see the gooey SVG-filtered cursor track your movements.
            </p>

            <div className="absolute inset-0 z-0">
                <BlobCursor {...args} />
            </div>
        </div>
    ),
    args: {
        blobType: 'circle',
        fillColor: '#5227FF',
        trailCount: 3,
        sizes: [60, 125, 75],
        innerSizes: [20, 35, 25],
        innerColor: 'rgba(255,255,255,0.8)',
        opacities: [0.6, 0.6, 0.6],
        shadowColor: 'rgba(0,0,0,0.75)',
        shadowBlur: 5,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        filterStdDeviation: 30,
        useFilter: true,
        fastDuration: 0.1,
        slowDuration: 0.5,
    }
};

export const SquareVariant: Story = {
    render: (args) => (
        <div className="w-full h-[600px] relative bg-foreground border flex flex-col items-center justify-center overflow-hidden rounded-xl">
            <h1 className="text-4xl lg:text-5xl font-black text-background z-10 pointer-events-none text-center tracking-tighter">
                Square Trail
            </h1>

            <div className="absolute inset-0 z-0">
                <BlobCursor {...args} />
            </div>
        </div>
    ),
    args: {
        blobType: 'square',
        fillColor: '#10b981', // emerald-500
        trailCount: 5,
        sizes: [40, 60, 80, 60, 40],
        innerSizes: [10, 20, 30, 20, 10],
        innerColor: 'transparent',
        opacities: [0.9, 0.7, 0.5, 0.3, 0.1],
        shadowColor: 'rgba(0,0,0,0)',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        useFilter: false, // Turn off gooey filter for sharp squares
        fastDuration: 0.1,
        slowDuration: 0.8,
    }
};
