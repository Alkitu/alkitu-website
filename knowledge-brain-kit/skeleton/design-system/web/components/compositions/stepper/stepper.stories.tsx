import type { Meta, StoryObj } from '@storybook/react';
import Stepper, { Step } from './stepper';

const meta: Meta<typeof Stepper> = {
    title: 'Compositions/Stepper',
    component: Stepper,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
    args: {
        initialStep: 1,
    },
    render: (args) => (
        <div className="flex w-full min-h-[400px] items-center justify-center">
            <Stepper {...args}>
                <Step title="Step 1">
                    <div className="py-2">
                        <h2 className="text-xl font-bold mb-2">Welcome</h2>
                        <p className="text-muted-foreground">This is the first step of the process. You can place any content here without forced containers.</p>
                    </div>
                </Step>
                <Step title="Step 2">
                    <div className="py-2">
                        <h2 className="text-xl font-bold mb-2">Configuration</h2>
                        <p className="text-muted-foreground">This is the second step. Adjust your settings and click continue.</p>
                    </div>
                </Step>
                <Step title="Step 3">
                    <div className="py-2">
                        <h2 className="text-xl font-bold mb-2">Finalization</h2>
                        <p className="text-muted-foreground">This is the final step. Review everything before completion.</p>
                    </div>
                </Step>
            </Stepper>
        </div>
    ),
};
