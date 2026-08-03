import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import FluidGlass from './fluid-glass';

const meta = {
    title: 'Showcase/Bit Components/Fluid Glass',
    component: FluidGlass,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof FluidGlass>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LensMode: Story = {
    args: {
        mode: 'lens',
        scale: 0.25,
        ior: 1.15,
        thickness: 2,
        transmission: 1,
        roughness: 0,
        chromaticAberration: 0.05,
        anisotropy: 0.01
    },
    render: (args) => (
        <div className="w-full h-screen relative bg-black">
            <FluidGlass {...args} />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                Scroll to explore the 3D gallery
            </div>
        </div>
    )
};

export const BarMode: Story = {
    args: {
        mode: 'bar',
        barProps: {
            transmission: 1,
            roughness: 0,
            thickness: 10,
            ior: 1.15,
        }
    },
    render: (args) => (
        <div className="w-full h-screen relative bg-[#111]">
            <FluidGlass {...args} />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                Scroll to explore
            </div>
        </div>
    )
};

export const CubeMode: Story = {
    args: {
        mode: 'cube',
        cubeProps: {
            scale: 0.25,
            ior: 1.2,
            thickness: 5,
        }
    },
    render: (args) => (
        <div className="w-full h-screen relative bg-[#050510]">
            <FluidGlass {...args} />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                Scroll to explore
            </div>
        </div>
    )
};
