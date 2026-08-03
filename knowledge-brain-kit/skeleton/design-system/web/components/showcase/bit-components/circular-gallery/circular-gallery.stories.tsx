import type { Meta, StoryObj } from '@storybook/react';
import CircularGallery from './circular-gallery';

const sampleItems = [
    { image: '/gallery/landscape-01-valley.png', text: 'Classic Red' },
    { image: '/gallery/tech-01-laptop.png', text: 'Headphones' },
    { image: '/gallery/landscape-02-forest.png', text: 'Watch' },
    { image: '/gallery/landscape-03-coastal.png', text: 'Camera Lens' },
    { image: '/gallery/landscape-05-beach.png', text: 'Laptop' },
];

const meta = {
    title: 'Showcase/Bit Components/Circular Gallery',
    component: CircularGallery,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        bend: { control: 'number' },
        textColor: { control: 'color' },
        borderRadius: { control: 'number' },
    }
} satisfies Meta<typeof CircularGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: sampleItems,
        bend: 3,
        textColor: '#ffffff',
        borderRadius: 0.05,
    } as any,
    render: (args) => (
        <div className="w-full h-screen bg-zinc-950 flex flex-col items-center justify-center p-0 m-0 overflow-hidden">
            <CircularGallery {...args} />
        </div>
    ),
};
