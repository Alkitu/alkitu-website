import type { Meta, StoryObj } from '@storybook/react';
import Silk from './silk';

const meta = {
    title: 'Showcase/Backgrounds/Silk',
    component: Silk,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        speed: { control: { type: 'range', min: 0.5, max: 20, step: 0.5 } },
        scale: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
        color: { control: 'color' },
        noiseIntensity: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
        rotation: { control: { type: 'range', min: -3.14, max: 3.14, step: 0.1 } },
    },
} satisfies Meta<typeof Silk>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Silk {...args} />
        </div>
    ),
    args: {
        speed: 5,
        scale: 1,
        color: '#7B7481',
        noiseIntensity: 1.5,
        rotation: 0,
    },
};

export const Ocean: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Silk {...args} />
        </div>
    ),
    args: {
        speed: 3,
        scale: 1.5,
        color: '#1E40AF',
        noiseIntensity: 1.0,
        rotation: 0.3,
    },
};

export const Rose: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Silk {...args} />
        </div>
    ),
    args: {
        speed: 8,
        scale: 0.8,
        color: '#BE185D',
        noiseIntensity: 2.0,
        rotation: -0.5,
    },
};

export const Emerald: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Silk {...args} />
        </div>
    ),
    args: {
        speed: 4,
        scale: 1.2,
        color: '#047857',
        noiseIntensity: 1.2,
        rotation: 0,
    },
};
