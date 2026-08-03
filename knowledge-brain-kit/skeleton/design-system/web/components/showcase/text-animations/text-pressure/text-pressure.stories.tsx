import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TextPressure } from './text-pressure';

const meta: Meta<typeof TextPressure> = {
    title: 'Showcase/Text Animations/Text Pressure',
    component: TextPressure,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "Typography that reacts to the mouse cursor by increasing font weight locally.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextPressure>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 border border-border rounded-xl flex flex-col items-center justify-center bg-card min-h-[300px]">
            <p className="text-sm text-muted-foreground mb-12">Acerca el cursor a las letras para aumentar la presión</p>
            <h2 className="text-5xl md:text-7xl tracking-tighter text-foreground uppercase">
                <TextPressure {...args} />
            </h2>
        </div>
    ),
    args: {
        text: "PRESION",
        proximity: 200,
        applyTo: "characters",
    },
    argTypes: {
        applyTo: { control: 'radio', options: ['characters', 'words'] },
        proximity: { control: { type: 'range', min: 50, max: 500, step: 10 } },
    }
};
