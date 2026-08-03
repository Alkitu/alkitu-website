import type { Meta, StoryObj } from '@storybook/react';
import LightRays from './light-rays';

const meta = {
    title: 'Showcase/Backgrounds/Light Rays',
    component: LightRays,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        raysOrigin: { control: 'select', options: ['top-center', 'top-left', 'top-right', 'left', 'right', 'bottom-center', 'bottom-left', 'bottom-right'] },
        raysColor: { control: 'color' },
        raysSpeed: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        lightSpread: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        rayLength: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
        pulsating: { control: 'boolean' },
        fadeDistance: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        saturation: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        followMouse: { control: 'boolean' },
        mouseInfluence: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        noiseAmount: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        distortion: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    },
} satisfies Meta<typeof LightRays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <LightRays {...args} />
        </div>
    ),
    args: {
        raysOrigin: 'top-center',
        raysColor: '#ffffff',
        raysSpeed: 1,
        lightSpread: 0.5,
        rayLength: 3,
        followMouse: true,
        mouseInfluence: 0.1,
        noiseAmount: 0,
        distortion: 0,
        pulsating: false,
        fadeDistance: 1,
        saturation: 1,
    },
};

export const SideRays: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <LightRays {...args} />
        </div>
    ),
    args: {
        raysOrigin: 'left',
        raysColor: '#5227FF',
        raysSpeed: 0.6,
        lightSpread: 0.8,
        rayLength: 2.5,
        followMouse: false,
        pulsating: true,
        fadeDistance: 1.5,
        saturation: 1.2,
    },
};
