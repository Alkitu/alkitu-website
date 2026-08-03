import * as React from 'react';
import { Hr } from '@react-email/components';
import { tokens } from '../tokens';

export interface EDividerProps {
    color?: string;
    marginY?: string | number;
}

export const EDivider: React.FC<EDividerProps> = ({
    color = tokens.border,
    marginY = '24px',
}) => (
    <Hr
        style={{
            borderTop: `1px solid ${color}`,
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            marginTop: marginY,
            marginBottom: marginY,
            width: '100%',
        }}
    />
);
