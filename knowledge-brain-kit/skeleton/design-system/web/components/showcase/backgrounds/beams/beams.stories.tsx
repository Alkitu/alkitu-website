import type { Meta, StoryObj } from '@storybook/react';
import Beams from './beams';

const meta = {
    title: 'Showcase/Backgrounds/Beams',
    component: Beams,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof Beams>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        beamWidth: 2,
        beamHeight: 15,
        beamNumber: 12,
        lightColor: '#ffffff',
        speed: 2,
        noiseIntensity: 1.75,
        scale: 0.2,
        rotation: 0
    }
};

export const Angled: Story = {
    args: {
        beamWidth: 3,
        beamHeight: 30,
        beamNumber: 20,
        lightColor: '#ffffff',
        speed: 2,
        noiseIntensity: 1.75,
        scale: 0.2,
        rotation: 30
    }
};
