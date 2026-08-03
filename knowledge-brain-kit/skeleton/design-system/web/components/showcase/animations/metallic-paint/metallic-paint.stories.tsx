import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import MetallicPaint from './metallic-paint';

const meta: Meta<typeof MetallicPaint> = {
    title: 'Showcase/Animations/Metallic Paint',
    component: MetallicPaint,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Liquid Metal effect based on WebGL distance fields and normal mapping.",
            },
        },
    },
};
export default meta;
type Story = StoryObj<typeof MetallicPaint>;

// A data URI for a generic Lucide Box/Hexagon SVG to use as the shape
const LUCIDE_HEXAGON_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 24 24" fill="%23000000" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
            <div style={{ width: '500px', height: '500px' }}>
                <MetallicPaint {...args} />
            </div>
        </div>
    ),
    args: {
        imageSrc: LUCIDE_HEXAGON_SVG,
        seed: 42,
        scale: 4,
        patternSharpness: 1,
        noiseScale: 0.5,
        speed: 0.3,
        liquid: 0.75,
        mouseAnimation: true,
        brightness: 2,
        contrast: 0.5,
        refraction: 0.01,
        blur: 0.015,
        chromaticSpread: 2,
        fresnel: 1,
        angle: 0,
        waveAmplitude: 1,
        distortion: 1,
        contour: 0.2,
        lightColor: "#ffffff",
        darkColor: "#000000",
        tintColor: "#feb3ff"
    },
};
