import type { Meta, StoryObj } from '@storybook/react';
import LiquidChrome from './liquid-chrome';

const meta = {
    title: 'Showcase/Backgrounds/Liquid Chrome',
    component: LiquidChrome,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh' }}><Story /></div>)]
} satisfies Meta<typeof LiquidChrome>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { baseColor: [0.1, 0.1, 0.1], speed: 0.2, amplitude: 0.3, frequencyX: 3, frequencyY: 3, interactive: true }
};
