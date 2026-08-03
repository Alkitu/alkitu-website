import * as React from 'react';
import { Container as EmailContainer, Section } from '@react-email/components';
import { tokens } from '../tokens';

export interface EContainerProps {
    children: React.ReactNode;
    paddingX?: string | number;
    paddingY?: string | number;
    style?: React.CSSProperties;
}

export const EContainer: React.FC<EContainerProps> = ({
    children,
    paddingX = '32px',
    paddingY = '40px',
    style,
}) => (
    <EmailContainer
        style={{
            maxWidth: tokens.maxWidth,
            margin: '0 auto',
            backgroundColor: tokens.background,
            fontFamily: tokens.fontFamily,
            ...style,
        }}
    >
        <Section
            style={{
                paddingLeft: paddingX,
                paddingRight: paddingX,
                paddingTop: paddingY,
                paddingBottom: paddingY,
            }}
        >
            {children}
        </Section>
    </EmailContainer>
);
