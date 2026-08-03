import type { Meta, StoryObj } from '@storybook/react';
import RippleGrid from './ripple-grid';

const meta = {
    title: 'Showcase/Backgrounds/Ripple Grid',
    component: RippleGrid,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof RippleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        gridColor: '#ffffff',
        rippleIntensity: 0.05,
        gridSize: 10.0,
        gridThickness: 15.0,
        fadeDistance: 1.5,
        vignetteStrength: 2.0,
        glowIntensity: 0.1,
        opacity: 1.0,
        mouseInteraction: true,
        mouseInteractionRadius: 1
    }
};

export const Rainbow: Story = {
    args: {
        enableRainbow: true,
        rippleIntensity: 0.08,
        gridSize: 8.0,
        gridThickness: 12.0,
        mouseInteraction: true,
        mouseInteractionRadius: 1.5
    }
};
