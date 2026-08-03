import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import GlareHover from './glare-hover';

const meta: Meta<typeof GlareHover> = {
    title: 'Showcase/Animations/Glare Hover',
    component: GlareHover,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "CSS-only glare sweep on hover using custom properties. Best on dark backgrounds where the white glare is most visible.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof GlareHover>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col items-center justify-center gap-8 bg-background p-16 min-h-[400px] rounded-xl">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">Hover the cards</p>
            <div className="flex flex-wrap gap-6 items-center justify-center">
                <GlareHover {...args}>
                    <div className="flex flex-col items-center gap-3 p-2">
                        <div className="text-3xl text-foreground">✦</div>
                        <h2 className="text-lg font-black text-foreground">Hover Me</h2>
                        <p className="text-muted-foreground text-xs max-w-[160px] text-center">A glare sweeps across on hover</p>
                    </div>
                </GlareHover>
                <GlareHover {...args} glareColor="#a78bfa" glareOpacity={0.6} glareAngle={30}>
                    <div className="flex flex-col items-center gap-3 p-2">
                        <div className="text-3xl text-foreground">◆</div>
                        <h2 className="text-lg font-black text-foreground">Violet</h2>
                        <p className="text-muted-foreground text-xs max-w-[160px] text-center">Colored glare variant</p>
                    </div>
                </GlareHover>
            </div>
        </div>
    ),
    args: {
        width: '220px',
        height: '180px',
        background: '#000',
        borderRadius: '16px',
        borderColor: 'var(--border)',
        glareColor: '#ffffff',
        glareOpacity: 0.4,
        glareAngle: -30,
        glareSize: 300,
        transitionDuration: 800,
        playOnce: false,
    },
    argTypes: {
        glareColor: { control: 'color' },
        background: { control: 'color' },
        borderColor: { control: 'color' },
        glareOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        glareAngle: { control: { type: 'range', min: -90, max: 90, step: 5 } },
        glareSize: { control: { type: 'range', min: 50, max: 500, step: 10 } },
        transitionDuration: { control: { type: 'range', min: 100, max: 2000, step: 50 } },
        playOnce: { control: 'boolean' },
    }
};
