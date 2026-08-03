import type { Meta, StoryObj } from '@storybook/react';
import Hyperspeed from './hyperspeed';

const meta = {
    title: 'Showcase/Backgrounds/Hyperspeed',
    component: Hyperspeed,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', background: '#000' }}><Story /></div>)]
} satisfies Meta<typeof Hyperspeed>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const DeepDistortion: Story = {
    args: {
        effectOptions: {
            distortion: 'deepDistortion',
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0xffffff,
                brokenLines: 0xffffff,
                leftCars: [0xff102a, 0xeb383e, 0xff5a00],
                rightCars: [0x00b4ff, 0x0fbfe0, 0x66e6ff],
                sticks: 0x00b4ff
            }
        }
    }
};
