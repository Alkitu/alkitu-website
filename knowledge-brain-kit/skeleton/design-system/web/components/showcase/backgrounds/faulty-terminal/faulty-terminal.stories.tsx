import type { Meta, StoryObj } from '@storybook/react';
import FaultyTerminal from './faulty-terminal';

const meta = {
    title: 'Showcase/Backgrounds/Faulty Terminal',
    component: FaultyTerminal,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof FaultyTerminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        scale: 1,
        gridMul: [2, 1],
        digitSize: 1.5,
        scanlineIntensity: 0.3,
        glitchAmount: 1,
        flickerAmount: 1,
        curvature: 0.2,
        tint: '#00ff41',
        brightness: 1,
        mouseReact: true,
        mouseStrength: 0.2
    }
};

export const CyberpunkBlue: Story = {
    args: {
        scale: 1.5,
        gridMul: [3, 1],
        digitSize: 1.2,
        scanlineIntensity: 0.5,
        glitchAmount: 2,
        flickerAmount: 1.5,
        curvature: 0.3,
        tint: '#00aaff',
        chromaticAberration: 3,
        brightness: 1.2
    }
};
