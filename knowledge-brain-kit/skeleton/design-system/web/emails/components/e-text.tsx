import * as React from 'react';
import {
    Heading as EmailHeading,
    Text as EmailText,
} from '@react-email/components';
import { tokens } from '../tokens';

type TextVariant = 'h1' | 'h2' | 'h3' | 'p' | 'small' | 'muted' | 'label';

export interface ETextProps {
    variant?: TextVariant;
    children: React.ReactNode;
    style?: React.CSSProperties;
    align?: 'left' | 'center' | 'right';
}

const VARIANT_STYLES: Record<TextVariant, React.CSSProperties> = {
    h1: { fontSize: '36px', fontWeight: '700', lineHeight: '1.15', letterSpacing: '-0.02em', color: tokens.foreground, margin: '0 0 16px' },
    h2: { fontSize: '24px', fontWeight: '600', lineHeight: '1.25', letterSpacing: '-0.01em', color: tokens.foreground, margin: '0 0 12px' },
    h3: { fontSize: '18px', fontWeight: '600', lineHeight: '1.35', color: tokens.foreground, margin: '0 0 8px' },
    p: { fontSize: '16px', fontWeight: '400', lineHeight: '1.6', color: tokens.foregroundAlt, margin: '0 0 16px' },
    small: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5', color: tokens.mutedForeground, margin: '0 0 8px' },
    muted: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5', color: tokens.mutedForeground, margin: '0 0 8px' },
    label: { fontSize: '12px', fontWeight: '600', lineHeight: '1', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: tokens.mutedForeground, margin: '0 0 4px' },
};

export const EText: React.FC<ETextProps> = ({
    variant = 'p',
    children,
    style,
    align = 'left',
}) => {
    const baseStyle: React.CSSProperties = {
        fontFamily: tokens.fontFamily,
        textAlign: align,
        ...VARIANT_STYLES[variant],
        ...style,
    };

    if (variant === 'h1' || variant === 'h2' || variant === 'h3') {
        const level = variant === 'h1' ? 1 : variant === 'h2' ? 2 : 3;
        return (
            <EmailHeading as={`h${level}` as 'h1' | 'h2' | 'h3'} style={baseStyle}>
                {children}
            </EmailHeading>
        );
    }

    return <EmailText style={baseStyle}>{children}</EmailText>;
};
