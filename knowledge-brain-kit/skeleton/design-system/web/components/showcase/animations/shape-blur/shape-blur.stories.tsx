import type { Meta, StoryObj } from '@storybook/react';
import { ShapeBlur } from './shape-blur';

const meta = {
    title: 'Showcase/Animations/Shape Blur',
    component: ShapeBlur,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        variation: {
            control: 'select',
            options: [0, 1, 2, 3],
            description: 'The shape type (0: Round Rect, 1: Circle Filled, 2: Circle Outline, 3: Triangle Filled)',
        },
        shapeSize: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        roundness: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        borderSize: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
        circleSize: { control: { type: 'range', min: 0.01, max: 1, step: 0.05 } },
        circleEdge: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    }
} satisfies Meta<typeof ShapeBlur>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ShapeBlur uses WebGL to draw a primitive shape that acts as a mask, 
 * revealing itself fully when the mouse approaches. We use it combined with 
 * a backdrop blur container to reveal clear background underneath the pointer.
 */
export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-foreground/5 flex items-center justify-center overflow-hidden">
            {/* Background elements to blur over */}
            <div className="absolute inset-0 flex items-center justify-center gap-10 opacity-30 pointer-events-none">
                <div className="w-64 h-64 bg-primary rounded-full mix-blend-multiply blur-3xl animate-pulse" />
                <div className="w-64 h-64 bg-chart-1 rounded-full mix-blend-multiply blur-3xl animate-pulse delay-1000" />
                <div className="w-64 h-64 bg-chart-2 rounded-full mix-blend-multiply blur-3xl animate-pulse delay-[2000ms]" />
            </div>

            {/* A wrapper that applies backdrop-filter and uses the WebGL canvas as a CSS mask (the component doesn't do it itself out of the box, but we can do it via CSS if we want the "blur" effect, or just let it draw white on top of deep backgrounds). 
               React Bits usually uses the exact component as provided: it literally just renders a white SVG-like shape that fades with distance.
               Wait, "ShapeBlur" means it RENDERS a shape that IS blurred at the edges depending on mouse distance! 
               It doesn't apply a CSS backdrop-filter to the background. 
               Let's just show it normally on a dark background.
            */}
            <div className="w-full max-w-2xl aspect-video rounded-3xl relative overflow-hidden bg-background shadow-xl border p-12 flex flex-col items-center justify-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-center tracking-tight text-white z-10 pointer-events-none mix-blend-difference">
                    Shape Blur Effect
                </h1>

                {/* Overlay the shape blur */}
                <div className="absolute inset-0 z-0 mix-blend-exclusion">
                    <ShapeBlur {...args} />
                </div>
            </div>
        </div>
    ),
    args: {
        variation: 0,
        shapeSize: 1.2,
        roundness: 0.4,
        borderSize: 0.05,
        circleSize: 0.3,
        circleEdge: 0.5,
        pixelRatioProp: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
    },
};

export const MultiShapes: Story = {
    render: () => (
        <div className="w-full h-screen relative bg-foreground flex flex-col md:flex-row items-center justify-center gap-8 p-12 overflow-hidden">
            <div className="w-64 h-64 relative bg-background/5 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 shrink-0 mix-blend-exclusion">
                <ShapeBlur variation={0} shapeSize={1.5} borderSize={0.08} />
            </div>

            <div className="w-64 h-64 relative bg-background/5 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 shrink-0 mix-blend-exclusion">
                <ShapeBlur variation={1} />
            </div>

            <div className="w-64 h-64 relative bg-background/5 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 shrink-0 mix-blend-exclusion">
                <ShapeBlur variation={2} />
            </div>

            <div className="w-64 h-64 relative bg-background/5 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 shrink-0 mix-blend-exclusion">
                <ShapeBlur variation={3} />
            </div>
        </div>
    )
};
