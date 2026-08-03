import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack } from './stack';

const meta = {
    title: 'Showcase/Bit Components/Stack',
    component: Stack,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const cards = [
    <div key="c0" className="w-[300px] h-[400px] bg-red-500 rounded-3xl p-6 shadow-xl border border-white/20 text-white flex flex-col justify-between">
        <div className="font-bold text-xl opacity-50">01</div>
        <div>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">Strategy</h3>
            <p className="opacity-80">Defining the right path for your product.</p>
        </div>
    </div>,
    <div key="c1" className="w-[300px] h-[400px] bg-blue-500 rounded-3xl p-6 shadow-xl border border-white/20 text-white flex flex-col justify-between">
        <div className="font-bold text-xl opacity-50">02</div>
        <div>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">Design</h3>
            <p className="opacity-80">Crafting pixels into experiences.</p>
        </div>
    </div>,
    <div key="c2" className="w-[300px] h-[400px] bg-emerald-500 rounded-3xl p-6 shadow-xl border border-white/20 text-white flex flex-col justify-between">
        <div className="font-bold text-xl opacity-50">03</div>
        <div>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">Develop</h3>
            <p className="opacity-80">Writing code that scales elegantly.</p>
        </div>
    </div>,
    <div key="c3" className="w-[300px] h-[400px] bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-700 text-white flex flex-col justify-between">
        <div className="font-bold text-xl opacity-50">04</div>
        <div>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">Deploy</h3>
            <p className="opacity-80">Shipping the final iteration to the world.</p>
        </div>
    </div>
];

export const Default: Story = {
    args: {} as any,
    render: () => (
        <div className="w-full flex flex-col items-center justify-center py-24 min-w-[500px]">
            <div className="mb-12 text-center">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Stack Animation</h2>
                <p className="text-muted-foreground">Layered stack with swipe animations and smooth transitions.</p>
            </div>
            {/* The Stack component takes width/height of its parent, so wrapper needs explicit sizing */}
            <div className="w-[300px] h-[400px]">
                <Stack
                    cards={cards}
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={true}
                    autoplay={false}
                />
            </div>
        </div>
    )
};
