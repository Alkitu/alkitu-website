import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./slider"

const meta: Meta<typeof Slider> = {
    title: "Primitives/Slider",
    component: Slider,
    tags: ["autodocs"],
    argTypes: {
        disabled: {
            control: "boolean",
        },
        defaultValue: {
            control: "object",
        },
        label: {
            control: "text",
        },
        showValue: {
            control: "boolean",
        },
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "radio" },
        },
    },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
    render: (args) => (
        <div className="w-[400px]">
            <Slider defaultValue={[50]} max={100} step={1} {...args} />
        </div>
    ),
}

export const Range: Story = {
    render: (args) => (
        <div className="w-[400px] space-y-4">
            <h3 className="font-medium text-lg">Range</h3>
            <p className="text-sm text-muted-foreground mb-4">Use an array with two values for a range slider.</p>
            <div className="pt-4">
                <Slider defaultValue={[25, 75]} max={100} step={1} {...args} />
            </div>
        </div>
    ),
}

export const MultipleThumbs: Story = {
    render: (args) => (
        <div className="w-[400px] space-y-4">
            <h3 className="font-medium text-lg">Multiple Thumbs</h3>
            <p className="text-sm text-muted-foreground mb-4">Use an array with multiple values for multiple thumbs.</p>
            <div className="pt-4">
                <Slider defaultValue={[20, 50, 80]} max={100} step={1} {...args} />
            </div>
        </div>
    ),
}

export const Vertical: Story = {
    render: (args) => (
        <div className="w-[400px] space-y-4">
            <h3 className="font-medium text-lg">Vertical</h3>
            <p className="text-sm text-muted-foreground mb-4">Use <code className="bg-muted px-1.5 py-0.5 rounded">orientation="vertical"</code> for a vertical slider.</p>
            <div className="h-[200px] pt-4 flex gap-8">
                <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" {...args} />
                <Slider defaultValue={[20, 80]} max={100} step={1} orientation="vertical" {...args} />
            </div>
        </div>
    ),
}

export const Controlled: Story = {
    render: () => {
        const ControlledSlider = () => {
            const [value, setValue] = React.useState([30, 70])

            return (
                <div className="w-[400px] space-y-4">
                    <h3 className="font-medium text-lg">Controlled</h3>
                    <div className="pt-4">
                        <Slider
                            value={value}
                            onValueChange={setValue}
                            max={100}
                            step={1}
                            label="Temperature"
                            showValue
                        />
                    </div>
                </div>
            )
        }
        return <ControlledSlider />
    },
}

export const Disabled: Story = {
    render: (args) => (
        <div className="w-[400px]">
            <Slider defaultValue={[25]} max={100} step={1} disabled {...args} />
        </div>
    ),
}
