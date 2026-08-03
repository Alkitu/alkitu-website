import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from './link-button';

const meta: Meta<typeof LinkButton> = {
    title: 'Primitives/Link Button',
    component: LinkButton,
    tags: ['autodocs'],
    argTypes: {
        href: {
            control: 'text',
            description: 'The URL the button links to',
        },
        external: {
            control: 'boolean',
            description: 'Whether to open in a new tab',
        },
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
        },
        asChild: { control: false, table: { disable: true } },
    },
    args: {
        children: 'Go to Home',
        href: '/',
        variant: 'link', // Default variant for LinkButton logic, though it can look like any button
    },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {};

export const External: Story = {
    args: {
        children: 'Visit Documentation',
        href: 'https://ui.shadcn.com',
        external: true,
        variant: 'default',
    },
};

export const Outline: Story = {
    args: {
        children: 'Back to Dashboard',
        href: '/dashboard',
        variant: 'outline',
        external: false,
    },
};
