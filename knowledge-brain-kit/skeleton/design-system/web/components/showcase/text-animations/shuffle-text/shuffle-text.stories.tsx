import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ShuffleText } from './shuffle-text';

const meta: Meta<typeof ShuffleText> = {
    title: 'Showcase/Text Animations/Shuffle Text',
    component: ShuffleText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text that randomly scrambles and reorders the actual characters of the string before revealing.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ShuffleText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <h2 className="text-6xl font-black tracking-tighter text-foreground uppercase cursor-pointer">
                <ShuffleText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "ANAGRAM",
        trigger: "hover",
        duration: 600,
        iterations: 15
    },
    argTypes: {
        trigger: { control: 'radio', options: ['hover', 'mount'] },
        duration: { control: { type: 'range', min: 200, max: 2000, step: 100 } },
        iterations: { control: { type: 'range', min: 5, max: 50, step: 5 } },
    }
};
