import type { Meta, StoryObj } from '@storybook/react';
import Counter from './counter';

const meta: Meta<typeof Counter> = {
    title: 'Showcase/Bit Components/Counter',
    component: Counter,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Counter>;

export const Default: Story = {
    args: {
        value: 1234.56,
        fontSize: 80,
        padding: 5,
        gap: 10,
        textColor: "var(--foreground)",
        fontWeight: 900,
    },
    render: (args) => (
        <div className="flex h-[400px] w-full items-center justify-center p-12 bg-background border rounded-xl overflow-hidden shadow-sm relative">
            <Counter {...args} />
        </div>
    ),
};
