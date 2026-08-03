import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StarBorder } from './star-border';

const meta: Meta<typeof StarBorder> = {
    title: 'Showcase/Animations/Star Border',
    component: StarBorder,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "An animated star/light-ray border effect. The inner button adapts to light/dark mode automatically (white+grey border in light, dark in dark). The light rays use the `color` prop and are always visible.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof StarBorder>;

export const Default: Story = {
    render: (args) => (
        <div className="min-h-[320px] flex flex-col items-center justify-center gap-8 bg-background p-16">
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <StarBorder {...args} color="hsl(var(--primary))" speed="6s">
                    Get Started
                </StarBorder>
                <StarBorder {...args} color="#7df9ff" speed="5s">
                    Learn More
                </StarBorder>
                <StarBorder {...args} color="#ff6b6b" speed="8s">
                    Explore
                </StarBorder>
            </div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Adapts to light + dark — hover to see effect
            </p>
        </div>
    ),
    args: {
        as: 'button',
        color: 'hsl(var(--primary))',
        speed: '6s',
    },
    argTypes: {
        color: { control: 'color' },
        speed: { control: 'text' },
    }
};
