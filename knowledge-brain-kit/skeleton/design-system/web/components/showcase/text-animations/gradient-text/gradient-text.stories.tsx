import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GradientText } from './gradient-text';

const meta: Meta<typeof GradientText> = {
    title: 'Showcase/Text Animations/Gradient Text',
    component: GradientText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text animated with continuous repeating gradients.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof GradientText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-center">
                <GradientText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "The Future of Design",
        colors: ["#5227FF", "#FF9FFC", "#B19EEF"],
        animationSpeed: 8,
        showBorder: true,
        direction: "horizontal",
        pauseOnHover: false,
        yoyo: true
    },
    argTypes: {
        direction: {
            control: 'select',
            options: ['horizontal', 'vertical', 'diagonal'],
        },
        animationSpeed: { control: { type: 'range', min: 1, max: 20, step: 1 } },
    }
};
