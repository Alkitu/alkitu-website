import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import FadeContent from './fade-content';

const meta: Meta<typeof FadeContent> = {
    title: 'Showcase/Animations/Fade Content',
    component: FadeContent,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Fades in (and optionally blurs in) children using GSAP autoAlpha + ScrollTrigger. Fully theme-adaptive.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof FadeContent>;

export const Default: Story = {
    render: (args) => (
        <div className="p-8 min-h-[600px] flex flex-col items-center justify-center gap-8 bg-background">
            <p className="text-muted-foreground text-sm tracking-widest uppercase font-medium">Scroll down to trigger ↓</p>
            <FadeContent {...args} className="w-full max-w-lg">
                <div className="p-8 bg-card border border-border rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-3 text-card-foreground">Smooth Fade In</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        This block gently transitions into view using GSAP <code className="text-primary font-mono text-xs bg-muted px-1 py-0.5 rounded">autoAlpha</code> & optional blur filter.
                    </p>
                </div>
            </FadeContent>
            <FadeContent {...args} blur delay={300} className="w-full max-w-lg">
                <div className="p-8 bg-card border border-border rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-3 text-card-foreground">With Blur Effect</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        This one has <code className="text-primary font-mono text-xs bg-muted px-1 py-0.5 rounded">blur=true</code> — it fades in while the blur resolves.
                    </p>
                </div>
            </FadeContent>
        </div>
    ),
    args: {
        blur: false,
        duration: 1000,
        ease: 'power2.out',
        initialOpacity: 0,
        delay: 0,
        threshold: 0.1,
    },
    argTypes: {
        blur: { control: 'boolean' },
        duration: { control: { type: 'range', min: 100, max: 3000, step: 100 }, description: 'Duration in ms (>10) or seconds (≤10)' },
        delay: { control: { type: 'range', min: 0, max: 2000, step: 100 } },
        initialOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
        ease: { control: 'text' },
    }
};
