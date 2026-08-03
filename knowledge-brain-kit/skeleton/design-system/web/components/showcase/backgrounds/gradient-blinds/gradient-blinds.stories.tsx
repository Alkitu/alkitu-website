import type { Meta, StoryObj } from '@storybook/react';
import GradientBlinds from './gradient-blinds';

const meta = {
    title: 'Showcase/Backgrounds/Gradient Blinds',
    component: GradientBlinds,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        angle: { control: { type: 'range', min: -180, max: 180, step: 1 } },
        noise: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        blindCount: { control: { type: 'range', min: 2, max: 30, step: 1 } },
        blindMinWidth: { control: { type: 'range', min: 10, max: 200, step: 10 } },
        spotlightRadius: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        spotlightSoftness: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        spotlightOpacity: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        mouseDampening: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        distortAmount: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
        shineDirection: { control: 'select', options: ['left', 'right'] },
        mixBlendMode: { control: 'select', options: ['normal', 'lighten', 'screen', 'multiply', 'overlay'] },
        mirrorGradient: { control: 'boolean' },
    },
} satisfies Meta<typeof GradientBlinds>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <GradientBlinds {...args} />
        </div>
    ),
    args: {
        gradientColors: ['#FF9FFC', '#5227FF'],
        angle: 0,
        noise: 0.3,
        blindCount: 12,
        blindMinWidth: 50,
        spotlightRadius: 0.5,
        spotlightSoftness: 1,
        spotlightOpacity: 1,
        mouseDampening: 0.15,
        distortAmount: 0,
        shineDirection: 'left',
        mixBlendMode: 'lighten',
    },
};

export const RainbowDistort: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <GradientBlinds {...args} />
        </div>
    ),
    args: {
        gradientColors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'],
        angle: 15,
        noise: 0.2,
        blindCount: 20,
        blindMinWidth: 30,
        spotlightRadius: 0.8,
        distortAmount: 2,
        shineDirection: 'right',
        mirrorGradient: true,
        mixBlendMode: 'screen',
    },
};
