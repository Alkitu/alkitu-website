import type { Meta, StoryObj } from '@storybook/react';
import { ChromaGrid, type ChromaItem } from './chroma-grid';

const meta = {
    title: 'Showcase/Animations/Chroma Grid',
    component: ChromaGrid,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ChromaGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const CUSTOM_ITEMS: ChromaItem[] = [
    {
        image: '/gallery/avatar-01-woman.png',
        title: 'Sarah Johnson',
        subtitle: 'Frontend Developer',
        handle: '@sarahjohnson',
        borderColor: '#3B82F6',
        gradient: 'linear-gradient(145deg, #3B82F6, #000)',
        url: 'https://github.com/',
    },
    {
        image: '/gallery/tech-01-laptop.png',
        title: 'Mike Chen',
        subtitle: 'Backend Engineer',
        handle: '@mikechen',
        borderColor: '#10B981',
        gradient: 'linear-gradient(180deg, #10B981, #000)',
        url: 'https://linkedin.com/',
    },
];

export const Default: Story = {
    args: {
        radius: 300,
        damping: 0.45,
        fadeOut: 0.6,
        ease: 'power3.out',
        columns: 3,
    },
    render: (args) => (
        <div style={{ height: '700px', width: '100%', background: '#050505', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <ChromaGrid {...args} />
        </div>
    ),
};

export const CustomItems: Story = {
    args: {
        items: CUSTOM_ITEMS,
        radius: 250,
        columns: 2,
        damping: 0.4,
    },
    render: (args) => (
        <div style={{ height: '600px', width: '100%', background: '#050505', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <ChromaGrid {...args} />
        </div>
    ),
};
