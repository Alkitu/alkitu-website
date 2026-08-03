import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PixelTransition from './pixel-transition';

const meta: Meta<typeof PixelTransition> = {
    title: 'Showcase/Animations/Pixel Transition',
    component: PixelTransition,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "GSAP-powered pixel grid wipe between two content states on hover/click. Best seen on a dark background where the white pixel flash is dramatic.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof PixelTransition>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col items-center justify-center gap-6 p-16 bg-background min-h-[500px] rounded-xl">
            <PixelTransition
                {...args}
                style={{ width: 300 }}
                firstContent={
                    <img
                        src="/gallery/landscape-07-aurora.png"
                        alt="A scenic view"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                }
                secondContent={
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'grid', placeItems: 'center',
                        backgroundColor: 'var(--background)',
                    }}>
                        <p style={{
                            fontWeight: 900,
                            fontSize: '2.5rem',
                            color: '#ffffff',
                            textAlign: 'center',
                        }}>Meow! ✦</p>
                    </div>
                }
            />
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Hover the image</p>
        </div>
    ),
    args: {
        gridSize: 8,
        pixelColor: '#ffffff',
        animationStepDuration: 0.4,
        once: false,
        aspectRatio: '100%',
    },
    argTypes: {
        gridSize: { control: { type: 'range', min: 3, max: 20, step: 1 } },
        pixelColor: { control: 'color' },
        animationStepDuration: { control: { type: 'range', min: 0.1, max: 2, step: 0.05 } },
        once: { control: 'boolean' },
        aspectRatio: { control: 'text' },
    }
};
