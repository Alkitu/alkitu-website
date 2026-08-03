import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TextType } from './text-type';

const meta: Meta<typeof TextType> = {
    title: 'Showcase/Text Animations/Text Type',
    component: TextType,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Classic typewriter effect that cycles and deletes strings sequentially.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextType>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex items-center justify-center bg-zinc-950 dark:bg-card min-h-[300px]">
            <h2 className="text-4xl font-mono text-zinc-100 dark:text-foreground">
                <span className="text-muted-foreground mr-2">{">"}</span>
                <TextType {...args} />
            </h2>
        </div>
    ),
    args: {
        items: ["System Booting...", "Loading Modules...", "Access Granted."],
        typeSpeed: 60,
        backSpeed: 40,
        cursorChar: "█"
    }
};
