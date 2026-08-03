import type { Meta, StoryObj } from '@storybook/react';
import Dither from './dither';

const meta = {
    title: 'Showcase/Backgrounds/Dither',
    component: Dither,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh' }}><Story /></div>)]
} satisfies Meta<typeof Dither>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        waveSpeed: 0.05,
        waveFrequency: 3,
        waveAmplitude: 0.3,
        waveColor: [0.5, 0.5, 0.5],
        colorNum: 4,
        pixelSize: 2,
        disableAnimation: false,
        enableMouseInteraction: true,
        mouseRadius: 1
    }
};
