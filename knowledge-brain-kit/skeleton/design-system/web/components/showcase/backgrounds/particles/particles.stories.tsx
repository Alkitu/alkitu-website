import type { Meta, StoryObj } from '@storybook/react';
import Particles from './particles';

const meta = {
    title: 'Showcase/Backgrounds/Particles',
    component: Particles,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        particleCount: { control: { type: 'range', min: 50, max: 1000, step: 50 } },
        particleSpread: { control: { type: 'range', min: 1, max: 30, step: 1 } },
        speed: { control: { type: 'range', min: 0.01, max: 1, step: 0.01 } },
        particleBaseSize: { control: { type: 'range', min: 10, max: 300, step: 10 } },
        moveParticlesOnHover: { control: 'boolean' },
        alphaParticles: { control: 'boolean' },
        disableRotation: { control: 'boolean' },
    },
} satisfies Meta<typeof Particles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <Particles {...args} />
        </div>
    ),
    args: {
        particleColors: ['#ffffff'],
        particleCount: 200,
        particleSpread: 10,
        speed: 0.1,
        particleBaseSize: 100,
        moveParticlesOnHover: true,
        alphaParticles: false,
        disableRotation: false,
        pixelRatio: 1,
    },
};

export const Colorful: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <Particles {...args} />
        </div>
    ),
    args: {
        particleColors: ['#5227FF', '#FF9FFC', '#B19EEF', '#00ff87'],
        particleCount: 400,
        particleSpread: 12,
        speed: 0.15,
        particleBaseSize: 80,
        moveParticlesOnHover: true,
        alphaParticles: true,
        disableRotation: false,
    },
};
