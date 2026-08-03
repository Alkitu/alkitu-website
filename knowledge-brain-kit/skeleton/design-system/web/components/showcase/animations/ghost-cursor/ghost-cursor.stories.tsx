import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import GhostCursor from './ghost-cursor';

const meta: Meta<typeof GhostCursor> = {
    title: 'Showcase/Animations/Ghost Cursor',
    component: GhostCursor,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Three.js WebGL ghost cursor — renders an FBM smoke blob that follows the pointer with inertia. Includes `UnrealBloomPass` for glow and film grain. Move your mouse to activate; the blob fades after `fadeDelayMs` of inactivity. The cursor must be inside the **parent container** for it to render.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof GhostCursor>;

export const Default: Story = {
    render: (args) => (
        <div style={{ height: 600, position: 'relative', background: '#06000f', overflow: 'hidden' }}>
            <GhostCursor {...args} />
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 8
            }}>
                <h1 style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', margin: 0, letterSpacing: '-0.02em' }}>Ghost Cursor</h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Move cursor inside this area
                </p>
            </div>
        </div>
    ),
    args: {
        color: '#B19EEF',
        brightness: 2,
        edgeIntensity: 0,
        trailLength: 50,
        inertia: 0.5,
        grainIntensity: 0.05,
        bloomStrength: 0.1,
        bloomRadius: 1,
        bloomThreshold: 0.025,
        fadeDelayMs: 1000,
        fadeDurationMs: 1500,
    },
    argTypes: {
        color: { control: 'color' },
        brightness: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        edgeIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        trailLength: { control: { type: 'range', min: 5, max: 100, step: 5 } },
        inertia: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        grainIntensity: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 } },
        bloomStrength: { control: { type: 'range', min: 0, max: 2, step: 0.05 } },
        bloomRadius: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    }
};
