import type { Meta, StoryObj } from '@storybook/react';
import Ballpit from './ballpit';

const meta = {
    title: 'Showcase/Backgrounds/Ballpit',
    component: Ballpit,
    parameters: { layout: 'fullscreen' },
    decorators: [(Story) => (<div style={{ width: '100vw', height: '100vh', background: '#000' }}><Story /></div>)]
} satisfies Meta<typeof Ballpit>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { count: 200, followCursor: true, colors: [0xff6030, 0x1b42d8, 0xd742d8], gravity: 0.5 }
};

export const Calm: Story = {
    args: { count: 80, followCursor: true, colors: [0x00b4ff, 0x0fbfe0, 0x66e6ff], gravity: 0, friction: 0.998, maxVelocity: 0.05 }
};
