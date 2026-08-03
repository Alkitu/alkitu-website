import type { Meta, StoryObj } from '@storybook/react';
import Iridescence from './iridescence';

const meta = {
    title: 'Showcase/Backgrounds/Iridescence',
    component: Iridescence,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh' }}><Story /></div>)]
} satisfies Meta<typeof Iridescence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { color: [1, 1, 1], speed: 1.0, amplitude: 0.1, mouseReact: true }
};
