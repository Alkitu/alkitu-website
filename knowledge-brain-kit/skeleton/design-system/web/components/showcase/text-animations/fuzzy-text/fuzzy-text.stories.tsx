import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FuzzyText } from './fuzzy-text';

const meta: Meta<typeof FuzzyText> = {
    title: 'Showcase/Text Animations/Fuzzy Text',
    component: FuzzyText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A Canvas-based fuzzy text effect that responds to hover and precise intensity adjustments.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof FuzzyText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-card min-h-[300px]">
            <FuzzyText {...args} />
        </div>
    ),
    args: {
        children: "404",
        enableHover: true,
        baseIntensity: 0.2,
        hoverIntensity: 0.5,
        color: "#ffffff"
    },
    argTypes: {
        enableHover: { control: 'boolean' },
        baseIntensity: { control: { type: 'range', min: 0.0, max: 1.0, step: 0.05 } },
        hoverIntensity: { control: { type: 'range', min: 0.0, max: 1.0, step: 0.05 } },
        color: { control: 'color' }
    }
};
