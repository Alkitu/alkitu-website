import type { Meta, StoryObj } from '@storybook/react';
import Squares from './squares';

const meta = {
    title: 'Showcase/Backgrounds/Squares',
    component: Squares,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', background: '#000' }}><Story /></div>)]
} satisfies Meta<typeof Squares>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { direction: 'diagonal', speed: 0.5, borderColor: '#333', squareSize: 40, hoverFillColor: '#222' }
};
