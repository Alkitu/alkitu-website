import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BlurText } from './blur-text';

const meta: Meta<typeof BlurText> = {
    title: 'Showcase/Text Animations/Blur Text',
    component: BlurText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A smooth text blur reveal animation.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof BlurText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <h2 className="text-4xl font-bold tracking-tighter">
                <BlurText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "Isn't this smooth?",
        animateBy: "words",
        direction: "top",
        delay: 0.2
    },
    argTypes: {
        animateBy: {
            control: 'select',
            options: ['words', 'letters'],
            description: 'Controls whether it animates by words or letters'
        },
        direction: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'The animation direction'
        },
        delay: {
            control: { type: 'range', min: 0, max: 2, step: 0.1 },
            description: 'Delay before the animation starts (in seconds)'
        }
    }
};
