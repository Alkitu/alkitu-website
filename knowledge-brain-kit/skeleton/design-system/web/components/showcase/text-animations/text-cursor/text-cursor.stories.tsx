import type { Meta, StoryObj } from '@storybook/react';
import { TextCursor } from './text-cursor';

const meta: Meta<typeof TextCursor> = {
    title: 'Showcase/Text Animations/Text Cursor',
    component: TextCursor,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: "A mouse-trail text effect that renders animated text/emoji along the cursor path.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextCursor>;

export const Default: Story = {
    render: (args) => (
        <div className="border border-border rounded-lg bg-background min-h-[400px] flex items-center justify-center relative overflow-hidden">
            <p className="text-muted-foreground text-sm pointer-events-none select-none">Move your mouse here</p>
            <TextCursor {...args} />
        </div>
    ),
    args: {
        text: "⚛️",
        spacing: 100,
        followMouseDirection: true,
        randomFloat: true,
        exitDuration: 0.5,
        removalInterval: 30,
        maxPoints: 5,
    },
    argTypes: {
        spacing: { control: { type: 'range', min: 20, max: 300, step: 10 } },
        exitDuration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        removalInterval: { control: { type: 'range', min: 10, max: 200, step: 10 } },
        maxPoints: { control: { type: 'range', min: 1, max: 20, step: 1 } },
        followMouseDirection: { control: 'boolean' },
        randomFloat: { control: 'boolean' },
    },
};
