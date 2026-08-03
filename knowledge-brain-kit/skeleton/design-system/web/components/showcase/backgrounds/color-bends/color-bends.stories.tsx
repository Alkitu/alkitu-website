import type { Meta, StoryObj } from '@storybook/react';
import ColorBends from './color-bends';

const meta = {
    title: 'Showcase/Backgrounds/Color Bends',
    component: ColorBends,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        rotation: { control: { type: 'range', min: 0, max: 360, step: 1 } },
        speed: { control: { type: 'range', min: 0.05, max: 1, step: 0.05 } },
        scale: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
        frequency: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
        warpStrength: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
        mouseInfluence: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
        parallax: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        noise: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 } },
        autoRotate: { control: { type: 'range', min: -20, max: 20, step: 1 } },
        transparent: { control: 'boolean' },
    },
} satisfies Meta<typeof ColorBends>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <ColorBends {...args} />
        </div>
    ),
    args: {
        colors: ['#ff5c7a', '#8a5cff', '#00ffd1'],
        rotation: 0,
        speed: 0.2,
        scale: 1,
        frequency: 1,
        warpStrength: 1,
        mouseInfluence: 1,
        parallax: 0.5,
        noise: 0.1,
        transparent: true,
        autoRotate: 0,
    },
};

export const Rotating: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <ColorBends {...args} />
        </div>
    ),
    args: {
        colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
        rotation: 45,
        speed: 0.15,
        scale: 1.2,
        frequency: 1.2,
        warpStrength: 1.5,
        mouseInfluence: 0.5,
        parallax: 0.3,
        noise: 0.05,
        transparent: false,
        autoRotate: 5,
    },
};
