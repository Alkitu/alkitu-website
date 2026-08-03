import type { Meta, StoryObj } from "@storybook/react"
import React from 'react';
import {
    InteractiveStepper,
    InteractiveStepperContent,
    InteractiveStepperDescription,
    InteractiveStepperIndicator,
    InteractiveStepperItem,
    InteractiveStepperSeparator,
    InteractiveStepperTitle,
    InteractiveStepperTrigger,
} from './interactive-stepper';

const meta: Meta<typeof InteractiveStepper> = {
    title: "Primitives/Interactive Stepper",
    component: InteractiveStepper,
    tags: ["autodocs"],
    argTypes: {
        orientation: {
            control: "select",
            options: ["horizontal", "vertical"]
        }
    }
}
export default meta
type Story = StoryObj<typeof InteractiveStepper>

export const Vertical: Story = {
    render: () => (
        <InteractiveStepper orientation="vertical" className="w-[400px]">
            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
                        <InteractiveStepperDescription>Your order has been placed successfully</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
                        <InteractiveStepperDescription>We are preparing your order</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
                        <InteractiveStepperDescription>Your order is on the way</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
                        <InteractiveStepperDescription>Order delivered to your address</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
            </InteractiveStepperItem>
        </InteractiveStepper>
    ),
}

interface CardProps {
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => (
    <div className="w-full rounded-lg border border-border bg-card text-card-foreground p-4">
        <span className="font-semibold">{title}</span>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

export const HorizontalWithContent: Story = {
    render: () => (
        <InteractiveStepper defaultValue={2} className="w-full max-w-4xl">
            <InteractiveStepperItem completed>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
                        <InteractiveStepperDescription>A few days ago</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
                        <InteractiveStepperDescription>Currently active</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
                        <InteractiveStepperDescription>On your way</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
                        <InteractiveStepperDescription>At your address</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
            </InteractiveStepperItem>

            <InteractiveStepperContent step={1}>
                <Card title={'Order Confirmed'} description={'Order #12345 placed on Jan 15, 2024'} />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={2}>
                <Card
                    title={'Processing Your Order'}
                    description={'Estimated processing time: 1-2 business days'}
                />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={3}>
                <Card title={'Order Shipped'} description={'Tracking: #ABC123XYZ'} />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={4}>
                <Card title={'Order Delivered'} description={'Delivered to your location'} />
            </InteractiveStepperContent>
        </InteractiveStepper>
    ),
}
