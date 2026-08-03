import type { Meta, StoryObj } from '@storybook/react';
import FlowingMenu from './flowing-menu';

const meta: Meta<typeof FlowingMenu> = {
    title: 'Showcase/Bit Components/Flowing Menu',
    component: FlowingMenu,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FlowingMenu>;

const demoItems = [
    { link: '#', text: 'Mojave', image: '/gallery/landscape-01-valley.png' },
    { link: '#', text: 'Sonoma', image: '/gallery/landscape-03-coastal.png' },
    { link: '#', text: 'Monterey', image: '/gallery/landscape-05-beach.png' },
    { link: '#', text: 'Sequoia', image: '/gallery/landscape-02-forest.png' }
];

export const Default: Story = {
    args: {
        items: demoItems,
        speed: 15,
        textColor: '#ffffff',
        bgColor: '#060010',
        marqueeBgColor: '#ffffff',
        marqueeTextColor: '#060010',
        borderColor: '#ffffff'
    },
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', overflow: 'hidden' }}>
            <FlowingMenu {...args} />
        </div>
    ),
};
