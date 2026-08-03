import type { Meta, StoryObj } from '@storybook/react';
import FlyingPosters from './flying-posters';

const meta = {
    title: 'Showcase/Bit Components/Flying Posters',
    component: FlyingPosters,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        planeWidth: {
            control: { type: 'range', min: 100, max: 800, step: 10 },
            description: 'The width of the 3D plane for each poster.',
        },
        planeHeight: {
            control: { type: 'range', min: 100, max: 800, step: 10 },
            description: 'The height of the 3D plane for each poster.',
        },
        distortion: {
            control: { type: 'range', min: 0, max: 10, step: 0.1 },
            description: 'Controls the amount of curve/distortion shader applied during motion.',
        },
        scrollEase: {
            control: { type: 'range', min: 0.001, max: 0.1, step: 0.001 },
            description: 'Easing inertia for scrolling.',
        },
        cameraFov: {
            control: { type: 'range', min: 20, max: 120, step: 1 },
            description: 'Field of view of the 3D camera.',
        },
        cameraZ: {
            control: { type: 'range', min: 5, max: 50, step: 1 },
            description: 'Z-axis position of the 3D camera.',
        }
    },
    decorators: [
        (Story) => (
            <div className="h-screen w-full bg-neutral-950">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FlyingPosters>;

export default meta;
type Story = StoryObj<typeof meta>;

// Custom array of high-quality Unsplash image URLs for the posters
const samplePosters = [
    '/gallery/landscape-01-valley.png',
    '/gallery/landscape-02-forest.png',
    '/gallery/landscape-03-coastal.png',
    '/gallery/landscape-04-mountain.png',
    '/gallery/landscape-05-beach.png',
    '/gallery/landscape-06-desert.png',
];

export const Default: Story = {
    args: {
        items: samplePosters,
        planeWidth: 320,
        planeHeight: 450,
        distortion: 3,
        scrollEase: 0.015,
        cameraFov: 45,
        cameraZ: 20
    }
};

export const HighDistortion: Story = {
    args: {
        items: samplePosters,
        planeWidth: 400,
        planeHeight: 250,
        distortion: 7,
        scrollEase: 0.02,
        cameraFov: 50,
        cameraZ: 18
    }
};
