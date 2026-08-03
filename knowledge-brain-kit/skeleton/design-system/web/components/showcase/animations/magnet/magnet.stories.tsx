import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Magnet from './magnet';

const meta: Meta<typeof Magnet> = {
    title: 'Showcase/Animations/Magnet',
    component: Magnet,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "Wraps any element and makes it attracted to the mouse pointer when within a `padding` radius. Uses `window` mousemove + `translate3d`. No GSAP dependency — pure CSS transitions.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Magnet>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col items-center justify-center gap-12 p-16 bg-background min-h-[500px]">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">
                Move cursor near the elements — they snap toward you
            </p>

            <div className="flex flex-wrap gap-16 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Magnet {...args}>
                        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg">
                            Primary ✦
                        </button>
                    </Magnet>
                    <p className="text-muted-foreground text-xs">Button</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Magnet {...args} magnetStrength={3} padding={80}>
                        <div className="w-16 h-16 bg-card border-2 border-primary rounded-full flex items-center justify-center text-2xl shadow">
                            ⬡
                        </div>
                    </Magnet>
                    <p className="text-muted-foreground text-xs">Icon</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Magnet {...args} magnetStrength={4} padding={60}>
                        <div className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-semibold text-sm">
                            Card Element
                        </div>
                    </Magnet>
                    <p className="text-muted-foreground text-xs">Card</p>
                </div>
            </div>
        </div>
    ),
    args: {
        padding: 100,
        disabled: false,
        magnetStrength: 2,
        activeTransition: 'transform 0.3s ease-out',
        inactiveTransition: 'transform 0.5s ease-in-out',
    },
    argTypes: {
        padding: { control: { type: 'range', min: 20, max: 300, step: 10 } },
        magnetStrength: { control: { type: 'range', min: 1, max: 10, step: 0.5 } },
        disabled: { control: 'boolean' },
        activeTransition: { control: 'text' },
        inactiveTransition: { control: 'text' },
    }
};
