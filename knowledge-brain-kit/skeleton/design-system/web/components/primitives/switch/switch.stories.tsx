import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./switch"
import { Label } from "../label"

const meta: Meta<typeof Switch> = {
    title: "Primitives/Switch",
    component: Switch,
    tags: ["autodocs"],
    argTypes: {
        checked: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
    ),
}

export const Disabled: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode-disabled" disabled />
            <Label htmlFor="airplane-mode-disabled">Airplane Mode</Label>
        </div>
    ),
}

export const CheckedDisabled: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode-checked-disabled" disabled checked />
            <Label htmlFor="airplane-mode-checked-disabled">Airplane Mode</Label>
        </div>
    ),
}
