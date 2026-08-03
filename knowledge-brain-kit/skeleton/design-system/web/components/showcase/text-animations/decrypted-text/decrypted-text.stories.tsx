import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DecryptedText } from './decrypted-text';

const meta: Meta<typeof DecryptedText> = {
    title: 'Showcase/Text Animations/Decrypted Text',
    component: DecryptedText,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Text that scrambles and solves itself like decrypted code.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof DecryptedText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex flex-col items-center justify-center bg-card min-h-[300px]">
            <p className="text-sm text-muted-foreground mb-8">Pasa el ratón para volver a desencriptar</p>
            <h2 className="text-5xl font-mono text-primary font-bold tracking-widest uppercase">
                <DecryptedText {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "SECURITY PROTOCOL",
        speed: 60,
        maxIterations: 15,
        sequential: true
    }
};
