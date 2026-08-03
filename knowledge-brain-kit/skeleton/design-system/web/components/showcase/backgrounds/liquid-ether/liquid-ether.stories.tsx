import type { Meta, StoryObj } from '@storybook/react';
import LiquidEther from './liquid-ether';

const meta = {
    title: 'Showcase/Backgrounds/Liquid Ether',
    component: LiquidEther,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        mouseForce: { control: { type: 'range', min: 1, max: 100, step: 1 } },
        cursorSize: { control: { type: 'range', min: 10, max: 300, step: 10 } },
        isViscous: { control: 'boolean' },
        viscous: { control: { type: 'range', min: 1, max: 100, step: 1 } },
        resolution: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 } },
        isBounce: { control: 'boolean' },
        autoDemo: { control: 'boolean' },
        autoSpeed: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        autoIntensity: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
    },
} satisfies Meta<typeof LiquidEther>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#000' }}>
            <LiquidEther {...args} />
        </div>
    ),
    args: {
        colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
        mouseForce: 20,
        cursorSize: 100,
        isViscous: true,
        viscous: 30,
        resolution: 0.5,
        isBounce: false,
        autoDemo: true,
        autoSpeed: 0.5,
        autoIntensity: 2.2,
        takeoverDuration: 0.25,
        autoResumeDelay: 3000,
        autoRampDuration: 0.6,
    },
};

export const NeonGreen: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <LiquidEther {...args} />
        </div>
    ),
    args: {
        colors: ['#00FF87', '#60EFFF', '#00B4D8'],
        mouseForce: 30,
        cursorSize: 120,
        isViscous: true,
        viscous: 40,
        resolution: 0.5,
        autoDemo: true,
        autoSpeed: 0.8,
        autoIntensity: 2.5,
    },
};

export const Sunset: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <LiquidEther {...args} />
        </div>
    ),
    args: {
        colors: ['#FF6B35', '#F7C59F', '#FF1654'],
        mouseForce: 15,
        cursorSize: 80,
        isViscous: false,
        resolution: 0.5,
        autoDemo: true,
        autoSpeed: 0.3,
        autoIntensity: 1.8,
    },
};
