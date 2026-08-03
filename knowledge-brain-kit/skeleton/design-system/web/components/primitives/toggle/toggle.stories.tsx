import type { Meta, StoryObj } from "@storybook/react"
import { Toggle } from "./toggle"
import { Bold, Italic, Underline } from "lucide-react"

const meta: Meta<typeof Toggle> = {
    title: "Primitives/Toggle",
    component: Toggle,
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
    },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Basic: Story = {
    render: (args) => (
        <div className="flex gap-4">
            <Toggle aria-label="Toggle bold" {...args}>
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Toggle italic" {...args}>
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Toggle underline" {...args}>
                <Underline className="h-4 w-4" />
            </Toggle>
        </div>
    ),
}

export const OutlineStyle: Story = {
    render: (args) => (
        <div className="flex gap-4">
            <Toggle variant="outline" aria-label="Toggle italic" {...args}>
                <Italic className="h-4 w-4 mr-2" />
                Italic
            </Toggle>
            <Toggle variant="outline" aria-label="Toggle bold" {...args}>
                <Bold className="h-4 w-4 mr-2" />
                Bold
            </Toggle>
        </div>
    ),
}

export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-center gap-4">
            <Toggle size="sm" variant="outline" aria-label="Toggle small" {...args}>
                Small
            </Toggle>
            <Toggle size="default" variant="outline" aria-label="Toggle default" {...args}>
                Default
            </Toggle>
            <Toggle size="lg" variant="outline" aria-label="Toggle large" {...args}>
                Large
            </Toggle>
        </div>
    ),
}

export const WithButtonText: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4 items-start">
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle button" {...args}>
                    Button
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle toggle" {...args}>
                    Toggle
                </Toggle>
            </div>
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle button" {...args}>
                    Button
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle toggle" {...args}>
                    Toggle
                </Toggle>
            </div>
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle button" {...args}>
                    Button
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle toggle" {...args}>
                    Toggle
                </Toggle>
            </div>
        </div>
    ),
}

export const WithButtonIcon: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4 items-start">
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle bold" {...args}>
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle bold" {...args}>
                    <Bold className="h-4 w-4" />
                </Toggle>
            </div>
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle italic" {...args}>
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle italic" {...args}>
                    <Italic className="h-4 w-4" />
                </Toggle>
            </div>
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle underline" {...args}>
                    <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle underline" {...args}>
                    <Underline className="h-4 w-4" />
                </Toggle>
            </div>
        </div>
    ),
}

export const WithButtonIconText: Story = {
    name: "With Button Icon + Text",
    render: (args) => (
        <div className="flex flex-col gap-4 items-start">
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle bold" {...args}>
                    <Bold className="h-4 w-4 mr-2" />
                    Button
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle bold" {...args}>
                    <Bold className="h-4 w-4 mr-2" />
                    Toggle
                </Toggle>
            </div>
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle italic" {...args}>
                    <Italic className="h-4 w-4 mr-2" />
                    Button
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle italic" {...args}>
                    <Italic className="h-4 w-4 mr-2" />
                    Toggle
                </Toggle>
            </div>
            <div className="flex gap-4">
                <Toggle variant="outline" aria-label="Toggle underline" {...args}>
                    <Underline className="h-4 w-4 mr-2" />
                    Button
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle underline" {...args}>
                    <Underline className="h-4 w-4 mr-2" />
                    Toggle
                </Toggle>
            </div>
        </div>
    ),
}


export const DisabledState: Story = {
    name: "Disabled",
    render: (args) => (
        <div className="flex gap-4">
            <Toggle disabled variant="default" aria-label="Toggle disabled" {...args}>
                Disabled
            </Toggle>
            <Toggle disabled variant="outline" aria-label="Toggle disabled" {...args}>
                Disabled
            </Toggle>
        </div>
    ),
}

export const WithIcon: Story = {
    render: (args) => (
        <div className="flex gap-4">
            <Toggle aria-label="Toggle bookmark" {...args}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                >
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                </svg>
            </Toggle>
            <Toggle variant="outline" aria-label="Toggle bookmark" {...args}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                Bookmark
            </Toggle>
        </div>
    )
}
