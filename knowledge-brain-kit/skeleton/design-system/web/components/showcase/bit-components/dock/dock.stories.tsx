import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Dock } from './dock';
import { Home, Search, Settings, Mail, User } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Dock',
    component: Dock,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
    {
        label: 'Home',
        icon: <Home className="w-5 h-5 text-white" />,
        onClick: () => console.log('Home')
    },
    {
        label: 'Search',
        icon: <Search className="w-5 h-5 text-white" />,
        onClick: () => console.log('Search')
    },
    {
        label: 'Mail',
        icon: <Mail className="w-5 h-5 text-white" />,
        onClick: () => console.log('Mail')
    },
    {
        label: 'Profile',
        icon: <User className="w-5 h-5 text-white" />,
        onClick: () => console.log('Profile')
    },
    {
        label: 'Settings',
        icon: <Settings className="w-5 h-5 text-white" />,
        onClick: () => console.log('Settings')
    }
];

export const Default: Story = {
    args: {
        items: items,
    },
    render: (args) => (
        <div className="w-full h-screen bg-black relative flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white/20">MacOS Dock UI</h1>
            <Dock {...args} />
        </div>
    )
};
