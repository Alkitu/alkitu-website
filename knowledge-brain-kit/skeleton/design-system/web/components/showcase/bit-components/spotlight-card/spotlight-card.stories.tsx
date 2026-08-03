import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SpotlightCard from './spotlight-card';

const meta: Meta<typeof SpotlightCard> = {
    title: 'Showcase/Bit Components/Spotlight Card',
    component: SpotlightCard,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A card with a CSS pseudo-element spotlight that follows the mouse cursor on hover.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SpotlightCard>;

export const Default: Story = {
    render: (args) => (
        <div className="p-16 flex flex-col items-center justify-center min-h-[500px] gap-8 bg-zinc-950 rounded-xl">
            <SpotlightCard {...args} className="w-full max-w-sm">
                <div className="pb-4 border-b border-white/10 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/20 backdrop-blur-md mb-4 flex items-center justify-center text-cyan-400 font-bold text-xl">
                        ✦
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Spotlight Effect</h3>
                    <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                        A beautiful interactive card with a spotlight that tracks your cursor.
                    </p>
                </div>
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Hover to reveal</div>
            </SpotlightCard>
        </div>
    ),
    args: {
        spotlightColor: "rgba(0, 229, 255, 0.2)" as any,
    },
    argTypes: {
        spotlightColor: { control: 'text' },
    }
};
