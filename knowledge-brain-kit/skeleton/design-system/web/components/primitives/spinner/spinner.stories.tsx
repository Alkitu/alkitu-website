import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
    title: 'Primitives/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg', 'xl'],
            description: 'The size of the spinner',
        },
    },
    args: {
        size: 'default',
    },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Small: Story = {
    args: {
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
};

export const ExtraLarge: Story = {
    args: {
        size: 'xl',
    },
};
