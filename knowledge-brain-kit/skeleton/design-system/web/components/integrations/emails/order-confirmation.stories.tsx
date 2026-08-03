import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OrderConfirmationEmail } from '../../../emails/order-confirmation';
import { EmailPreview, renderEmail } from './email-preview';

const meta = {
    title: 'Integrations/Emails/Order Confirmation',
    component: OrderConfirmationEmail,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
} satisfies Meta<typeof OrderConfirmationEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <EmailPreview html={renderEmail(<OrderConfirmationEmail {...args} />)} height={1100} />
    ),
};

export const CustomOrder: Story = {
    args: {
        orderNumber: 'ORD-2026-00888',
        customerName: '[Brand]',
        items: [
            { name: 'Design System Pro License', description: 'Unlimited seats · Lifetime', quantity: 1, price: 599 },
            { name: 'Priority Support', description: '12 months', quantity: 1, price: 149 },
            { name: 'Custom Branding Kit', quantity: 2, price: 99 },
        ],
        subtotal: 946,
        tax: 94.6,
        total: 1040.6,
        currency: 'EUR',
    },
    render: (args) => (
        <EmailPreview html={renderEmail(<OrderConfirmationEmail {...args} />)} height={1200} />
    ),
};
