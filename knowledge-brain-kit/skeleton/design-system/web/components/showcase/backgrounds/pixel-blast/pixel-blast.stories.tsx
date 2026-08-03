import type { Meta, StoryObj } from '@storybook/react';
import PixelBlast from './pixel-blast';

const meta = {
    title: 'Showcase/Backgrounds/Pixel Blast',
    component: PixelBlast,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        variant: { control: 'select', options: ['square', 'circle', 'triangle', 'diamond'] },
        pixelSize: { control: { type: 'range', min: 1, max: 10, step: 1 } },
        color: { control: 'color' },
        patternScale: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
        patternDensity: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        enableRipples: { control: 'boolean' },
        rippleSpeed: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        rippleThickness: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
        rippleIntensityScale: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        liquid: { control: 'boolean' },
        liquidStrength: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 } },
        speed: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        edgeFade: { control: { type: 'range', min: 0, max: 0.5, step: 0.05 } },
        transparent: { control: 'boolean' },
    },
} satisfies Meta<typeof PixelBlast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <PixelBlast {...args} />
        </div>
    ),
    args: {
        variant: 'square',
        pixelSize: 4,
        color: '#B19EEF',
        patternScale: 2,
        patternDensity: 1,
        pixelSizeJitter: 0,
        enableRipples: true,
        rippleSpeed: 0.4,
        rippleThickness: 0.12,
        rippleIntensityScale: 1.5,
        liquid: false,
        speed: 0.5,
        edgeFade: 0.25,
        transparent: true,
    },
};

export const CircleLiquid: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <PixelBlast {...args} />
        </div>
    ),
    args: {
        variant: 'circle',
        pixelSize: 3,
        color: '#00ff87',
        patternScale: 1.5,
        patternDensity: 1,
        enableRipples: true,
        liquid: true,
        liquidStrength: 0.12,
        liquidRadius: 1.2,
        speed: 0.6,
        edgeFade: 0.2,
        transparent: true,
    },
};

export const DiamondPattern: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <PixelBlast {...args} />
        </div>
    ),
    args: {
        variant: 'diamond',
        pixelSize: 5,
        color: '#FF9FFC',
        patternScale: 3,
        patternDensity: 0.8,
        enableRipples: true,
        rippleSpeed: 0.3,
        speed: 0.3,
        edgeFade: 0.15,
        transparent: true,
    },
};
