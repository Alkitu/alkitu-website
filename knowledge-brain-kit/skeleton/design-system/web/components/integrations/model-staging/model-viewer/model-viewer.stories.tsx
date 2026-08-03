import type { Meta, StoryObj } from '@storybook/react';
import ModelViewer from './model-viewer';
import robotUrl from '../../../foundations/model-viewer/RobotExpressive.glb?url';

const meta = {
    title: 'Integrations/Model Staging/Base Viewer',
    component: ModelViewer,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        environment: {
            control: 'select',
            options: ['studio', 'city', 'apartment', 'forest', 'lobby', 'night', 'park', 'sunset', 'dawn', 'warehouse'],
        },
        shadows: {
            control: 'boolean',
        },
        autoRotate: {
            control: 'boolean',
        }
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ModelViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        modelPath: robotUrl,
        scale: 1,
        autoRotate: true,
        autoRotateSpeed: 2,
        shadows: true,
        environment: 'studio',
    },
    render: (args) => (
        <div className="w-full h-screen bg-neutral-950 flex flex-col items-center justify-center relative">
            <h2 className="absolute top-10 text-white text-3xl font-bold z-10 font-sans tracking-tight">Interactive 3D Viewer</h2>
            <p className="absolute top-20 text-neutral-400 z-10 font-sans">Drag to rotate, scroll to zoom.</p>
            <ModelViewer {...args} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>
    )
};

export const FloatingCube: Story = {
    args: {
        modelPath: robotUrl,
        scale: 1.5,
        autoRotate: true,
        autoRotateSpeed: 1,
        shadows: false,
        environment: 'city',
    },
    render: (args) => (
        <div className="w-full h-screen bg-black flex items-center justify-center relative">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-black"></div>
            <ModelViewer {...args} className="w-full h-full z-10" />
        </div>
    )
}
