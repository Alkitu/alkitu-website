import * as React from 'react';
import { Button as EmailButton } from '@react-email/components';
import { tokens } from '../tokens';

export interface EButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
    width?: string | number;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
    primary: {
        backgroundColor: tokens.primary,
        color: tokens.primaryForeground,
        border: 'none',
    },
    secondary: {
        backgroundColor: tokens.accent,
        color: tokens.accentForeground,
        border: `1px solid ${tokens.border}`,
    },
    destructive: {
        backgroundColor: tokens.destructive,
        color: '#ffffff',
        border: 'none',
    },
    outline: {
        backgroundColor: 'transparent',
        color: tokens.primary,
        border: `1px solid ${tokens.primary}`,
    },
};

export const EButton: React.FC<EButtonProps> = ({
    href,
    children,
    variant = 'primary',
    width = 'auto',
}) => (
    <EmailButton
        href={href}
        style={{
            ...VARIANT_STYLES[variant],
            fontFamily: tokens.fontFamily,
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '1',
            borderRadius: tokens.borderRadius,
            padding: '12px 24px',
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer',
            width,
            textAlign: 'center',
            boxSizing: 'border-box',
        }}
    >
        {children}
    </EmailButton>
);
