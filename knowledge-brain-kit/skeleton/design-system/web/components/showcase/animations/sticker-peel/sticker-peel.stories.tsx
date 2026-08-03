import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import StickerPeel from './sticker-peel';

const meta: Meta<typeof StickerPeel> = {
    title: 'Showcase/Animations/Sticker Peel',
    component: StickerPeel,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: "GSAP Draggable-powered sticker peel effect. Calculates shadows and peels backwards based on drag distance.",
            },
        },
    },
};
export default meta;
type Story = StoryObj<typeof StickerPeel>;

// Generating a beautiful Gradient Lucide Star for the sticker
const LUCIDE_STAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%23facc15" stroke="%23facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
            <div style={{ width: 600, height: 600, position: 'relative', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StickerPeel {...args} />
                <p className="absolute bottom-4 text-xs text-gray-500 font-medium tracking-widest uppercase">
                    Drag the star to peel
                </p>
            </div>
        </div>
    ),
    args: {
        imageSrc: LUCIDE_STAR_SVG,
        width: 200,
        rotate: 15,
        peelBackHoverPct: 20,
        peelBackActivePct: 30,
        shadowIntensity: 0.5,
        lightingIntensity: 0.1,
        initialPosition: 'center',
        peelDirection: 0,
    },
};
