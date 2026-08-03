import type { Meta, StoryObj } from '@storybook/react';
import Waves from './waves';

const meta = {
    title: 'Showcase/Backgrounds/Waves',
    component: Waves,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', position: 'relative' }}><Story /></div>)]
} satisfies Meta<typeof Waves>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { lineColor: '#333', backgroundColor: '#000', waveSpeedX: 0.0125, waveSpeedY: 0.005, waveAmpX: 32, waveAmpY: 16 }
};

export const Light: Story = {
    args: { lineColor: '#ccc', backgroundColor: '#fff', waveSpeedX: 0.02, waveSpeedY: 0.01, waveAmpX: 40, waveAmpY: 20 }
};
