import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CountUp } from './count-up';

const meta: Meta<typeof CountUp> = {
    title: 'Showcase/Text Animations/Count Up',
    component: CountUp,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A fluid number counting animation powered by Framer Motion springs.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof CountUp>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <h2 className="text-7xl font-mono font-black tracking-tighter text-primary">
                <CountUp {...args} />
            </h2>
        </div>
    ),
    args: {
        to: 1000000,
        from: 0,
        direction: "up",
        delay: 0,
        duration: 2.5,
        startWhen: true,
        prefix: "$",
        suffix: " M",
        decimals: 0
    },
    argTypes: {
        direction: { control: 'radio', options: ['up', 'down'] },
        duration: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        decimals: { control: { type: 'range', min: 0, max: 4, step: 1 } },
        delay: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    }
};
