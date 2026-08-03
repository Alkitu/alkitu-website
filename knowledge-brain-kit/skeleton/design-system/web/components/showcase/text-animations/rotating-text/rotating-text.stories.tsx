import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { RotatingText } from './rotating-text';

const meta: Meta<typeof RotatingText> = {
    title: 'Showcase/Text Animations/Rotating Text',
    component: RotatingText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text block that cycles through a set of words continuously.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof RotatingText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <h2 className="text-5xl font-black tracking-tighter text-center flex items-center gap-4">
                <span className="text-muted-foreground">Build the</span>
                <RotatingText {...args} className="text-primary" />
                <span className="text-muted-foreground">Apps</span>
            </h2>
        </div>
    ),
    args: {
        words: ["Fastest", "Smartest", "Prettiest", "Greatest"],
        duration: 2000
    }
};
