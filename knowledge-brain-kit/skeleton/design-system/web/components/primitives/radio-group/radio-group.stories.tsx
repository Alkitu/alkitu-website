import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "../label"

const meta: Meta<typeof RadioGroup> = {
    title: "Primitives/Radio Group",
    component: RadioGroup,
    tags: ["autodocs"],
    argTypes: {
        disabled: {
            control: "boolean",
        },
        value: {
            control: "text",
        },
    },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
            </div>
        </RadioGroup>
    ),
}

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue="option-one" disabled>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="disabled-one" />
                <Label htmlFor="disabled-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="disabled-two" />
                <Label htmlFor="disabled-two">Option Two</Label>
            </div>
        </RadioGroup>
    ),
}
