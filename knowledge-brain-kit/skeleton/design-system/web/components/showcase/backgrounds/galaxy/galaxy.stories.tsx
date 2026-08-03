import type { Meta, StoryObj } from '@storybook/react';
import Galaxy from './galaxy';

const meta = {
    title: 'Showcase/Backgrounds/Galaxy',
    component: Galaxy,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof Galaxy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        speed: 1.0,
        density: 1,
        hueShift: 140,
        glowIntensity: 0.3,
        saturation: 0.0,
        mouseRepulsion: true,
        repulsionStrength: 2,
        twinkleIntensity: 0.3,
        rotationSpeed: 0.1,
        transparent: false
    }
};

export const Colorful: Story = {
    args: {
        speed: 1.5,
        density: 1.5,
        hueShift: 0,
        glowIntensity: 0.5,
        saturation: 1.0,
        mouseRepulsion: true,
        repulsionStrength: 3,
        twinkleIntensity: 0.6,
        rotationSpeed: 0.05,
        transparent: false
    }
};
