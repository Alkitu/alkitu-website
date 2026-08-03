import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Crosshair } from './crosshair';

const meta = {
    title: 'Showcase/Animations/Crosshair',
    component: Crosshair,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        color: { control: 'color' },
    }
} satisfies Meta<typeof Crosshair>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to provide the ref properly
const CrosshairStoryWrapper = (args: any) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="w-full h-screen relative bg-background flex flex-col items-center justify-center p-12 overflow-hidden"
            style={{ cursor: 'none' }} // Hide default cursor for better effect
        >
            <Crosshair containerRef={containerRef} {...args} />

            <div className="flex flex-col items-center gap-6 max-w-md text-center">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                    Interactive Target
                </h1>
                <p className="text-lg text-muted-foreground">
                    Move your mouse to trace positions. The lines will dynamically follow the pointer with a smooth delay.
                </p>
                <div className="flex gap-4 items-center">
                    <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:opacity-90 transition-opacity">
                        Hover Me
                    </button>
                    <a href="#" className="font-semibold text-primary underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity">
                        Or Hover This Link
                    </a>
                </div>
            </div>
        </div>
    );
};

export const Default: Story = {
    render: (args) => <CrosshairStoryWrapper {...args} />,
    args: {
        color: 'var(--color-primary)',
    }
};

export const CustomColor: Story = {
    render: (args) => <CrosshairStoryWrapper {...args} />,
    args: {
        color: '#ff3366', // Custom external HEX color
    }
};
