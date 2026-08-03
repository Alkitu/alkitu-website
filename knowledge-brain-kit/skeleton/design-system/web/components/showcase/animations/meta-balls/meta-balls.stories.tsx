import type { Meta, StoryObj } from '@storybook/react';
import { MetaBalls } from './meta-balls';

const meta = {
    title: 'Showcase/Animations/Meta Balls',
    component: MetaBalls,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        color: { control: 'color' },
        cursorBallColor: { control: 'color' },
        speed: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        enableMouseInteraction: { control: 'boolean' },
        hoverSmoothness: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
        animationSize: { control: { type: 'range', min: 10, max: 100, step: 1 } },
        ballCount: { control: { type: 'range', min: 1, max: 50, step: 1 } },
        clumpFactor: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        cursorBallSize: { control: { type: 'range', min: 0.1, max: 10, step: 0.1 } },
        enableTransparency: { control: 'boolean' },
    }
} satisfies Meta<typeof MetaBalls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-neutral-950 border flex flex-col items-center justify-center overflow-hidden">
            <h1 className="text-4xl lg:text-7xl font-black text-white text-center tracking-tighter mb-4 z-10 pointer-events-none">
                Meta Balls
            </h1>
            <p className="text-white/80 z-10 pointer-events-none text-center max-w-lg">
                Fluid organic metaballs powered by WebGL shaders and <b>ogl</b>. Move your mouse to attract them.
            </p>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
                <MetaBalls {...args} />
            </div>
        </div>
    ),
    args: {
        color: '#ffffff',
        cursorBallColor: '#ffffff',
        cursorBallSize: 3,
        ballCount: 15,
        animationSize: 30,
        enableMouseInteraction: true,
        enableTransparency: true,
        hoverSmoothness: 0.05,
        clumpFactor: 1,
        speed: 0.3,
    }
};

export const ColorfulVariant: Story = {
    render: (args) => (
        <div className="w-full h-[600px] relative bg-neutral-950 border overflow-hidden rounded-xl">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
                <MetaBalls {...args} />
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                <h2 className="text-5xl font-black text-white tracking-tighter mix-blend-difference">Color Pulse</h2>
            </div>
        </div>
    ),
    args: {
        color: '#3b82f6',
        cursorBallColor: '#f43f5e',
        cursorBallSize: 4,
        ballCount: 25,
        animationSize: 40,
        enableMouseInteraction: true,
        enableTransparency: true,
        hoverSmoothness: 0.1,
        clumpFactor: 1.5,
        speed: 0.6,
    }
};

