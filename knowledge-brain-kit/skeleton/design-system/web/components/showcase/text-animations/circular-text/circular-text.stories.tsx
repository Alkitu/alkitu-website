import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CircularText } from './circular-text';

const meta: Meta<typeof CircularText> = {
    title: 'Showcase/Text Animations/Circular Text',
    component: CircularText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text that spins continuously in a circle.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof CircularText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[400px] overflow-hidden">
            <CircularText {...args} className="text-muted-foreground font-black text-xl tracking-widest uppercase" />
        </div>
    ),
    args: {
        text: "REACT*BITS*COMPONENTS*",
        onHover: "speedUp",
        spinDuration: 20,
        radius: 90
    },
    argTypes: {
        onHover: {
            control: 'select',
            options: ['slowDown', 'speedUp', 'pause', 'goBonkers'],
        },
        spinDuration: {
            control: { type: 'range', min: 1, max: 50, step: 1 },
        },
        radius: {
            control: { type: 'range', min: 20, max: 200, step: 10 },
        }
    }
};
