import type { Meta, StoryObj } from '@storybook/react';
import ScrollStack, { ScrollStackItem } from './scroll-stack';

const meta: Meta<typeof ScrollStack> = {
    title: 'Showcase/Bit Components/Scroll Stack',
    component: ScrollStack,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollStack>;

const CARDS = [
    {
        title: 'Mountain Views',
        desc: 'Discover breathtaking mountain landscapes that will leave you in awe.',
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        title: 'Ocean Depths',
        desc: 'Dive into the mysterious and beautiful world beneath the waves.',
        bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
        title: 'Desert Sands',
        desc: 'Experience the serene beauty of vast desert landscapes at golden hour.',
        bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        title: 'Forest Trails',
        desc: 'Walk through ancient forests filled with life and tranquil sounds.',
        bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        title: 'City Lights',
        desc: 'Experience the electric energy of a vibrant city after dark.',
        bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
];

export const Default: Story = {
    args: {
        itemDistance: 100,
        itemScale: 0.03,
        itemStackDistance: 30,
        stackPosition: '20%',
        scaleEndPosition: '10%',
        baseScale: 0.85,
        rotationAmount: 0,
        blurAmount: 0,
    },
    render: (args) => (
        <div style={{ width: '100%', height: '600px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <ScrollStack {...args}>
                {CARDS.map((card, i) => (
                    <ScrollStackItem key={i}>
                        <div
                            style={{
                                background: card.bg,
                                width: '100%',
                                height: '100%',
                                borderRadius: '28px',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                boxSizing: 'border-box',
                            }}
                        >
                            <h2 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 700 }}>
                                {card.title}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>
                                {card.desc}
                            </p>
                        </div>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </div>
    ),
};
