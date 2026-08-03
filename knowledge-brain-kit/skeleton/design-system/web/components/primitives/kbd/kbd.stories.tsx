import type { Meta, StoryObj } from "@storybook/react"
import { Kbd } from "./kbd"

const meta: Meta<typeof Kbd> = {
    title: "Primitives/Kbd",
    component: Kbd,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
    render: () => <Kbd>⌘ K</Kbd>,
}

export const Combination: Story = {
    render: () => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Press <Kbd>⇧ Shift</Kbd> + <Kbd>⌘ Cmd</Kbd> + <Kbd>P</Kbd>
        </div>
    ),
}
