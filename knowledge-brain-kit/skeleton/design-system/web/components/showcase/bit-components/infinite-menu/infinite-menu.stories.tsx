import type { Meta, StoryObj } from '@storybook/react';
import InfiniteMenu from './infinite-menu';

const meta: Meta<typeof InfiniteMenu> = {
    title: 'Showcase/Bit Components/Infinite Menu',
    component: InfiniteMenu,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfiniteMenu>;

const items = [
    {
        image: '/gallery/landscape-04-mountain.png',
        link: '#',
        title: 'Sonoma',
        description: 'This is a description'
    },
    {
        image: '/gallery/landscape-06-desert.png',
        link: '#',
        title: 'Monterey',
        description: 'This is a description'
    },
    {
        image: '/gallery/landscape-07-aurora.png',
        link: '#',
        title: 'Sequoia',
        description: 'This is a description'
    },
    {
        image: '/gallery/landscape-01-valley.png',
        link: '#',
        title: 'Mojave',
        description: 'This is a description'
    }
];

export const Default: Story = {
    args: {
        items,
        scale: 1,
    },
    render: (args) => (
        <div style={{ width: '100%', minWidth: '800px', height: '600px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: '#060010' }}>
            <InfiniteMenu {...args} />
        </div>
    ),
};
