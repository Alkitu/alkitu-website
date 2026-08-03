import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AnimatedContent from './animated-content';

const meta: Meta<typeof AnimatedContent> = {
    title: 'Showcase/Animations/Animated Content',
    component: AnimatedContent,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Animates children on viewport entry using GSAP + ScrollTrigger. Supports vertical/horizontal slide-in, opacity, scale, and optional disappear-after. Fully theme-adaptive.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof AnimatedContent>;

export const Default: Story = {
    render: (args) => (
        <div className="p-8 min-h-[600px] flex flex-col items-center justify-center gap-8 bg-background">
            <p className="text-muted-foreground text-sm tracking-widest uppercase font-medium">Scroll down to trigger ↓</p>
            <AnimatedContent {...args} className="w-full max-w-sm">
                <div className="flex flex-col items-center gap-4 p-8 rounded-xl border border-border bg-card shadow-lg">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                        <span className="text-primary-foreground font-black text-2xl">✦</span>
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">Slide Entry</h3>
                    <p className="text-muted-foreground text-center text-sm leading-relaxed">
                        This element slides in from the bottom using GSAP power easing with ScrollTrigger.
                    </p>
                </div>
            </AnimatedContent>
            <AnimatedContent {...args} delay={0.3} className="w-full max-w-sm">
                <div className="flex flex-col items-center gap-4 p-8 rounded-xl border border-border bg-card shadow-lg">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center">
                        <span className="text-secondary-foreground font-black text-2xl">◆</span>
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">Staggered</h3>
                    <p className="text-muted-foreground text-center text-sm leading-relaxed">
                        A second card that appears with a slight delay for a staggered effect.
                    </p>
                </div>
            </AnimatedContent>
        </div>
    ),
    args: {
        distance: 80,
        direction: 'vertical',
        reverse: false,
        duration: 0.8,
        ease: 'power3.out',
        initialOpacity: 0,
        animateOpacity: true,
        scale: 1,
        threshold: 0.1,
        delay: 0,
    },
    argTypes: {
        direction: { control: 'select', options: ['vertical', 'horizontal'] },
        reverse: { control: 'boolean' },
        animateOpacity: { control: 'boolean' },
        distance: { control: { type: 'range', min: 0, max: 500, step: 10 } },
        duration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        scale: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    }
};
