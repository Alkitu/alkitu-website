import type { Meta, StoryObj } from "@storybook/react"
import { AspectRatio } from "./aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
    title: "Primitives/Aspect Ratio",
    component: AspectRatio,
    tags: ["autodocs"],
    argTypes: {
        ratio: {
            control: "number",
        },
    },
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
    render: (args) => (
        <div className="w-[400px]">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden" {...args}>
                <img
                    src="/gallery/landscape-01-valley.png"
                    alt="Mountain valley landscape"
                    className="object-cover w-full h-full"
                />
            </AspectRatio>
        </div>
    ),
}

export const Square: Story = {
    render: (args) => (
        <div className="w-[250px]">
            <AspectRatio ratio={1 / 1} className="bg-muted rounded-md overflow-hidden" {...args}>
                <img
                    src="/gallery/landscape-03-coastal.png"
                    alt="Coastal landscape"
                    className="object-cover w-full h-full"
                />
            </AspectRatio>
        </div>
    ),
}
