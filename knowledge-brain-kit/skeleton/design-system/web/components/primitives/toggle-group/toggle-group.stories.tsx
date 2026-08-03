import type { Meta, StoryObj } from "@storybook/react"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

const meta: Meta<typeof ToggleGroup> = {
    title: "Primitives/Toggle Group",
    component: ToggleGroup,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "outline"],
        },
        size: {
            control: "select",
            options: ["sm", "default", "lg"],
        },
        type: {
            control: "radio",
            options: ["single", "multiple"],
        },
    },
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const SingleSingle: Story = {
    name: "Single Selection",
    render: () => (
        <ToggleGroup type="single" defaultValue="center">
            <ToggleGroupItem value="left" aria-label="Toggle left align">
                <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Toggle center align">
                <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Toggle right align">
                <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}

export const MultipleSelection: Story = {
    render: () => (
        <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}

export const OutlineStyle: Story = {
    render: () => (
        <ToggleGroup type="single" variant="outline">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}

export const Vertical: Story = {
    render: () => (
        <ToggleGroup type="single" orientation="vertical">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}


export const VerticalOutline: Story = {
    render: () => (
        <ToggleGroup type="single" variant="outline" orientation="vertical" className="w-[120px]">
            <ToggleGroupItem value="all" className="w-full justify-center">
                All
            </ToggleGroupItem>
            <ToggleGroupItem value="active" className="w-full justify-center">
                Active
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" className="w-full justify-center">
                Completed
            </ToggleGroupItem>
            <ToggleGroupItem value="archived" className="w-full justify-center">
                Archived
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}

export const VerticalOutlineWithIcons: Story = {
    render: () => (
        <ToggleGroup type="single" variant="outline" orientation="vertical">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}

export const VerticalWithSpacing: Story = {
    render: () => (
        <ToggleGroup type="single" variant="outline" orientation="vertical" spacing={2} className="w-[80px]">
            <ToggleGroupItem value="top" className="w-full justify-center">
                Top
            </ToggleGroupItem>
            <ToggleGroupItem value="bottom" className="w-full justify-center">
                Bottom
            </ToggleGroupItem>
            <ToggleGroupItem value="left" className="w-full justify-center">
                Left
            </ToggleGroupItem>
            <ToggleGroupItem value="right" className="w-full justify-center">
                Right
            </ToggleGroupItem>
        </ToggleGroup>
    ),
}
