import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import TargetCursor from './target-cursor';

const meta: Meta<typeof TargetCursor> = {
    title: 'Showcase/Animations/Target Cursor',
    component: TargetCursor,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "GSAP custom cursor with L-shaped corner brackets that snap to `.cursor-target` elements. Spinning idle, parallax brackets, click scale. Desktop-only. Uses `mix-blend-mode: difference` so it's visible on both light and dark backgrounds.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TargetCursor>;

export const Default: Story = {
    render: (args) => (
        <div className="relative w-full min-h-screen bg-background flex flex-col items-center justify-center gap-12 p-16">
            <TargetCursor {...args} />

            <div className="text-center">
                <h1 className="text-4xl font-black text-foreground tracking-tight">Custom Cursor</h1>
                <p className="text-muted-foreground text-sm mt-2">Hover the cards below to see the brackets snap</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
                {[
                    { label: 'Button', icon: '✦' },
                    { label: 'Card', icon: '◆' },
                    { label: 'Link', icon: '→' },
                    { label: 'Icon', icon: '⬡' },
                ].map(({ label, icon }) => (
                    <div
                        key={label}
                        className="cursor-target px-8 py-5 bg-card text-card-foreground rounded-xl border border-border font-semibold shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                    >
                        <span className="text-primary">{icon}</span>
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <p className="text-muted-foreground/50 text-xs">
                Note: mix-blend-mode: difference — cursor appears white on dark, black on light
            </p>
        </div>
    ),
    args: {
        targetSelector: '.cursor-target',
        spinDuration: 2,
        hideDefaultCursor: true,
        hoverDuration: 0.2,
        parallaxOn: true,
    },
    argTypes: {
        spinDuration: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        hoverDuration: { control: { type: 'range', min: 0.05, max: 1, step: 0.05 } },
        hideDefaultCursor: { control: 'boolean' },
        parallaxOn: { control: 'boolean' },
        targetSelector: { control: 'text' },
    }
};
