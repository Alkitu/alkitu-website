import type { Meta, StoryObj } from '@storybook/react';
import ElasticSlider from './elastic-slider';

const meta: Meta<typeof ElasticSlider> = {
    title: 'Showcase/Bit Components/Elastic Slider',
    component: ElasticSlider,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ElasticSlider>;

export const Default: Story = {
    args: {
        startingValue: 0,
        defaultValue: 50,
        maxValue: 100,
        isStepped: false,
        stepSize: 1
    },
    render: (args) => (
        <div className="flex h-[400px] w-full items-center justify-center p-12 bg-background border rounded-xl overflow-hidden shadow-sm relative">
            <ElasticSlider {...args} />
        </div>
    ),
};
