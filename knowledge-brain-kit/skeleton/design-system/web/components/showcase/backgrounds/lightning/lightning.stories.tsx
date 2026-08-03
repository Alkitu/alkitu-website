import type { Meta, StoryObj } from '@storybook/react';
import Lightning from './lightning';

const meta = {
    title: 'Showcase/Backgrounds/Lightning',
    component: Lightning,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof Lightning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        hue: 230,
        speed: 1.0,
        intensity: 1,
        size: 1
    }
};

export const PurpleStorm: Story = {
    args: {
        hue: 290,
        speed: 2.0,
        intensity: 1.5,
        size: 1.2
    }
};
