import type { Meta, StoryObj } from '@storybook/react';
import Aurora from './aurora';

const meta = {
    title: 'Showcase/Backgrounds/Aurora',
    component: Aurora,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        amplitude: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        blend: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        speed: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
    },
} satisfies Meta<typeof Aurora>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <Aurora {...args} />
        </div>
    ),
    args: {
        colorStops: ['#7cff67', '#B19EEF', '#5227FF'],
        blend: 0.5,
        amplitude: 1.0,
        speed: 1,
    },
};

export const NorthernLights: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#050510' }}>
            <Aurora {...args} />
        </div>
    ),
    args: {
        colorStops: ['#00ff87', '#60efff', '#6366f1'],
        blend: 0.6,
        amplitude: 1.5,
        speed: 0.8,
    },
};

export const Warm: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <Aurora {...args} />
        </div>
    ),
    args: {
        colorStops: ['#FF6B35', '#FFD700', '#FF1654'],
        blend: 0.4,
        amplitude: 0.8,
        speed: 1.2,
    },
};
