import type { Meta, StoryObj } from '@storybook/react';
import DecayCard from './decay-card';

const meta: Meta<typeof DecayCard> = {
    title: 'Showcase/Bit Components/Decay Card',
    component: DecayCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DecayCard>;

export const Default: Story = {
    args: {
        width: 300,
        height: 400,
        image: '/gallery/landscape-06-desert.png',
        children: <h2>Decay<br />Card</h2>
    },
    render: (args) => (
        <div className="flex h-[600px] w-full items-center justify-center p-12 bg-background overflow-hidden relative">
            <DecayCard {...args} />
        </div>
    ),
};
