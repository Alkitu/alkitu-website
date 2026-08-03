import type { Meta, StoryObj } from '@storybook/react';
import Threads from './threads';

const meta = {
    title: 'Showcase/Backgrounds/Threads',
    component: Threads,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', background: '#000' }}><Story /></div>)]
} satisfies Meta<typeof Threads>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { color: [1, 1, 1], amplitude: 1, distance: 0, enableMouseInteraction: true }
};
