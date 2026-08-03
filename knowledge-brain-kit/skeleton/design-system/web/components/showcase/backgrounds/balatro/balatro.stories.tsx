import type { Meta, StoryObj } from '@storybook/react';
import Balatro from './balatro';

const meta = {
    title: 'Showcase/Backgrounds/Balatro',
    component: Balatro,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh' }}><Story /></div>)]
} satisfies Meta<typeof Balatro>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { color1: '#DE443B', color2: '#006BB4', color3: '#162325', spinSpeed: 7, contrast: 3.5, mouseInteraction: true }
};
