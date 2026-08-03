import type { Meta, StoryObj } from '@storybook/react';
import FloatingLines from './floating-lines';

const meta = {
    title: 'Showcase/Backgrounds/Floating Lines',
    component: FloatingLines,
    parameters: { layout: 'fullscreen' },
    argTypes: {
        lineCount: { control: { type: 'range', min: 1, max: 20, step: 1 } },
        lineDistance: { control: { type: 'range', min: 1, max: 20, step: 1 } },
        bendRadius: { control: { type: 'range', min: 0.5, max: 20, step: 0.5 } },
        bendStrength: { control: { type: 'range', min: -3, max: 3, step: 0.1 } },
        interactive: { control: 'boolean' },
        parallax: { control: 'boolean' },
        animationSpeed: { control: { type: 'range', min: 0.1, max: 5, step: 0.1 } },
        parallaxStrength: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        mixBlendMode: { control: 'select', options: ['normal', 'screen', 'multiply', 'overlay'] },
    },
} satisfies Meta<typeof FloatingLines>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
            <FloatingLines {...args} />
        </div>
    ),
    args: {
        enabledWaves: ['top', 'middle', 'bottom'],
        lineCount: 5,
        lineDistance: 5,
        bendRadius: 5,
        bendStrength: -0.5,
        interactive: true,
        parallax: true,
        animationSpeed: 1,
        parallaxStrength: 0.2,
        mixBlendMode: 'screen',
    },
};

export const NeonGradient: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <FloatingLines {...args} />
        </div>
    ),
    args: {
        enabledWaves: ['top', 'middle', 'bottom'],
        linesGradient: ['#FF0080', '#7928CA', '#0070F3', '#00DFD8'],
        lineCount: 8,
        lineDistance: 3,
        bendRadius: 8,
        bendStrength: -0.8,
        interactive: true,
        parallax: true,
        animationSpeed: 1.5,
        mixBlendMode: 'screen',
    },
};

export const MinimalWaves: Story = {
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', background: '#0a0a0a' }}>
            <FloatingLines {...args} />
        </div>
    ),
    args: {
        enabledWaves: ['middle'],
        linesGradient: ['#FFFFFF'],
        lineCount: 3,
        lineDistance: 8,
        interactive: false,
        parallax: false,
        animationSpeed: 0.5,
        mixBlendMode: 'screen',
    },
};
