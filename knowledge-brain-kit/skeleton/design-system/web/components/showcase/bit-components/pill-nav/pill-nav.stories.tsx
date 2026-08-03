import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PillNav } from './pill-nav';
import { Home, Compass, Bell, Settings, Search, Heart } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Pill Nav',
    component: PillNav,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof PillNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'search', label: 'Search', icon: <Search size={18} /> },
    { id: 'explore', label: 'Explore', icon: <Compass size={18} /> },
    { id: 'activity', label: 'Activity', icon: <Heart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export const Default: Story = {
    args: {} as any,
    render: () => (
        <div className="w-full h-[300px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-12 min-w-[500px]">
            <div className="text-center mb-12">
                <h3 className="text-xl font-semibold mb-2">Dynamic Island / Morphing Nav</h3>
                <p className="text-muted-foreground text-sm">Click an icon to expand its label.</p>
            </div>
            <PillNav items={items} />
        </div>
    )
};
