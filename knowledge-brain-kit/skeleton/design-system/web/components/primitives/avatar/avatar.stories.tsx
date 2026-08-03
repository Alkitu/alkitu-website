import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

const meta: Meta<typeof Avatar> = {
    title: 'Primitives/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg', 'xl'],
            description: 'The size of the avatar',
        },
        asChild: {
            control: false,
            table: { disable: true },
        },
    },
    args: {
        size: 'default',
    },
    render: (args) => (
        <Avatar {...args}>
            <AvatarImage src="/gallery/avatar-01-woman.png" alt="User avatar" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithFallback: Story = {
    render: (args) => (
        <Avatar {...args}>
            <AvatarImage src="/broken-image.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

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
