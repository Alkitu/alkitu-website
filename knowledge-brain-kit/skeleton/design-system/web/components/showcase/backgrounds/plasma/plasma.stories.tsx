import type { Meta, StoryObj } from '@storybook/react';
import Plasma from './plasma';

const meta = {
    title: 'Showcase/Backgrounds/Plasma',
    component: Plasma,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        color: { control: 'color' },
        speed: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        direction: { control: 'select', options: ['forward', 'reverse', 'pingpong'] },
        scale: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
        opacity: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
        mouseInteractive: { control: 'boolean' },
    },
} satisfies Meta<typeof Plasma>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#000' }}>
            <Plasma {...args} />
        </div>
    ),
    args: {
        color: '#ff6b35',
        speed: 0.6,
        direction: 'forward',
        scale: 1.1,
        opacity: 0.8,
        mouseInteractive: true,
    },
};

export const CyberPurple: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#000' }}>
            <Plasma {...args} />
        </div>
    ),
    args: {
        color: '#8b5cf6',
        speed: 0.4,
        direction: 'pingpong',
        scale: 1,
        opacity: 1,
        mouseInteractive: true,
    },
};
