import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedList } from './animated-list';

const meta = {
    title: 'Showcase/Bit Components/Animated List',
    component: AnimatedList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        showGradients: { control: 'boolean' },
        enableArrowNavigation: { control: 'boolean' },
        displayScrollbar: { control: 'boolean' }
    }
} satisfies Meta<typeof AnimatedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'],
        showGradients: true,
        enableArrowNavigation: true,
        displayScrollbar: true,
    },
    render: (args) => (
        <div className="w-full flex items-center justify-center p-12 min-w-[500px]">
            <AnimatedList
                {...args}
                onItemSelect={(item, index) => console.log(item, index)}
            />
        </div>
    ),
};
