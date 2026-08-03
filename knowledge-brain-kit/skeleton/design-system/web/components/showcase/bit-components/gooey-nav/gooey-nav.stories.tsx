import type { Meta, StoryObj } from '@storybook/react';
import GooeyNav from './gooey-nav';
import { Home, Compass, User, Bell } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Gooey Nav',
    component: GooeyNav,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        color: {
            control: 'color'
        }
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GooeyNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const customItems = [
    { id: 'home', icon: <Home size={24} /> },
    { id: 'explore', icon: <Compass size={24} /> },
    { id: 'notifications', icon: <Bell size={24} /> },
    { id: 'profile', icon: <User size={24} /> },
];

export const Default: Story = {
    args: {
        items: customItems,
        color: 'var(--primary)',
        blurSize: '10px'
    },
    render: (args) => (
        <div className="w-full min-h-[400px] flex items-center justify-center bg-black">
            <GooeyNav {...args} />
        </div>
    )
};
