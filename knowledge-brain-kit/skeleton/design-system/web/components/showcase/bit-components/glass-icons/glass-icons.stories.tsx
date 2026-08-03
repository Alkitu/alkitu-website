import type { Meta, StoryObj } from '@storybook/react';
import GlassIcons from './glass-icons';
import { FileText, Book, Heart, Cloud, Edit, BarChart2 } from 'lucide-react';

const meta: Meta<typeof GlassIcons> = {
    title: 'Showcase/Bit Components/Glass Icons',
    component: GlassIcons,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlassIcons>;

const items = [
    { icon: <FileText className="w-full h-full" />, color: 'blue', label: 'Files' },
    { icon: <Book className="w-full h-full" />, color: 'purple', label: 'Books' },
    { icon: <Heart className="w-full h-full" />, color: 'red', label: 'Health' },
    { icon: <Cloud className="w-full h-full" />, color: 'indigo', label: 'Weather' },
    { icon: <Edit className="w-full h-full" />, color: 'orange', label: 'Notes' },
    { icon: <BarChart2 className="w-full h-full" />, color: 'green', label: 'Stats' },
];

export const Default: Story = {
    args: {
        items: items,
    },
    render: (args) => (
        <div className="flex h-[600px] w-full items-center justify-center p-12 bg-background border rounded-xl overflow-hidden shadow-sm">
            <GlassIcons {...args} />
        </div>
    ),
};
