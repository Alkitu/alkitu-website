import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ElectricBorder from './electric-border';

const meta: Meta<typeof ElectricBorder> = {
    title: 'Showcase/Animations/Electric Border',
    component: ElectricBorder,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "Canvas-based animated electric border using 2D octaved noise. Best appreciated on dark backgrounds where the glow is fully visible.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ElectricBorder>;

export const Default: Story = {
    render: (args) => (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-12 bg-background p-16 rounded-xl">
            <ElectricBorder {...args}>
                <div className="px-10 py-8 flex flex-col items-center gap-2">
                    <h3 className="font-bold text-foreground text-xl tracking-tight">Premium Plan</h3>
                    <p className="text-muted-foreground text-sm">$29 / month</p>
                    <button className="mt-4 px-6 py-2 bg-background text-foreground rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors">
                        Get Started
                    </button>
                </div>
            </ElectricBorder>
        </div>
    ),
    args: {
        color: '#7df9ff',
        speed: 1,
        chaos: 0.12,
        borderRadius: 24,
    },
    argTypes: {
        color: { control: 'color' },
        speed: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        chaos: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
        borderRadius: { control: { type: 'range', min: 0, max: 60, step: 2 } },
    }
};
