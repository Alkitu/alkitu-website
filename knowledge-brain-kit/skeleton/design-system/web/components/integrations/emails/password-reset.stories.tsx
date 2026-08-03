import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PasswordResetEmail } from '../../../emails/password-reset';
import { EmailPreview, renderEmail } from './email-preview';

const meta = {
    title: 'Integrations/Emails/Password Reset',
    component: PasswordResetEmail,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordResetEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <EmailPreview html={renderEmail(<PasswordResetEmail {...args} />)} height={900} />
    ),
};

export const Detailed: Story = {
    args: {
        firstName: '[Brand]',
        resetUrl: 'https://design.tuconcepto.com/reset?token=xyz789abc',
        expiresInMinutes: 30,
        ipAddress: '212.68.14.99',
        requestedAt: 'March 1, 2026 at 2:54 AM CET',
    },
    render: (args) => (
        <EmailPreview html={renderEmail(<PasswordResetEmail {...args} />)} height={900} />
    ),
};
