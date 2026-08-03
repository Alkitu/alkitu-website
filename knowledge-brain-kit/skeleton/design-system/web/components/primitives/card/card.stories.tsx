import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

// Create a wrapper component to better showcase the Card compound components
const CardWrapper = (args: React.ComponentProps<typeof Card>) => (
    <Card {...args} className="w-[350px]">
        <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your project" />
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
        </CardFooter>
    </Card>
);

const meta: Meta<typeof Card> = {
    title: 'Primitives/Card',
    component: Card,
    tags: ['autodocs'],
    render: (args) => <CardWrapper {...args} />,
    argTypes: {
        className: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const Simple: Story = {
    render: (args) => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Notification</CardTitle>
                <CardDescription>You have a new message.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Your team has set up a new project.</p>
            </CardContent>
        </Card>
    ),
};
