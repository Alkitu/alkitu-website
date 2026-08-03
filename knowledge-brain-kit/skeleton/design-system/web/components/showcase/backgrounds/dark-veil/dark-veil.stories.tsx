import type { Meta, StoryObj } from '@storybook/react';
import DarkVeil from './dark-veil';

const meta = {
    title: 'Showcase/Backgrounds/Dark Veil',
    component: DarkVeil,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        hueShift: { control: { type: 'range', min: 0, max: 360, step: 1 } },
        noiseIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        scanlineIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        speed: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        scanlineFrequency: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        warpAmount: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    },
} satisfies Meta<typeof DarkVeil>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <DarkVeil {...args} />
        </div>
    ),
    args: {
        hueShift: 0,
        noiseIntensity: 0,
        scanlineIntensity: 0,
        speed: 0.5,
        scanlineFrequency: 0,
        warpAmount: 0,
    },
};

export const Retro: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <DarkVeil {...args} />
        </div>
    ),
    args: {
        hueShift: 120,
        noiseIntensity: 0.15,
        scanlineIntensity: 0.3,
        speed: 0.3,
        scanlineFrequency: 50,
        warpAmount: 0.8,
    },
};

export const Warped: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <DarkVeil {...args} />
        </div>
    ),
    args: {
        hueShift: 200,
        noiseIntensity: 0,
        scanlineIntensity: 0,
        speed: 0.8,
        scanlineFrequency: 0,
        warpAmount: 3,
    },
};
