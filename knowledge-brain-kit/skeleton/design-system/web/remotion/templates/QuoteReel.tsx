import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const quoteReelSchema = z.object({
    quote: z.string(),
    author: z.string(),
    accentColor: z.string(),
});

type QuoteReelProps = z.infer<typeof quoteReelSchema>;

export const QuoteReel: React.FC<QuoteReelProps> = ({ quote, author, accentColor }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Kinetic typography logic
    const words = quote.split(' ');

    const bgRotate = interpolate(frame, [0, 150], [0, 45]);
    const bgScale = interpolate(frame, [0, 150], [1, 1.2]);

    const authorEnter = spring({ fps, frame: frame - 60, config: { damping: 12 } });

    return (
        <AbsoluteFill style={{ backgroundColor: 'var(--background)', overflow: 'hidden', fontFamily: 'var(--font-sans), var(--font-inter), system-ui, sans-serif' }}>
            {/* Animated Gradient Background */}
            <div
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle at center, ${accentColor}33 0%, transparent 60%)`,
                    transform: `rotate(${bgRotate}deg) scale(${bgScale})`,
                }}
            />

            <AbsoluteFill style={{ padding: 80, justifyContent: 'center' }}>
                <div style={{ fontSize: 140, fontWeight: 900, lineHeight: 1.1, color: 'var(--foreground)', letterSpacing: '-0.04em' }}>
                    {words.map((w, i) => {
                        const wordDelay = i * 4;
                        const wordEnter = spring({
                            fps,
                            frame: frame - wordDelay,
                            config: { damping: 14, mass: 0.8 },
                        });

                        return (
                            <span
                                key={i}
                                style={{
                                    display: 'inline-block',
                                    marginRight: 32,
                                    transform: `translateY(${100 - wordEnter * 100}px) rotate(${10 - wordEnter * 10}deg)`,
                                    opacity: interpolate(wordEnter, [0, 1], [0, 1]),
                                    color: i === words.length - 1 ? accentColor : 'var(--foreground)',
                                }}
                            >
                                {w}
                            </span>
                        );
                    })}
                </div>

                <div
                    style={{
                        marginTop: 100,
                        fontSize: 60,
                        color: 'var(--muted-foreground)',
                        fontWeight: 500,
                        transform: `translateY(${40 - authorEnter * 40}px)`,
                        opacity: authorEnter,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 32,
                    }}
                >
                    <div style={{ height: 4, width: 80, backgroundColor: accentColor }} />
                    {author}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
