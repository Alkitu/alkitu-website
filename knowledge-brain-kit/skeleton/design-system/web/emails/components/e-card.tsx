import * as React from 'react';
import { Section } from '@react-email/components';
import { tokens } from '../tokens';

export interface ECardProps {
    children: React.ReactNode;
    padding?: string | number;
    style?: React.CSSProperties;
}

export const ECard: React.FC<ECardProps> = ({
    children,
    padding = '24px',
    style,
}) => (
    <Section
        style={{
            backgroundColor: tokens.card,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.borderRadius,
            padding,
            width: '100%',
            boxSizing: 'border-box',
            ...style,
        }}
    >
        {children}
    </Section>
);
