import type { Meta, StoryObj } from "@storybook/react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip"
import { Button } from "../button"

const meta: Meta<typeof Tooltip> = {
    title: "Primitives/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <TooltipProvider delayDuration={0}>
                <div className="flex h-40 items-center justify-center">
                    <Story />
                </div>
            </TooltipProvider>
        ),
    ],
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
    render: (args) => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <Button variant="outline">Hover</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add to library</p>
            </TooltipContent>
        </Tooltip>
    ),
}

export const Positions: Story = {
    render: () => (
        <div className="flex gap-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Top</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Tooltip on top</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Tooltip on right</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>Tooltip on bottom</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Left</Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Tooltip on left</p>
                </TooltipContent>
            </Tooltip>
        </div>
    ),
}
