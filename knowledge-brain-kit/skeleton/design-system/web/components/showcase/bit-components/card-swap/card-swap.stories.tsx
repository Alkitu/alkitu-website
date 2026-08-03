import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CardSwap, { Card } from './card-swap';

const meta = {
    title: 'Showcase/Bit Components/Card Swap',
    component: CardSwap,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CardSwap>;

export default meta;
type Story = StoryObj<typeof meta>;

const CARD_STYLES: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '1.5rem',
    boxSizing: 'border-box',
};

export const Default: Story = {
    render: () => (
        <div style={{ height: '600px', width: '100%', background: '#050510', position: 'relative', overflow: 'hidden' }}>
            <CardSwap cardDistance={60} verticalDistance={70} delay={5000} width={500} height={400} easing="elastic" skewAmount={6}>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Mountain Views</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>Breathtaking landscapes that will leave you in awe.</p>
                </Card>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Ocean Depths</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>Dive into the mysterious world beneath the waves.</p>
                </Card>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Desert Sands</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>Experience the serene beauty at golden hour.</p>
                </Card>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Forest Trails</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>Ancient forests filled with life and tranquil sounds.</p>
                </Card>
            </CardSwap>
        </div>
    ),
};

export const Linear: Story = {
    render: () => (
        <div style={{ height: '600px', width: '100%', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
            <CardSwap cardDistance={50} verticalDistance={60} delay={3000} pauseOnHover width={400} height={320} easing="linear" skewAmount={3}>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', border: '1px solid #533483' }}>
                    <h3 style={{ color: '#e94560', margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Design System</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>Pause on hover enabled — linear easing.</p>
                </Card>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', border: '1px solid #30363d' }}>
                    <h3 style={{ color: '#58a6ff', margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Components</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>Built with React + TypeScript.</p>
                </Card>
                <Card style={{ ...CARD_STYLES, background: 'linear-gradient(135deg, #1c1429 0%, #2d1b69 100%)', border: '1px solid #8b5cf6' }}>
                    <h3 style={{ color: '#a78bfa', margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Animations</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>Powered by GSAP physics.</p>
                </Card>
            </CardSwap>
        </div>
    ),
};
