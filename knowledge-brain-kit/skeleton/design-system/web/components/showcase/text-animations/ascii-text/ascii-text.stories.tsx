import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AsciiText } from './ascii-text';

const meta: Meta<typeof AsciiText> = {
    title: 'Showcase/Text Animations/ASCII Text',
    component: AsciiText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A WebGL-powered 3D ASCII text component using Three.js with optional wave animation.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof AsciiText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl bg-zinc-950 w-full min-h-[500px]">
            <AsciiText {...args} />
        </div>
    ),
    args: {
        text: "HACKER",
        enableWaves: true,
        asciiFontSize: 8,
        textFontSize: 200,
        textColor: "#fdf9f3",
        planeBaseHeight: 8
    },
    argTypes: {
        enableWaves: { control: 'boolean' },
        asciiFontSize: { control: { type: 'range', min: 4, max: 20, step: 1 } },
        textFontSize: { control: { type: 'range', min: 50, max: 400, step: 10 } },
        textColor: { control: 'color' },
    }
};
