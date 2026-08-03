import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SplitText } from './split-text';

const meta: Meta<typeof SplitText> = {
    title: 'Showcase/Text Animations/Split Text',
    component: SplitText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Fluid character or word-based staggered reveal animation.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SplitText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <h2 className="text-4xl font-black text-center text-balance uppercase tracking-tight">
                <SplitText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "Animando cada letra con un efecto muelle hiper suave",
        splitBy: "characters",
        staggerDelay: 0.03,
    },
    argTypes: {
        splitBy: { control: 'radio', options: ['characters', 'words'] },
        staggerDelay: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
    }
};
