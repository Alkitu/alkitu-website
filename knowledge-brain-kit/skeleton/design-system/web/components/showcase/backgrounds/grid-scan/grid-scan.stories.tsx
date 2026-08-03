import type { Meta, StoryObj } from '@storybook/react';
import { GridScan } from './grid-scan';

const meta = {
    title: 'Showcase/Backgrounds/Grid Scan',
    component: GridScan,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof GridScan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        sensitivity: 0.55,
        lineThickness: 1,
        linesColor: '#392e4e',
        gridScale: 0.1,
        scanColor: '#FF9FFC',
        scanOpacity: 0.4,
        enablePost: true,
        bloomIntensity: 0.6,
        chromaticAberration: 0.002,
        noiseIntensity: 0.01,
        scanDirection: 'pingpong',
        scanDuration: 2.0,
        scanDelay: 2.0
    }
};
