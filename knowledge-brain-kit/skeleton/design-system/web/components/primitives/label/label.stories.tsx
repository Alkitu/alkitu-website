import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./label"

const meta: Meta<typeof Label> = {
    title: "Primitives/Label",
    component: Label,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "muted", "destructive"],
        },
        size: {
            control: "select",
            options: ["xs", "default", "lg"],
        },
        required: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
    args: {
        children: "Email address",
        htmlFor: "email",
    },
}

export const Required: Story = {
    args: {
        children: "Username",
        htmlFor: "username",
        required: true,
    },
}

export const Muted: Story = {
    args: {
        children: "Optional field",
        variant: "muted",
    },
}

export const Destructive: Story = {
    args: {
        children: "This field has an error",
        variant: "destructive",
    },
}

export const AllSizes: Story = {
    render: () => (
        <div className="space-y-3">
            <Label size="xs">Extra small label</Label>
            <Label size="default">Default label</Label>
            <Label size="lg">Large label</Label>
        </div>
    ),
}

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-3">
            <Label variant="default" required>Default (required)</Label>
            <Label variant="muted">Muted variant</Label>
            <Label variant="destructive">Destructive variant</Label>
        </div>
    ),
}
