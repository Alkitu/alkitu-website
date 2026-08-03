import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FallingText } from './falling-text';

const meta: Meta<typeof FallingText> = {
    title: 'Showcase/Text Animations/Falling Text',
    component: FallingText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Characters drop into place from above with a physics-based spring bounce.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof FallingText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px] overflow-hidden">
            <h2 className="text-6xl font-black tracking-tighter text-foreground uppercase text-center">
                <FallingText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "GRAVITY",
        dropDistance: 150,
        staggerDelay: 0.1,
        delay: 0.5
    },
    argTypes: {
        dropDistance: { control: { type: 'range', min: 50, max: 500, step: 10 } },
        staggerDelay: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
        delay: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    }
};
