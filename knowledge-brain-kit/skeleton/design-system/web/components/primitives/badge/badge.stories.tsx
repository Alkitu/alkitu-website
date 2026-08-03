import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Check, ArrowRight, Loader2, ArrowUpRight } from 'lucide-react';

const meta: Meta<typeof Badge> = {
    title: 'Primitives/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
            description: 'The visual style of the badge',
        },
        className: {
            control: false,
        },
    },
    args: {
        children: 'Badge',
        variant: 'default',
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'Link',
    },
};

export const IconLeft: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Badge variant="default"><Check /> Default</Badge>
            <Badge variant="secondary"><Check /> Secondary</Badge>
            <Badge variant="destructive"><Check /> Destructive</Badge>
            <Badge variant="outline"><Check /> Outline</Badge>
            <Badge variant="ghost"><Check /> Ghost</Badge>
            <Badge variant="link"><Check /> Link</Badge>
        </div>
    )
}

export const IconRight: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default <ArrowRight /></Badge>
            <Badge variant="secondary">Secondary <ArrowRight /></Badge>
            <Badge variant="destructive">Destructive <ArrowRight /></Badge>
            <Badge variant="outline">Outline <ArrowRight /></Badge>
            <Badge variant="ghost">Ghost <ArrowRight /></Badge>
            <Badge variant="link">Link <ArrowRight /></Badge>
        </div>
    )
}

export const WithSpinner: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Badge variant="default"><Loader2 className="animate-spin" /> Default</Badge>
            <Badge variant="secondary"><Loader2 className="animate-spin" /> Secondary</Badge>
            <Badge variant="destructive"><Loader2 className="animate-spin" /> Destructive</Badge>
            <Badge variant="outline"><Loader2 className="animate-spin" /> Outline</Badge>
            <Badge variant="ghost"><Loader2 className="animate-spin" /> Ghost</Badge>
            <Badge variant="link"><Loader2 className="animate-spin" /> Link</Badge>
        </div>
    )
}

export const AsChild: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Badge variant="default" asChild>
                <a href="#">Link <ArrowUpRight /></a>
            </Badge>
            <Badge variant="secondary" asChild>
                <a href="#">Link <ArrowUpRight /></a>
            </Badge>
            <Badge variant="destructive" asChild>
                <a href="#">Link <ArrowUpRight /></a>
            </Badge>
            <Badge variant="outline" asChild>
                <a href="#">Link <ArrowUpRight /></a>
            </Badge>
            <Badge variant="ghost" asChild>
                <a href="#">Link <ArrowUpRight /></a>
            </Badge>
            <Badge variant="link" asChild>
                <a href="#">Link <ArrowUpRight /></a>
            </Badge>
        </div>
    )
}
