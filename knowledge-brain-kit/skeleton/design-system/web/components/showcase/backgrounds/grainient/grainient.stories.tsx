import type { Meta, StoryObj } from '@storybook/react';
import Grainient from './grainient';

const meta = {
    title: 'Showcase/Backgrounds/Grainient',
    component: Grainient,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        color1: { control: 'color' },
        color2: { control: 'color' },
        color3: { control: 'color' },
        timeSpeed: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        warpStrength: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        warpFrequency: { control: { type: 'range', min: 1, max: 20, step: 1 } },
        warpSpeed: { control: { type: 'range', min: 0.1, max: 10, step: 0.1 } },
        warpAmplitude: { control: { type: 'range', min: 10, max: 200, step: 5 } },
        grainAmount: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 } },
        contrast: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
        saturation: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        zoom: { control: { type: 'range', min: 0.3, max: 2, step: 0.1 } },
    },
} satisfies Meta<typeof Grainient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Grainient {...args} />
        </div>
    ),
    args: {
        color1: '#FF9FFC',
        color2: '#5227FF',
        color3: '#B19EEF',
        timeSpeed: 0.25,
        warpStrength: 1,
        warpFrequency: 5,
        warpSpeed: 2,
        warpAmplitude: 50,
        grainAmount: 0.1,
        contrast: 1.5,
        saturation: 1,
        zoom: 0.9,
    },
};

export const Sunset: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Grainient {...args} />
        </div>
    ),
    args: {
        color1: '#FF6B35',
        color2: '#F7931E',
        color3: '#2D1B69',
        timeSpeed: 0.15,
        warpStrength: 0.8,
        warpFrequency: 3,
        warpSpeed: 1.5,
        warpAmplitude: 80,
        grainAmount: 0.15,
        contrast: 1.8,
        saturation: 1.2,
        zoom: 0.8,
    },
};
