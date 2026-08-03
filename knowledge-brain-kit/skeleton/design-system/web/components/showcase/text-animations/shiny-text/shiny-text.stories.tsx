import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ShinyText } from './shiny-text';

const meta: Meta<typeof ShinyText> = {
    title: 'Showcase/Text Animations/Shiny Text',
    component: ShinyText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text with an animated shiny gradient reflecting across it.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ShinyText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-zinc-950 dark:bg-card min-h-[300px]">
            <h2 className="text-5xl font-bold tracking-tighter">
                <ShinyText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "✨ Shiny Text Effect",
        speed: 2,
        delay: 0,
        color: "#b5b5b5",
        shineColor: "#ffffff",
        spread: 120,
        direction: "left",
        yoyo: false,
        pauseOnHover: false,
        disabled: false
    },
    argTypes: {
        direction: {
            control: 'radio',
            options: ['left', 'right'],
        },
        speed: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        spread: { control: { type: 'range', min: 10, max: 200, step: 10 } },
        color: { control: 'color' },
        shineColor: { control: 'color' },
    }
};
