import type { Meta, StoryObj } from '@storybook/react';
import StaggeredMenu from './staggered-menu';
import { Home, Settings, User, Mail, LogOut } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Staggered Menu',
    component: StaggeredMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof StaggeredMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoItems = [
    { id: '1', label: 'Dashboard', icon: <Home size={18} /> },
    { id: '2', label: 'Profile', icon: <User size={18} /> },
    { id: '3', label: 'Messages', icon: <Mail size={18} /> },
    { id: '4', label: 'Settings', icon: <Settings size={18} /> },
    { id: '5', label: 'Logout', icon: <LogOut size={18} /> },
];

export const Default: Story = {
    args: {
        items: demoItems,
    },
    render: (args) => (
        <div className="flex items-center justify-center w-full min-h-[400px]">
            <StaggeredMenu {...args} />
        </div>
    )
};
