import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Item } from "./item"
import { User, Settings, ChevronRight, Bell } from "lucide-react"
import { Switch } from "../switch"

const meta: Meta<typeof Item> = {
    title: "Primitives/Item",
    component: Item,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "secondary"],
        },
        size: {
            control: "select",
            options: ["sm", "default", "lg"],
        },
    },
}

export default meta
type Story = StoryObj<typeof Item>

export const Default: Story = {
    render: (args) => (
        <div className="w-[400px] border rounded-lg p-2 flex flex-col gap-1">
            <Item
                title="Profile"
                startContent={<User className="size-4" />}
                {...args}
            />
            <Item
                title="Settings"
                startContent={<Settings className="size-4" />}
                {...args}
            />
        </div>
    ),
}

export const WithDescription: Story = {
    render: (args) => (
        <div className="w-[400px] border rounded-lg p-2 flex flex-col gap-1">
            <Item
                title="Notifications"
                description="Manage your email and push notifications."
                startContent={<Bell className="size-5" />}
                endContent={<Switch />}
                {...args}
            />
        </div>
    ),
}

export const Actionable: Story = {
    render: (args) => (
        <div className="w-[400px] border rounded-lg p-2 flex flex-col gap-1">
            <Item
                asChild
                {...args}
            >
                <a href="#" className="flex items-center gap-3 w-full">
                    <User className="size-4 text-muted-foreground" />
                    <span className="flex-1 font-medium text-sm">Account Details</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                </a>
            </Item>
        </div>
    ),
}
