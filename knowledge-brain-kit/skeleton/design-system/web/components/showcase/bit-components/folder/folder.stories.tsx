import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Folder } from './folder';

const meta = {
    title: 'Showcase/Bit Components/Folder',
    component: Folder,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Folder>;

export default meta;
type Story = StoryObj<typeof meta>;

// Some arbitrary content to place "inside" the folder's paper items
const papers = [
    <div key="docs" className="h-full w-full p-2 flex flex-col gap-1 overflow-hidden pointer-events-none text-black">
        <h3 className="font-bold text-[8px] mb-1">Documentation</h3>
        <div className="w-full h-1 bg-black/10 rounded-full" />
        <div className="w-4/5 h-1 bg-black/10 rounded-full" />
        <div className="w-full h-1 bg-black/10 rounded-full" />
    </div>,
    <div key="images" className="h-full w-full p-2 flex items-center justify-center text-black">
        <span className="text-[10px] font-mono">Image.png</span>
    </div>,
    <div key="assets" className="h-full w-full p-2 flex items-center justify-center text-black border-2 border-dashed border-red-500 rounded-sm">
        <span className="text-[8px] text-red-500 font-bold">TOP SECRET</span>
    </div>
]

export const Default: Story = {
    args: {
        color: '#5227FF',
        size: 2,
        items: papers,
    },
    render: (args) => (
        <div className="p-24 flex items-center justify-center min-w-[300px] min-h-[300px]">
            <Folder {...args} />
        </div>
    )
};
