import type { Meta, StoryObj } from "@storybook/react"
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "./empty"
import { MailX } from "lucide-react"

const meta: Meta<typeof Empty> = {
    title: "Primitives/Empty",
    component: Empty,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
    render: () => (
        <Empty className="max-w-md">
            <EmptyIcon />
            <EmptyTitle>No files found</EmptyTitle>
            <EmptyDescription>
                You have no files in this folder. Create a new file or upload one to get started.
            </EmptyDescription>
        </Empty>
    ),
}

export const CustomIcon: Story = {
    render: () => (
        <Empty className="max-w-md">
            <EmptyIcon icon={MailX} />
            <EmptyTitle>Inbox is Empty</EmptyTitle>
            <EmptyDescription>
                You do not have any unread messages. Have a great day!
            </EmptyDescription>
        </Empty>
    ),
}
