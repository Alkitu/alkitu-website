import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Antigravity from './antigravity';

const meta: Meta<typeof Antigravity> = {
    title: 'Showcase/Animations/Antigravity',
    component: Antigravity,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Three.js instanced particles that orbit your cursor using magnetic field physics. This component renders on a transparent WebGL canvas — wrap it in your desired background. Dark backgrounds work best to appreciate the particle glow.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Antigravity>;

export const Default: Story = {
    render: (args) => (
        <div className="relative w-full bg-background" style={{ height: '500px' }}>
            {/* Subtle radial gradient overlay — adapts to both modes */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 60% at 50% 100%, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
                }}
            />
            <Antigravity {...args} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                <p className="text-muted-foreground text-sm tracking-widest uppercase font-bold">Move your cursor</p>
                <p className="text-muted-foreground/50 text-xs">Particles are attracted to your pointer</p>
            </div>
        </div>
    ),
    args: {
        count: 300,
        magnetRadius: 6,
        ringRadius: 7,
        waveSpeed: 0.4,
        waveAmplitude: 1,
        particleSize: 1.5,
        lerpSpeed: 0.05,
        color: 'hsl(var(--primary))',
        autoAnimate: true,
        particleVariance: 1,
        rotationSpeed: 0,
        depthFactor: 1,
        pulseSpeed: 3,
        particleShape: 'capsule',
        fieldStrength: 10,
    },
    argTypes: {
        color: { control: 'color' },
        particleShape: { control: 'select', options: ['capsule', 'sphere', 'box', 'tetrahedron'] },
        count: { control: { type: 'range', min: 50, max: 800, step: 50 } },
        particleSize: { control: { type: 'range', min: 0.5, max: 5, step: 0.5 } },
        magnetRadius: { control: { type: 'range', min: 1, max: 30, step: 1 } },
        ringRadius: { control: { type: 'range', min: 1, max: 30, step: 1 } },
        lerpSpeed: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
        autoAnimate: { control: 'boolean' },
    }
};
