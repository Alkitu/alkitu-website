import type { Meta, StoryObj } from "@storybook/react"
import { InputGroup, InputGroupText } from "./input-group"
import { Input } from "../input"
import { Search, Mail } from "lucide-react"

const meta: Meta<typeof InputGroup> = {
    title: "Primitives/Input Group",
    component: InputGroup,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
    render: () => (
        <div className="w-80 space-y-4">
            <InputGroup>
                <InputGroupText>
                    <Search className="h-4 w-4" />
                </InputGroupText>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 shadow-none"
                />
            </InputGroup>

            <InputGroup>
                <Input
                    type="email"
                    placeholder="Email address"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none"
                />
                <InputGroupText>@example.com</InputGroupText>
            </InputGroup>

            <InputGroup>
                <InputGroupText>
                    <Mail className="h-4 w-4" />
                </InputGroupText>
                <Input
                    type="email"
                    placeholder="Email address"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 shadow-none"
                />
                <InputGroupText>@example.com</InputGroupText>
            </InputGroup>
        </div>
    ),
}
