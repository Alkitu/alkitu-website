import type { Meta, StoryObj } from '@storybook/react';
import BounceCards from './bounce-cards';

const meta: Meta<typeof BounceCards> = {
    title: 'Showcase/Bit Components/Bounce Cards',
    component: BounceCards,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BounceCards>;

const images = [
    "/gallery/landscape-01-valley.png",
    "/gallery/landscape-02-forest.png",
    "/gallery/landscape-03-coastal.png",
    "/gallery/landscape-04-mountain.png",
    "/gallery/landscape-05-beach.png"
];

const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)"
];

export const Default: Story = {
    args: {
        images,
        containerWidth: 500,
        containerHeight: 250,
        animationDelay: 0.5,
        animationStagger: 0.08,
        easeType: 'elastic.out(1, 0.5)',
        transformStyles,
        enableHover: true,
    },
    render: (args) => (
        <div className="flex w-full h-[600px] items-center justify-center bg-background border rounded-xl overflow-hidden shadow-sm relative">
            <BounceCards {...args} />
        </div>
    ),
};
