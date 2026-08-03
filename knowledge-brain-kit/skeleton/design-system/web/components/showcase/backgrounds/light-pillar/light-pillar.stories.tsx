import type { Meta, StoryObj } from '@storybook/react';
import LightPillar from './light-pillar';

const meta = {
    title: 'Showcase/Backgrounds/Light Pillar',
    component: LightPillar,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        topColor: { control: 'color' },
        bottomColor: { control: 'color' },
        intensity: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        rotationSpeed: { control: { type: 'range', min: 0.05, max: 2, step: 0.05 } },
        glowAmount: { control: { type: 'range', min: 0.001, max: 0.02, step: 0.001 } },
        pillarWidth: { control: { type: 'range', min: 0.5, max: 10, step: 0.1 } },
        pillarHeight: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 } },
        noiseIntensity: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        pillarRotation: { control: { type: 'range', min: -90, max: 90, step: 1 } },
        interactive: { control: 'boolean' },
        quality: { control: 'select', options: ['low', 'medium', 'high'] },
        mixBlendMode: { control: 'select', options: ['normal', 'screen', 'multiply', 'overlay'] },
    },
} satisfies Meta<typeof LightPillar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <LightPillar {...args} />
        </div>
    ),
    args: {
        topColor: '#5227FF',
        bottomColor: '#FF9FFC',
        intensity: 1,
        rotationSpeed: 0.3,
        glowAmount: 0.002,
        pillarWidth: 3,
        pillarHeight: 0.4,
        noiseIntensity: 0.5,
        pillarRotation: 25,
        interactive: false,
        mixBlendMode: 'screen',
        quality: 'high',
    },
};

export const CyanPillar: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <LightPillar {...args} />
        </div>
    ),
    args: {
        topColor: '#00F5FF',
        bottomColor: '#0066FF',
        intensity: 1.2,
        rotationSpeed: 0.5,
        glowAmount: 0.003,
        pillarWidth: 2,
        pillarHeight: 0.3,
        noiseIntensity: 0.3,
        pillarRotation: 0,
        interactive: true,
        mixBlendMode: 'screen',
        quality: 'high',
    },
};

export const Golden: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <LightPillar {...args} />
        </div>
    ),
    args: {
        topColor: '#FFD700',
        bottomColor: '#FF6B00',
        intensity: 0.8,
        rotationSpeed: 0.2,
        glowAmount: 0.004,
        pillarWidth: 4,
        pillarHeight: 0.5,
        noiseIntensity: 0.7,
        pillarRotation: -15,
        interactive: false,
        mixBlendMode: 'screen',
        quality: 'high',
    },
};
