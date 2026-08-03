import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const featurePromoSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    features: z.array(z.string()),
    primaryColor: z.string(),
    brandName: z.string(),
});

type FeaturePromoProps = z.infer<typeof featurePromoSchema>;

export const FeaturePromo: React.FC<FeaturePromoProps> = ({
    title,
    subtitle,
    features,
    primaryColor,
    brandName,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animations
    const titleEnter = spring({ fps, frame, config: { damping: 12 } });
    const subtitleEnter = spring({ fps, frame: frame - 15, config: { damping: 12 } });

    const logoY = interpolate(frame, [250, 270], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const logoOpacity = interpolate(frame, [250, 270], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans), var(--font-inter), system-ui, sans-serif' }}>
            {/* Top decorative bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, backgroundColor: primaryColor }} />

            {/* Main Content Area */}
            <AbsoluteFill style={{ padding: '120px 160px', justifyContent: 'center' }}>
                <h1
                    style={{
                        fontSize: 120,
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: primaryColor,
                        margin: 0,
                        lineHeight: 1,
                        transform: `translateY(${50 - titleEnter * 50}px)`,
                        opacity: titleEnter,
                    }}
                >
                    {title}
                </h1>

                <p
                    style={{
                        fontSize: 48,
                        color: 'var(--muted-foreground)',
                        marginTop: 32,
                        marginBottom: 80,
                        transform: `translateY(${50 - subtitleEnter * 50}px)`,
                        opacity: subtitleEnter,
                    }}
                >
                    {subtitle}
                </p>

                {/* Staggered Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {features.map((feat, i) => {
                        const featEnter = spring({ fps, frame: frame - (45 + i * 15), config: { damping: 14 } });
                        return (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: 40,
                                    fontWeight: 600,
                                    color: 'var(--foreground)',
                                    transform: `translateX(${50 - featEnter * 50}px)`,
                                    opacity: featEnter,
                                }}
                            >
                                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: primaryColor, marginRight: 24 }} />
                                {feat}
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>

            {/* Outro Brand Reveal */}
            <AbsoluteFill
                style={{
                    backgroundColor: primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: logoOpacity,
                }}
            >
                <div
                    style={{
                        fontSize: 100,
                        fontWeight: 900,
                        color: 'var(--primary-foreground, #fff)',
                        transform: `translateY(${logoY}px)`,
                        letterSpacing: '-0.05em',
                    }}
                >
                    {brandName}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
