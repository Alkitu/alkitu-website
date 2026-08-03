import type { Meta, StoryObj } from '@storybook/react';
import Lanyard from './lanyard';

const meta = {
    title: 'Showcase/Bit Components/Lanyard',
    component: Lanyard,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Lanyard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        position: [0, 0, 30],
        gravity: [0, -40, 0],
        fov: 20,
        transparent: true,
    },
    render: (args) => (
        <div
            style={{
                width: '100%',
                height: '600px',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Lanyard {...args} />
        </div>
    ),
};
