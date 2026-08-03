import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
    title: 'Primitives/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url'],
        },
        disabled: {
            control: 'boolean',
        },
    },
    args: {
        type: 'text',
        placeholder: 'Type something...',
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Email address',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'Disabled input',
    },
};

export const WithLabel: Story = {
    render: (args) => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="email-input" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <Input {...args} id="email-input" />
        </div>
    ),
    args: {
        type: 'email',
        placeholder: 'Email',
    },
};
