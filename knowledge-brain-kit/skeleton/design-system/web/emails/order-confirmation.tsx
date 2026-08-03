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

interface LineItem {
    name: string;
    description?: string;
    quantity: number;
    price: number;
}

interface OrderConfirmationProps {
    orderNumber?: string;
    customerName?: string;
    orderDate?: string;
    items?: LineItem[];
    subtotal?: number;
    tax?: number;
    total?: number;
    shippingAddress?: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    trackingUrl?: string;
    currency?: string;
}

const DEFAULT_ITEMS: LineItem[] = [
    { name: 'Design System License', description: 'Annual license · 1 seat', quantity: 1, price: 199 },
    { name: 'Component Library Add-on', description: 'React Bits collection', quantity: 1, price: 49 },
];

const fmt = (n: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

export const OrderConfirmationEmail: React.FC<OrderConfirmationProps> = ({
    orderNumber = 'ORD-2026-00142',
    customerName = 'Developer',
    orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    items = DEFAULT_ITEMS,
    subtotal = 248,
    tax = 24.8,
    total = 272.8,
    shippingAddress = { name: 'Developer', line1: '123 Main St', city: 'Barcelona', state: 'CT', zip: '08001', country: 'Spain' },
    trackingUrl = 'https://design.tuconcepto.com/orders',
    currency = 'USD',
}) => (
    <Html lang="en" dir="ltr">
        <Head />
        <Preview>Order {orderNumber} confirmed — Thank you, {customerName}!</Preview>
        <Body style={{ backgroundColor: tokens.muted, margin: 0, padding: '40px 0', fontFamily: tokens.fontFamily }}>
            <EContainer>
                {/* Header */}
                <Section style={{ textAlign: 'center', paddingBottom: '24px' }}>
                    <EText variant="label" align="center" style={{ color: tokens.green600, marginBottom: '8px' }}>
                        ✅ Order Confirmed
                    </EText>
                    <EText variant="h1" align="center" style={{ margin: '0 0 8px' }}>
                        Thanks for your order!
                    </EText>
                    <EText variant="p" align="center" style={{ color: tokens.mutedForeground }}>
                        Hi {customerName}, your order <strong>{orderNumber}</strong> was placed on {orderDate}.
                    </EText>
                </Section>

                {/* Line items */}
                <ECard padding="0" style={{ overflow: 'hidden', marginBottom: '16px' }}>
                    {/* Table header */}
                    <Row style={{ backgroundColor: tokens.muted, padding: '12px 20px', borderBottom: `1px solid ${tokens.border}` }}>
                        <Column style={{ flex: 1 }}>
                            <EText variant="label" style={{ margin: 0 }}>Item</EText>
                        </Column>
                        <Column style={{ width: '60px', textAlign: 'right' }}>
                            <EText variant="label" style={{ margin: 0 }}>Qty</EText>
                        </Column>
                        <Column style={{ width: '80px', textAlign: 'right' }}>
                            <EText variant="label" style={{ margin: 0 }}>Price</EText>
                        </Column>
                    </Row>

                    {/* Line items */}
                    {items.map((item, i) => (
                        <Row key={i} style={{ padding: '16px 20px', borderBottom: i < items.length - 1 ? `1px solid ${tokens.border}` : 'none' }}>
                            <Column style={{ flex: 1, paddingRight: '12px' }}>
                                <EText variant="p" style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '14px', color: tokens.foreground }}>{item.name}</EText>
                                {item.description && (
                                    <EText variant="small" style={{ margin: 0, color: tokens.mutedForeground }}>{item.description}</EText>
                                )}
                            </Column>
                            <Column style={{ width: '60px', textAlign: 'right', verticalAlign: 'middle' }}>
                                <EText variant="p" style={{ margin: 0, fontSize: '14px' }}>{item.quantity}</EText>
                            </Column>
                            <Column style={{ width: '80px', textAlign: 'right', verticalAlign: 'middle' }}>
                                <EText variant="p" style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{fmt(item.price, currency)}</EText>
                            </Column>
                        </Row>
                    ))}
                </ECard>

                {/* Totals */}
                <ECard padding="20px" style={{ marginBottom: '24px' }}>
                    <Row style={{ marginBottom: '8px' }}>
                        <Column><EText variant="small" style={{ margin: 0 }}>Subtotal</EText></Column>
                        <Column style={{ textAlign: 'right' }}><EText variant="small" style={{ margin: 0 }}>{fmt(subtotal, currency)}</EText></Column>
                    </Row>
                    <Row style={{ marginBottom: '8px' }}>
                        <Column><EText variant="small" style={{ margin: 0 }}>Tax</EText></Column>
                        <Column style={{ textAlign: 'right' }}><EText variant="small" style={{ margin: 0 }}>{fmt(tax, currency)}</EText></Column>
                    </Row>
                    <EDivider marginY="12px" />
                    <Row>
                        <Column><EText variant="p" style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>Total</EText></Column>
                        <Column style={{ textAlign: 'right' }}><EText variant="p" style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>{fmt(total, currency)}</EText></Column>
                    </Row>
                </ECard>

                {/* Shipping address */}
                <Section style={{ marginBottom: '24px' }}>
                    <EText variant="h3" style={{ marginBottom: '12px' }}>Shipping to</EText>
                    <ECard padding="16px">
                        <EText variant="p" style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '14px', color: tokens.foreground }}>{shippingAddress.name}</EText>
                        <EText variant="small" style={{ margin: '0 0 2px' }}>{shippingAddress.line1}</EText>
                        {shippingAddress.line2 && <EText variant="small" style={{ margin: '0 0 2px' }}>{shippingAddress.line2}</EText>}
                        <EText variant="small" style={{ margin: 0 }}>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip} · {shippingAddress.country}</EText>
                    </ECard>
                </Section>

                {/* CTA */}
                <Section style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <EButton href={trackingUrl} variant="primary">Track Your Order</EButton>
                </Section>

                <EDivider />

                {/* Footer */}
                <Section>
                    <EText variant="small" align="center" style={{ color: tokens.mutedForeground }}>
                        Questions? <Link href="mailto:support@brain.com" style={{ color: tokens.primary }}>Contact support</Link>
                    </EText>
                    <EText variant="small" align="center" style={{ color: tokens.neutral400, marginBottom: 0 }}>
                        © {new Date().getFullYear()} [Brand] · All rights reserved
                    </EText>
                </Section>
            </EContainer>
        </Body>
    </Html>
);

export default OrderConfirmationEmail;
