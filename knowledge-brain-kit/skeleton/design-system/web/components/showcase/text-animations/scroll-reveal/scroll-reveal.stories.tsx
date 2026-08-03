import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollReveal } from './scroll-reveal';

const meta: Meta<typeof ScrollReveal> = {
    title: 'Showcase/Text Animations/Scroll Reveal',
    component: ScrollReveal,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Paragraph text that sequentially reveals its dim characters as you scroll through it.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ScrollReveal>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col border border-border rounded-xl bg-card overflow-x-hidden p-12 min-h-[800px]">
            <div className="h-[30vh] text-center text-muted-foreground">
                Sigue haciendo scroll para revelar la frase.
            </div>
            <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-4xl mx-auto py-32 leading-relaxed">
                <ScrollReveal {...args} />
            </p>
            <div className="h-[40vh]" />
        </div>
    ),
    args: {
        text: "This is a demonstration of the Scroll Reveal component. As you scroll down the page, each character smoothly transitions from a dimmed state to full opacity, creating an engaging reading experience perfectly suited for landing pages and storytelling.",
        baseOpacity: 0.15
    },
    argTypes: {
        baseOpacity: { control: { type: 'range', min: 0, max: 0.5, step: 0.05 } },
    }
};
