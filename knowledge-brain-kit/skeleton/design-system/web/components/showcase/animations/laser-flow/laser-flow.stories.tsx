import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LaserFlow } from './laser-flow';

const meta: Meta<typeof LaserFlow> = {
    title: 'Showcase/Animations/Laser Flow',
    component: LaserFlow,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Three.js WebGL shader — volumetric laser/beam with animated wisps and fog. This effect is inherently designed for dark backgrounds (the beam emits light). In light mode the beam becomes subtler; increase `wispIntensity` and `fogIntensity` to compensate.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof LaserFlow>;

export const Default: Story = {
    render: (args) => (
        <div style={{ height: '600px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
            <LaserFlow {...args} />
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none', gap: '8px'
            }}>
                <h2 style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', margin: 0, letterSpacing: '-0.02em' }}>
                    Laser Flow
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Move your mouse over the beam
                </p>
            </div>
        </div>
    ),
    args: {
        color: '#FF79C6',
        horizontalBeamOffset: 0,
        verticalBeamOffset: -0.5,
        wispDensity: 0.8,
        wispSpeed: 15,
        wispIntensity: 5,
        flowSpeed: 0.35,
        flowStrength: 0.25,
        fogIntensity: 0.45,
        fogScale: 0.3,
        fogFallSpeed: 0.6,
        decay: 1.1,
        falloffStart: 1.2,
        verticalSizing: 2.0,
        horizontalSizing: 0.5,
        mouseTiltStrength: 0.01,
    },
    argTypes: {
        color: { control: 'color' },
        wispDensity: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
        wispSpeed: { control: { type: 'range', min: 0, max: 50, step: 1 } },
        wispIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.5 } },
        flowSpeed: { control: { type: 'range', min: 0, max: 2, step: 0.05 } },
        flowStrength: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        fogIntensity: { control: { type: 'range', min: 0, max: 2, step: 0.05 } },
        decay: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        verticalSizing: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
        horizontalSizing: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        horizontalBeamOffset: { control: { type: 'range', min: -0.5, max: 0.5, step: 0.05 } },
        verticalBeamOffset: { control: { type: 'range', min: -0.5, max: 0.5, step: 0.05 } },
        mouseTiltStrength: { control: { type: 'range', min: 0, max: 0.1, step: 0.005 } },
    }
};
