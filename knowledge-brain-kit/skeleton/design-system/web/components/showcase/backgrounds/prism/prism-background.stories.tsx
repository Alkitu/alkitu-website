import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Prism from './prism-background';

const meta: Meta<typeof Prism> = {
    title: 'Showcase/Backgrounds/Prism',
    component: Prism,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "A WebGL-powered prism/pyramid background using OGL with raymarched SDF rendering. Creates mesmerizing refractive light effects.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Prism>;

export const Rotate: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Prism {...args} />
        </div>
    ),
    args: {
        animationType: "rotate",
        timeScale: 0.5,
        height: 3.5,
        baseWidth: 5.5,
        scale: 3.6,
        hueShift: 0,
        colorFrequency: 1,
        noise: 0,
        glow: 1,
    },
    argTypes: {
        animationType: {
            control: 'select',
            options: ['rotate', 'hover', '3drotate']
        },
        timeScale: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
        height: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        baseWidth: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        scale: { control: { type: 'range', min: 0.5, max: 10, step: 0.1 } },
        hueShift: { control: { type: 'range', min: -3.14, max: 3.14, step: 0.1 } },
        colorFrequency: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        noise: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        glow: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
        bloom: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    }
};

export const Hover: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Prism {...args} />
        </div>
    ),
    args: {
        animationType: "hover",
        timeScale: 0.5,
        height: 3.5,
        baseWidth: 5.5,
        scale: 3.6,
        hueShift: 0,
        colorFrequency: 1,
        noise: 0,
        glow: 1,
        hoverStrength: 2,
        inertia: 0.05,
    },
};

export const ThreeDRotate: Story = {
    name: "3D Rotate",
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Prism {...args} />
        </div>
    ),
    args: {
        animationType: "3drotate",
        timeScale: 0.5,
        height: 3.5,
        baseWidth: 5.5,
        scale: 3.6,
        hueShift: 0,
        colorFrequency: 1,
        noise: 0,
        glow: 1,
    },
};
