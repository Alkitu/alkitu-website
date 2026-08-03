import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CurvedLoop } from './curved-loop';

const meta: Meta<typeof CurvedLoop> = {
    title: 'Showcase/Text Animations/Curved Loop',
    component: CurvedLoop,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A marquee-like looping text effect that follows a curved SVG path.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof CurvedLoop>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <CurvedLoop {...args} className="max-w-4xl" textColor="hsl(var(--primary))" />
        </div>
    ),
    args: {
        text: "CREATIVE ENGINEERING",
        speed: 5,
        path: "M 50,250 C 250,50 750,450 950,250",
    },
    argTypes: {
        speed: { control: { type: 'range', min: 1, max: 20, step: 1 } },
        text: { control: 'text' },
        path: { control: 'text' }
    }
};
