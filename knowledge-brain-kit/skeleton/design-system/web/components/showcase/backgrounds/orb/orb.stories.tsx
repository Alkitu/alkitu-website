import type { Meta, StoryObj } from '@storybook/react';
import Orb from './orb';

const meta = {
    title: 'Showcase/Backgrounds/Orb',
    component: Orb,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', background: '#000' }}><Story /></div>)]
} satisfies Meta<typeof Orb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { hue: 0, hoverIntensity: 0.2, rotateOnHover: true, backgroundColor: '#000000' }
};
