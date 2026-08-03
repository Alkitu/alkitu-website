import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrambledText } from './scrambled-text';

const meta: Meta<typeof ScrambledText> = {
    title: 'Showcase/Text Animations/Scrambled Text',
    component: ScrambledText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text that randomly scrambles its characters into symbols before settling on its content.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ScrambledText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex flex-col items-center justify-center bg-card gap-8 min-h-[300px]">
            <p className="text-sm text-muted-foreground text-center">
                {args.trigger === 'hover' ? 'Pasa el cursor por encima del texto de abajo' : 'Recarga la página para ver el efecto'}
            </p>
            <h2 className="text-6xl font-mono font-bold tracking-widest text-primary uppercase text-center cursor-pointer">
                <ScrambledText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "CYBERPUNK",
        characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;':,./<>?",
        speed: 50,
        duration: 800,
        trigger: "hover"
    },
    argTypes: {
        trigger: { control: 'radio', options: ['hover', 'mount'] },
        speed: { control: { type: 'range', min: 10, max: 200, step: 10 } },
        duration: { control: { type: 'range', min: 200, max: 2000, step: 100 } },
    }
};
