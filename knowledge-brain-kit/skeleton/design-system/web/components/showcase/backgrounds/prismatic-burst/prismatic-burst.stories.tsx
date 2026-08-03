import type { Meta, StoryObj } from '@storybook/react';
import PrismaticBurst from './prismatic-burst';

const meta = {
    title: 'Showcase/Backgrounds/Prismatic Burst',
    component: PrismaticBurst,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof PrismaticBurst>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        intensity: 2,
        speed: 0.5,
        animationType: 'rotate3d',
        distort: 0,
        mixBlendMode: 'lighten'
    }
};

export const WithColors: Story = {
    args: {
        intensity: 2.5,
        speed: 0.7,
        animationType: 'rotate3d',
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
        distort: 2,
        mixBlendMode: 'lighten'
    }
};

export const Hover: Story = {
    args: {
        intensity: 3,
        speed: 0.3,
        animationType: 'hover',
        hoverDampness: 0.3,
        mixBlendMode: 'lighten'
    }
};
