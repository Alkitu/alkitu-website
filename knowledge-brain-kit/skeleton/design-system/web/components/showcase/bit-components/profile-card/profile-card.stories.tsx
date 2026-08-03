import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProfileCard } from './profile-card';

const meta = {
    title: 'Showcase/Bit Components/Profile Card',
    component: ProfileCard,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: '[Brand]',
        title: 'Design System Architect',
        handle: 'tuconcepto',
        status: 'Available',
    },
    render: (args) => (
        <div className="w-[800px] h-[800px] flex items-center justify-center relative bg-neutral-900 rounded-3xl">
            <div className="w-1/2">
                <ProfileCard {...args} />
            </div>
        </div>
    )
};
