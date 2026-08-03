import type { Meta, StoryObj } from '@storybook/react';
import PixelCard from './pixel-card';
import { Ghost, Shield, Zap } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Pixel Card',
    component: PixelCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PixelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        color: 'var(--primary)',
        gridSize: 15,
        duration: 0.6,
        className: 'w-[300px] h-[400px]',
    },
    render: (args) => (
        <PixelCard {...args}>
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <Ghost size={48} className="text-white" />
                <h3 className="text-2xl font-bold tracking-tight text-white font-sans">Hover Me</h3>
                <p className="text-sm font-sans text-neutral-400">Discover the digital noise hidden within.</p>
            </div>
        </PixelCard>
    )
};

export const MultipleColors: Story = {
    render: () => (
        <div className="flex flex-wrap gap-6 items-center justify-center bg-black p-10 rounded-2xl">
            <PixelCard color="#3b82f6" className="w-[250px] h-[350px]">
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <Shield size={32} className="text-white" />
                    <h3 className="text-xl font-bold text-white font-sans">Security</h3>
                </div>
            </PixelCard>
            <PixelCard color="#ec4899" className="w-[250px] h-[350px]" gridSize={20}>
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <Zap size={32} className="text-white" />
                    <h3 className="text-xl font-bold text-white font-sans">Performance</h3>
                </div>
            </PixelCard>
        </div>
    )
};
