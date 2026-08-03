import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeEmail } from '../../../emails/welcome';
import { EmailPreview, renderEmail } from './email-preview';

const meta = {
    title: 'Integrations/Emails/Welcome',
    component: WelcomeEmail,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
} satisfies Meta<typeof WelcomeEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <EmailPreview html={renderEmail(<WelcomeEmail {...args} />)} height={900} />
    ),
};

export const Personalized: Story = {
    args: {
        firstName: '[Brand]',
        productName: '[Brand] DS',
        loginUrl: 'https://design.tuconcepto.com/login',
        docsUrl: 'https://design.tuconcepto.com/docs',
    },
    render: (args) => (
        <EmailPreview html={renderEmail(<WelcomeEmail {...args} />)} height={900} />
    ),
};
