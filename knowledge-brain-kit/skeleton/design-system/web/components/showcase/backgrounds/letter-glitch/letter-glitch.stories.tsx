import type { Meta, StoryObj } from '@storybook/react';
import LetterGlitch from './letter-glitch';

const meta = {
    title: 'Showcase/Backgrounds/Letter Glitch',
    component: LetterGlitch,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh' }}><Story /></div>)]
} satisfies Meta<typeof LetterGlitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { glitchColors: ['#2b4539', '#61dca3', '#61b3dc'], glitchSpeed: 50, smooth: true, outerVignette: true }
};
