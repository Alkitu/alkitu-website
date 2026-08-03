import type { Meta, StoryObj } from '@storybook/react';
import { ImageTrail } from './image-trail';

const placeholders = [
    '/gallery/landscape-01-valley.png',
    '/gallery/landscape-02-forest.png',
    '/gallery/landscape-03-coastal.png',
    '/gallery/landscape-04-mountain.png',
    '/gallery/landscape-05-beach.png',
    '/gallery/landscape-06-desert.png',
];

const meta = {
    title: 'Showcase/Animations/Image Trail',
    component: ImageTrail,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: [1, 2, 3],
        }
    }
} satisfies Meta<typeof ImageTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-background border flex flex-col items-center justify-center p-12 overflow-hidden overflow-y-auto">
            <h1 className="text-4xl lg:text-6xl font-black text-white text-center tracking-tighter mb-4 z-10 pointer-events-none mix-blend-difference">
                Hover Around
            </h1>
            <p className="text-white/70 z-10 pointer-events-none text-center mix-blend-difference">
                Images will manifest out of thin air tracing your mouse.
            </p>

            {/* The absolute inset ensures the trail tracks mouse movement over the whole screen */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <ImageTrail {...args} />
            </div>
        </div>
    ),
    args: {
        items: [...placeholders, ...placeholders, ...placeholders], // Providing a larger pool
        variant: 1,
    }
};

export const Variant2: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-foreground flex flex-col items-center justify-center overflow-hidden text-background">
            <h1 className="text-5xl text-white font-black mb-4 z-10 pointer-events-none mix-blend-difference">
                Variant 2 (Bright Fade In)
            </h1>
            <div className="absolute inset-0 z-0 overflow-hidden">
                <ImageTrail {...args} />
            </div>
        </div>
    ),
    args: {
        items: [...placeholders, ...placeholders, ...placeholders],
        variant: 2,
    }
};

export const Variant3: Story = {
    render: (args) => (
        <div className="w-full h-[600px] relative bg-background flex flex-col items-center justify-center overflow-hidden border">
            <h1 className="text-5xl text-white font-black mb-4 z-10 pointer-events-none mix-blend-difference">
                Variant 3 (Float Up)
            </h1>
            <div className="absolute inset-0 z-0 overflow-hidden">
                <ImageTrail {...args} />
            </div>
        </div>
    ),
    args: {
        items: [...placeholders, ...placeholders, ...placeholders],
        variant: 3,
    }
};
