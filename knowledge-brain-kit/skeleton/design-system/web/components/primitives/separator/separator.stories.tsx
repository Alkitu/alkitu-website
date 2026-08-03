import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
    title: 'Primitives/Separator',
    component: Separator,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'The orientation of the separator',
        },
        decorative: {
            control: 'boolean',
            description: 'Whether the separator is purely decorative',
        },
        asChild: {
            control: false,
            table: { disable: true },
        },
    },
    args: {
        orientation: 'horizontal',
    },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
    render: (args) => (
        <div>
            <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
                <p className="text-sm text-muted-foreground">
                    An open-source UI component library.
                </p>
            </div>
            <Separator className="my-4" {...args} />
            <div className="flex h-5 items-center space-x-4 text-sm">
                <div>Blog</div>
                <Separator orientation="vertical" />
                <div>Docs</div>
                <Separator orientation="vertical" />
                <div>Source</div>
            </div>
        </div>
    ),
};

export const Vertical: Story = {
    args: {
        orientation: 'vertical',
        className: 'h-20',
    },
    render: (args) => (
        <div className="flex h-40 items-center space-x-4 text-sm">
            <div>Left</div>
            <Separator {...args} />
            <div>Right</div>
        </div>
    )
};
