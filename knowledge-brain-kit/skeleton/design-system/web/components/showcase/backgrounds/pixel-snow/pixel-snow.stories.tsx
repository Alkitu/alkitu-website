import type { Meta, StoryObj } from '@storybook/react';
import PixelSnow from './pixel-snow';

const meta = {
    title: 'Showcase/Backgrounds/Pixel Snow',
    component: PixelSnow,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof PixelSnow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        color: '#ffffff',
        flakeSize: 0.01,
        minFlakeSize: 1.25,
        pixelResolution: 399,
        speed: 1.25,
        density: 0.3,
        direction: 125,
        brightness: 1,
        depthFade: 8,
        farPlane: 20,
        gamma: 0.4545,
        variant: 'square'
    }
};

export const Snowflakes: Story = {
    args: {
        color: '#ccddff',
        flakeSize: 0.05,
        minFlakeSize: 1.5,
        pixelResolution: 1920,
        speed: 0.8,
        density: 0.4,
        variant: 'snowflake',
        brightness: 1.2
    }
};
