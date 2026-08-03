import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClickSpark from './click-spark';

const meta: Meta<typeof ClickSpark> = {
    title: 'Showcase/Animations/Click Spark',
    component: ClickSpark,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "Canvas-based RAF click sparks. Lines radiate outward from the exact click position, animating with an easing function. Wraps any content.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ClickSpark>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col items-center justify-center gap-8 p-16 bg-background min-h-[400px]">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">Click anywhere inside the card</p>
            <ClickSpark {...args}>
                <div className="w-72 h-48 bg-card border border-border rounded-xl flex flex-col items-center justify-center gap-3 select-none cursor-pointer">
                    <span className="text-4xl">✦</span>
                    <p className="text-foreground font-semibold">Click Me</p>
                    <p className="text-muted-foreground text-xs">Sparks burst at cursor position</p>
                </div>
            </ClickSpark>
            <div className="flex gap-4">
                <ClickSpark sparkColor="hsl(var(--primary))" sparkCount={10} sparkSize={14} sparkRadius={20}>
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold">
                        Primary
                    </button>
                </ClickSpark>
                <ClickSpark sparkColor="#f59e0b" sparkCount={12} sparkSize={10} sparkRadius={18} easing="ease-in-out">
                    <button className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-semibold">
                        Outline
                    </button>
                </ClickSpark>
            </div>
        </div>
    ),
    args: {
        sparkColor: 'hsl(var(--primary))',
        sparkSize: 10,
        sparkRadius: 15,
        sparkCount: 8,
        duration: 400,
        easing: 'ease-out',
        extraScale: 1.0,
    },
    argTypes: {
        sparkColor: { control: 'color' },
        sparkCount: { control: { type: 'range', min: 3, max: 20, step: 1 } },
        sparkSize: { control: { type: 'range', min: 4, max: 40, step: 2 } },
        sparkRadius: { control: { type: 'range', min: 5, max: 60, step: 5 } },
        duration: { control: { type: 'range', min: 100, max: 1500, step: 50 } },
        easing: { control: 'select', options: ['linear', 'ease-in', 'ease-out', 'ease-in-out'] },
        extraScale: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
    }
};
