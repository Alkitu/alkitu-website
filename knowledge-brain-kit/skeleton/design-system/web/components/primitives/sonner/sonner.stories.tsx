import type { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"
import { Toaster } from "./sonner"
import { Button } from "~/components/primitives/button"
import * as React from "react"

const meta: Meta<typeof Toaster> = {
    title: "Primitives/Sonner",
    component: Toaster,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div>
                <Story />
                <Toaster position="bottom-right" />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() =>
                toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                })
            }
        >
            Show Toast
        </Button>
    ),
}

export const Success: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() =>
                toast.success("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                })
            }
        >
            Show Success Toast
        </Button>
    ),
}

export const Error: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() =>
                toast.error("Failed to create event", {
                    description: "Please check your connection and try again.",
                })
            }
        >
            Show Error Toast
        </Button>
    ),
}

export const Interactive: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() => {
                const promise = new Promise((resolve) => setTimeout(resolve, 2000));
                toast.promise(promise, {
                    loading: 'Loading data...',
                    success: () => {
                        return `Data loaded successfully`;
                    },
                    error: 'Error loading data',
                });
            }}
        >
            Show Promise Toast
        </Button>
    ),
}
