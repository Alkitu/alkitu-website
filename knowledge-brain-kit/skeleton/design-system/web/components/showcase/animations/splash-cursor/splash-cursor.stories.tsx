import type { Meta, StoryObj } from '@storybook/react';
import { SplashCursor } from './splash-cursor';

const meta = {
    title: 'Showcase/Animations/Splash Cursor',
    component: SplashCursor,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        SPLAT_RADIUS: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
        SPLAT_FORCE: { control: { type: 'number' } },
        DENSITY_DISSIPATION: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        VELOCITY_DISSIPATION: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
        CURL: { control: { type: 'range', min: 1, max: 20, step: 1 } },
    }
} satisfies Meta<typeof SplashCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-foreground border flex flex-col items-center justify-center overflow-hidden">
            <h1 className="text-4xl lg:text-7xl font-black text-white text-center tracking-tighter mb-4 z-10 pointer-events-none mix-blend-difference">
                Liquid Chaos
            </h1>
            <p className="text-white z-10 pointer-events-none text-center mix-blend-difference max-w-lg opacity-80">
                Move your mouse rapidly across the screen and click to create explosions of digital ink.
            </p>

            <SplashCursor {...args} />
        </div>
    ),
    args: {
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        DENSITY_DISSIPATION: 3.5,
        VELOCITY_DISSIPATION: 2,
        CURL: 3,
        COLOR_UPDATE_SPEED: 10
    }
};
