import type { Meta, StoryObj } from '@storybook/react';
import GridDistortion from './grid-distortion';

const meta = {
    title: 'Showcase/Backgrounds/Grid Distortion',
    component: GridDistortion,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', background: '#000' }}><Story /></div>)]
} satisfies Meta<typeof GridDistortion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        grid: 15,
        mouse: 0.1,
        strength: 0.15,
        relaxation: 0.9,
        imageSrc: '/gallery/landscape-04-mountain.png'
    }
};
