import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { Separator } from "../separator"

const meta: Meta<typeof ScrollArea> = {
    title: "Primitives/Scroll Area",
    component: ScrollArea,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export const Vertical: Story = {
    render: (args) => (
        <ScrollArea className="h-72 w-48 rounded-md border" {...args}>
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                {tags.map((tag) => (
                    <React.Fragment key={tag}>
                        <div className="text-sm">
                            {tag}
                        </div>
                        <Separator className="my-2" />
                    </React.Fragment>
                ))}
            </div>
        </ScrollArea>
    ),
}

export const Horizontal: Story = {
    render: (args) => (
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border" {...args}>
            <div className="flex w-max space-x-4 p-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-[150px] shrink-0">
                        <div className="overflow-hidden rounded-md">
                            <img
                                src={`/gallery/landscape-01-valley.png`}
                                alt="Art"
                                className="aspect-[3/4] h-fit w-fit object-cover"
                            />
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Photo {i + 1}
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
}
