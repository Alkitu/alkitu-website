import type { Meta, StoryObj } from '@storybook/react';
import { GlitchText } from './glitch-text';

const meta: Meta<typeof GlitchText> = {
    title: 'Showcase/Text Animations/Glitch Text',
    component: GlitchText,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "A CSS-based glitch text effect with chromatic aberration using pseudo-elements and clip-path animation.",
            },
        },
    },
    argTypes: {
        speed: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        enableShadows: { control: 'boolean' },
        enableOnHover: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof GlitchText>;

export const Default: Story = {
    render: (args) => (
        <div className="p-12 bg-background min-h-[300px] flex items-center justify-center">
            <GlitchText {...args} />
        </div>
    ),
    args: {
        children: "GLITCH",
        speed: 1,
        enableShadows: true,
        enableOnHover: false,
    },
};

export const HoverOnly: Story = {
    render: (args) => (
        <div className="p-12 bg-background min-h-[300px] flex items-center justify-center">
            <GlitchText {...args} />
        </div>
    ),
    args: {
        children: "HOVER ME",
        speed: 0.5,
        enableShadows: true,
        enableOnHover: true,
    },
};
