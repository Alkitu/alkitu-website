import * as React from 'react';
import {
    Body,
    Column,
    Head,
    Html,
    Link,
    Preview,
    Row,
    Section,
} from '@react-email/components';
import { tokens } from './tokens';
import { EButton } from './components/e-button';
import { ECard } from './components/e-card';
import { EContainer } from './components/e-container';
import { EDivider } from './components/e-divider';
import { EText } from './components/e-text';

interface PasswordResetProps {
    firstName?: string;
    resetUrl?: string;
    expiresInMinutes?: number;
    ipAddress?: string;
    requestedAt?: string;
}

export const PasswordResetEmail: React.FC<PasswordResetProps> = ({
    firstName = 'Developer',
    resetUrl = 'https://design.tuconcepto.com/reset?token=abc123',
    expiresInMinutes = 60,
    ipAddress = '192.168.1.1',
    requestedAt = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }),
}) => (
    <Html lang="en" dir="ltr">
        <Head />
        <Preview>Reset your password — link expires in {String(expiresInMinutes)} minutes</Preview>
        <Body style={{ backgroundColor: tokens.muted, margin: 0, padding: '40px 0', fontFamily: tokens.fontFamily }}>
            <EContainer>
                {/* Header */}
                <Section style={{ textAlign: 'center', paddingBottom: '24px' }}>
                    <EText variant="label" align="center" style={{ color: tokens.mutedForeground, marginBottom: '8px' }}>
                        Account Security
                    </EText>
                    <EText variant="h1" align="center" style={{ margin: '0 0 8px' }}>
                        Reset your password
                    </EText>
                    <EText variant="p" align="center" style={{ color: tokens.mutedForeground }}>
                        Hi {firstName}, we received a request to reset your password.
                    </EText>
                </Section>

                {/* Security notice */}
                <ECard
                    padding="16px"
                    style={{
                        backgroundColor: tokens.destructiveSubtle,
                        border: `1px solid ${tokens.destructiveBorder}`,
                        marginBottom: '24px',
                    }}
                >
                    <Row>
                        <Column style={{ width: '32px', verticalAlign: 'middle' }}>
                            <span style={{ fontSize: '20px' }}>⚠️</span>
                        </Column>
                        <Column style={{ paddingLeft: '12px', verticalAlign: 'middle' }}>
                            <EText variant="small" style={{ margin: 0, color: tokens.destructive }}>
                                <strong>Security alert:</strong> If you didn't request this, your account may be at risk.{' '}
                                <Link href="mailto:security@brain.com" style={{ color: tokens.destructive }}>
                                    Contact us immediately
                                </Link>.
                            </EText>
                        </Column>
                    </Row>
                </ECard>

                {/* CTA */}
                <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <EButton href={resetUrl} variant="primary" width="240px">
                        Reset Password
                    </EButton>
                    <EText variant="small" align="center" style={{ marginTop: '12px', color: tokens.mutedForeground }}>
                        This link expires in <strong>{expiresInMinutes} minutes</strong>.
                    </EText>
                </Section>

                <EDivider />

                {/* Fallback URL */}
                <Section style={{ marginBottom: '24px' }}>
                    <EText variant="h3" style={{ marginBottom: '8px' }}>Link not working?</EText>
                    <EText variant="p" style={{ marginBottom: '8px' }}>
                        Copy and paste this URL into your browser:
                    </EText>
                    <ECard padding="12px 16px" style={{ backgroundColor: tokens.muted }}>
                        <EText
                            variant="small"
                            style={{
                                margin: 0,
                                fontFamily: tokens.fontFamilyMono,
                                color: tokens.blue600,
                                wordBreak: 'break-all',
                            }}
                        >
                            {resetUrl}
                        </EText>
                    </ECard>
                </Section>

                <EDivider />

                {/* Request details */}
                <Section style={{ marginBottom: '8px' }}>
                    <EText variant="h3" style={{ marginBottom: '12px' }}>Request details</EText>
                    <ECard padding="16px">
                        <Row style={{ marginBottom: '8px' }}>
                            <Column style={{ width: '120px' }}>
                                <EText variant="label" style={{ margin: 0 }}>Requested at</EText>
                            </Column>
                            <Column>
                                <EText variant="small" style={{ margin: 0 }}>{requestedAt}</EText>
                            </Column>
                        </Row>
                        <Row>
                            <Column style={{ width: '120px' }}>
                                <EText variant="label" style={{ margin: 0 }}>IP address</EText>
                            </Column>
                            <Column>
                                <EText variant="small" style={{ margin: 0, fontFamily: tokens.fontFamilyMono }}>{ipAddress}</EText>
                            </Column>
                        </Row>
                    </ECard>
                </Section>

                <EDivider />

                {/* Footer */}
                <Section>
                    <EText variant="small" align="center" style={{ color: tokens.mutedForeground }}>
                        If you didn't request a password reset, you can safely ignore this email. Your password won't change.
                    </EText>
                    <EText variant="small" align="center" style={{ color: tokens.neutral400, marginBottom: 0 }}>
                        © {new Date().getFullYear()} [Brand] · All rights reserved
                    </EText>
                </Section>
            </EContainer>
        </Body>
    </Html>
);

export default PasswordResetEmail;
