import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from 'storybook/test';
import { Button } from './button';
import { Mail, Loader2, ArrowRight } from 'lucide-react';

// Dynamic custom icon loading — any SVG in components/foundations/icons/ is available
const customIconsGlob = import.meta.glob('../../foundations/icons/*.svg', {
    query: '?react',
    eager: true,
});

const customIcons: Record<string, React.ElementType> = {};
Object.entries(customIconsGlob).forEach(([path, mod]: [string, any]) => {
    const name = path.split('/').pop()?.replace('.svg', '') || '';
    customIcons[name] = mod.default || mod;
});

const meta: Meta<typeof Button> = {
    title: 'Primitives/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
            description: 'The visual style of the button',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: 'The size of the button',
        },
        asChild: {
            control: false,
            table: {
                disable: true,
            }
        },
        onClick: { action: 'clicked' },
    },
    args: {
        children: 'Button',
        variant: 'default',
        size: 'default',
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        await userEvent.click(button);
        // Actions panel will log the click if onClick arg provided, or just validates it's clickable
    },
};

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

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small Button',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large Button',
    },
};

export const Icon: Story = {
    argTypes: {
        children: {
            control: { type: 'text' },
            description: `Type the filename of a custom icon (without .svg). Available: ${Object.keys(customIcons).join(', ')}`,
        },
    },
    args: {
        size: 'icon',
        children: 'info-sample',
    },
    parameters: {
        docs: {
            source: {
                transform: (_code: string, storyContext: any) => {
                    const iconName = storyContext.args.children;
                    return `import ${iconName} from '~/components/foundations/icons/${iconName}.svg';\n\n<Button size="icon">\n  <${iconName} className="h-4 w-4" />\n</Button>`;
                }
            }
        }
    },
    render: (args) => {
        const iconName = args.children as string;
        const CustomIcon = customIcons[iconName];

        if (CustomIcon) {
            return (
                <Button {...args}>
                    <CustomIcon className="h-4 w-4" />
                </Button>
            );
        }

        // Fallback: show the text if icon not found
        return (
            <Button {...args}>
                {iconName}
            </Button>
        );
    },
};

export const WithIcon: Story = {
    args: {
        children: "Login with Email",
    },
    render: (args) => (
        <Button {...args}>
            <Mail className="mr-2 h-4 w-4" /> {args.children}
        </Button>
    ),
};

export const Loading: Story = {
    render: (args) => (
        <Button {...args} disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
        </Button>
    ),
};
