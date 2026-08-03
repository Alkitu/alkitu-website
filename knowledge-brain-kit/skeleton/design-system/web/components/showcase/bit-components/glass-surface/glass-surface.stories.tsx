import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import GlassSurface from './glass-surface';

const meta = {
    title: 'Showcase/Bit Components/Glass Surface',
    component: GlassSurface,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof GlassSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Background content: colourful text blocks + images stacked vertically.
   The sticky glass floats over them so the chromatic-aberration / displacement
   effect is visible everywhere. */
const BG_BLOCKS = [
    {
        title: 'The Summer Of Glass',
        sub: 'A glassy surface that distorts the world beneath it with chromatic aberration and light displacement.',
        img: '/gallery/landscape-05-beach.png',
    },
    {
        title: 'Can Hold Any Content',
        sub: 'Works on text, images, gradients – anything rendered beneath it becomes part of the effect.',
        img: '/gallery/landscape-07-aurora.png',
    },
    {
        title: 'Built With SVG Filters',
        sub: 'Powered by feDisplacementMap and feColorMatrix primitives with independent R, G, B channel offsets for realistic refraction.',
        img: '/gallery/landscape-04-mountain.png',
    },
];

export const Default: Story = {
    args: {
        width: 320,
        height: 120,
        borderRadius: 60,
        opacity: 0.93,
        displace: 0.5,
        distortionScale: -180,
        redOffset: 0,
        greenOffset: 10,
        blueOffset: 20,
        brightness: 50,
        mixBlendMode: 'screen',
    },
    render: (args) => (
        <div
            style={{
                width: '100%',
                minHeight: '200vh',
                background: '#050510',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
                overflowX: 'hidden',
            }}
        >
            {/* ── Background scrollable content ── */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 0,
                    width: '100%',
                    maxWidth: '720px',
                    padding: '80px 24px 120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '80px',
                }}
            >
                {/* Hero heading */}
                <div
                    style={{
                        color: '#fff',
                        fontSize: '4rem',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Glass Surface
                </div>

                {/* Content blocks */}
                {BG_BLOCKS.map((block, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Image card */}
                        <div
                            style={{
                                width: '100%',
                                height: '320px',
                                borderRadius: '40px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={block.img}
                                alt={block.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3)' }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '2rem',
                                    background: 'rgba(0,0,0,0.35)',
                                }}
                            >
                                <h2
                                    style={{
                                        color: '#fff',
                                        fontSize: '2.5rem',
                                        fontWeight: 900,
                                        textAlign: 'center',
                                        margin: 0,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {block.title}
                                </h2>
                            </div>
                        </div>

                        {/* Text paragraph */}
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1.125rem',
                                lineHeight: 1.7,
                                margin: 0,
                                textAlign: 'center',
                            }}
                        >
                            {block.sub}
                        </p>

                        {/* Colourful gradient bar – great for seeing the refraction */}
                        <div
                            style={{
                                height: '4px',
                                borderRadius: '100px',
                                background: `linear-gradient(90deg, hsl(${i * 80},80%,60%), hsl(${i * 80 + 180},80%,60%))`,
                                opacity: 0.6,
                            }}
                        />
                    </div>
                ))}

                {/* Large text block at the bottom */}
                <div
                    style={{
                        color: 'rgba(255,255,255,0.15)',
                        fontSize: '6rem',
                        fontWeight: 900,
                        lineHeight: 1,
                        textAlign: 'center',
                        letterSpacing: '-0.04em',
                        userSelect: 'none',
                    }}
                >
                    GLASS
                </div>
            </div>

            {/* ── Fixed glass — always centered on screen ── */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    pointerEvents: 'none',
                }}
            >
                <div style={{ pointerEvents: 'auto' }}>
                    <GlassSurface {...args}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </GlassSurface>
                </div>
            </div>
        </div>
    ),
};

/* Pill variant — thinner bar to show the chromatic-aberration edge more clearly */
export const Pill: Story = {
    args: {
        width: 400,
        height: 80,
        borderRadius: 40,
        opacity: 0.95,
        displace: 0.3,
        distortionScale: -200,
        redOffset: 0,
        greenOffset: 15,
        blueOffset: 30,
        brightness: 60,
        mixBlendMode: 'screen',
    },
    render: (args) => (
        <div
            style={{
                width: '100%',
                minHeight: '180vh',
                background: 'linear-gradient(160deg, #0a0a1a 0%, #12022a 50%, #0a1a0a 100%)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
                overflowX: 'hidden',
                padding: '60px 24px',
            }}
        >
            {/* Rich text content */}
            {['Chromatic', 'Aberration', 'Effect', 'Glass', 'Surface', 'Refraction', 'Distortion'].map((word, i) => (
                <div
                    key={i}
                    style={{
                        marginBottom: '60px',
                        textAlign: 'center',
                        color: `hsl(${i * 45}, 70%, 70%)`,
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {word}
                </div>
            ))}

            {/* Fixed pill */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    pointerEvents: 'none',
                }}
            >
                <div style={{ pointerEvents: 'auto' }}>
                    <GlassSurface {...args} />
                </div>
            </div>
        </div>
    ),
};
