import * as React from 'react';
import {
    Body,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Column,
    Section,
    Tailwind,
} from '@react-email/components';
import { tokens } from './tokens';
import { EButton } from './components/e-button';
import { ECard } from './components/e-card';
import { EContainer } from './components/e-container';
import { EDivider } from './components/e-divider';
import { EText } from './components/e-text';

interface WelcomeEmailProps {
    firstName?: string;
    productName?: string;
    loginUrl?: string;
    docsUrl?: string;
    unsubscribeUrl?: string;
}

const FEATURES = [
    { icon: '🎨', title: 'Design Tokens', desc: 'A complete CSS variable system for light/dark mode and multi-brand theming.' },
    { icon: '⚛️', title: '45+ Components', desc: 'Every UI building block you need, built with Radix UI and Tailwind v4.' },
    { icon: '✨', title: 'React Bits', desc: 'High-end WebGL and Canvas visuals ready to drop into any project.' },
    { icon: '📦', title: 'Storybook v8', desc: 'Fully documented with live stories for every component and variant.' },
];

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
    firstName = 'Developer',
    productName = '[Brand] Design System',
    loginUrl = 'https://design.tuconcepto.com/login',
    docsUrl = 'https://design.tuconcepto.com/docs',
    unsubscribeUrl = 'https://design.tuconcepto.com/unsubscribe',
}) => (
    <Html lang="en" dir="ltr">
        <Head />
        <Preview>Welcome to {productName} — your design system is ready 🎉</Preview>
        <Body style={{ backgroundColor: tokens.muted, margin: 0, padding: '40px 0', fontFamily: tokens.fontFamily }}>
            <EContainer>
                {/* Header */}
                <Section style={{ textAlign: 'center', paddingBottom: '32px' }}>
                    <EText variant="label" align="center" style={{ color: tokens.mutedForeground, marginBottom: '8px' }}>
                        {productName}
                    </EText>
                    <EText variant="h1" align="center" style={{ margin: '0 0 8px' }}>
                        Welcome, {firstName}! 👋
                    </EText>
                    <EText variant="p" align="center" style={{ color: tokens.mutedForeground, maxWidth: '440px', margin: '0 auto 24px' }}>
                        Your account is ready. Start building beautiful, consistent interfaces with our design system.
                    </EText>
                    <EButton href={loginUrl} variant="primary">
                        Get Started →
                    </EButton>
                </Section>

                <EDivider />

                {/* Features */}
                <Section style={{ paddingBottom: '24px' }}>
                    <EText variant="h2" style={{ marginBottom: '20px' }}>
                        What's included
                    </EText>
                    {FEATURES.map((f, i) => (
                        <ECard key={i} padding="16px" style={{ marginBottom: '12px' }}>
                            <Row>
                                <Column style={{ width: '40px', verticalAlign: 'middle' }}>
                                    <span style={{ fontSize: '24px', lineHeight: '1' }}>{f.icon}</span>
                                </Column>
                                <Column style={{ verticalAlign: 'middle', paddingLeft: '12px' }}>
                                    <EText variant="h3" style={{ margin: '0 0 2px', fontSize: '15px' }}>{f.title}</EText>
                                    <EText variant="small" style={{ margin: 0 }}>{f.desc}</EText>
                                </Column>
                            </Row>
                        </ECard>
                    ))}
                </Section>

                <EDivider />

                {/* CTA secondary */}
                <Section style={{ textAlign: 'center', paddingBottom: '8px' }}>
                    <EText variant="p" align="center" style={{ marginBottom: '16px' }}>
                        Explore the full documentation to get the most out of your design system.
                    </EText>
                    <EButton href={docsUrl} variant="outline">
                        Read the Docs
                    </EButton>
                </Section>

                <EDivider />

                {/* Footer */}
                <Section>
                    <EText variant="small" align="center" style={{ color: tokens.mutedForeground }}>
                        You're receiving this because you signed up for {productName}.{' '}
                        <Link href={unsubscribeUrl} style={{ color: tokens.mutedForeground, textDecoration: 'underline' }}>
                            Unsubscribe
                        </Link>
                    </EText>
                    <EText variant="small" align="center" style={{ color: tokens.neutral400, marginBottom: 0 }}>
                        © {new Date().getFullYear()} [Brand] · All rights reserved
                    </EText>
                </Section>
            </EContainer>
        </Body>
    </Html>
);

export default WelcomeEmail;
