import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TrueFocus } from './true-focus';

const meta: Meta<typeof TrueFocus> = {
    title: 'Showcase/Text Animations/True Focus',
    component: TrueFocus,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text that blurs unfocused words and highlights the focused word.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TrueFocus>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex flex-col items-center justify-center bg-card gap-4 min-h-[300px]">
            <p className="text-sm text-muted-foreground mb-4">Pasa el ratón por encima de las palabras para enfocarlas</p>
            <TrueFocus {...args} />
        </div>
    ),
    args: {
        sentence: "Enfoca tu atención en lo que realmente importa",
        manualMode: false,
        blurAmount: 5,
        focusColor: "hsl(var(--primary))",
    }
};
