import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const typographyTokens = [
    { name: 'h1', size: '48px', lineHeight: '48px', weight: '600 (Semibold)', letterSpacing: '-1.5px', family: 'Geist' },
    { name: 'h2', size: '30px', lineHeight: '30px', weight: '600 (Semibold)', letterSpacing: '-1px', family: 'Geist' },
    { name: 'h3', size: '24px', lineHeight: '28.8px', weight: '600 (Semibold)', letterSpacing: '-1px', family: 'Geist' },
    { name: 'h4', size: '20px', lineHeight: '24px', weight: '600 (Semibold)', letterSpacing: '0', family: 'Geist' },
    { name: 'p', size: '16px', lineHeight: '24px', weight: '400 (Regular)', letterSpacing: '0', family: 'Geist' },
    { name: 'p-medium', size: '16px', lineHeight: '24px', weight: '500 (Medium)', letterSpacing: '0', family: 'Geist' },
    { name: 'p-bold', size: '16px', lineHeight: '24px', weight: '600 (Semibold)', letterSpacing: '0', family: 'Geist' },
    { name: 'small', size: '14px', lineHeight: '21px', weight: '400 (Regular)', letterSpacing: '0', family: 'Geist' },
    { name: 'mini', size: '12px', lineHeight: '16px', weight: '400 (Regular)', letterSpacing: '0', family: 'Geist' },
    { name: 'mono', size: '16px', lineHeight: '24px', weight: '400 (Regular)', letterSpacing: '0', family: 'Geist Mono' },
];

import { useThemeEngine } from '../../theme-provider';
import { FONTS, BASE_COLORS } from '~/lib/theme-config';

const TypographySample = ({ token, currentFont }: { token: typeof typographyTokens[0], currentFont: string }) => {
    const isMono = token.name === 'mono';

    // Determine the actual mono font name for display
    const fontConfig = BASE_COLORS.find(f => f.name === currentFont) ||
        FONTS.find(f => f.name === currentFont) ||
        FONTS[0];
    const monoFontRaw = (fontConfig as any).mono || 'Geist Mono';
    // Clean up var() for display if needed, or just show the name
    const monoFontDisplay = monoFontRaw.startsWith('var(') ? 'Geist Mono' : monoFontRaw;

    // Use the CSS variable we set in theme-provider
    const fontFamily = isMono ? 'var(--font-mono)' : undefined;
    const displayFamily = isMono ? monoFontDisplay : currentFont;

    return (
        <div className="flex flex-col gap-2 py-4 border-b border-border">
            <div className="flex items-baseline gap-4">
                <span
                    className="text-foreground"
                    style={{
                        fontSize: token.size,
                        lineHeight: token.lineHeight,
                        fontWeight: parseInt(token.weight),
                        letterSpacing: token.letterSpacing,
                        fontFamily: fontFamily,
                    }}
                >
                    {token.name === 'mono' ? 'The quick brown fox (mono)' : `The quick brown fox (${token.name})`}
                </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-mono">
                <span>font-size: {token.size}</span>
                <span>line-height: {token.lineHeight}</span>
                <span>weight: {token.weight}</span>
                <span>letter-spacing: {token.letterSpacing}</span>
                <span>family: {displayFamily}</span>
            </div>
        </div>
    );
};

const AllTypography = () => {
    const { themeConfig } = useThemeEngine();
    const currentFont = themeConfig.font;

    return (
        <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl font-bold text-foreground mb-1">Typography System</h2>
            <p className="text-muted-foreground mb-6">
                Font: <strong>{currentFont}</strong> (sans). Mono font dynamic based on selection.
            </p>
            {typographyTokens.map((token) => (
                <TypographySample key={token.name} token={token} currentFont={currentFont} />
            ))}
        </div>
    );
};

const meta: Meta = {
    title: 'Foundations/Typography',
    component: AllTypography,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <AllTypography />,
};
