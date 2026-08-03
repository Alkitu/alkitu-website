import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./progress"

const meta: Meta<typeof Progress> = {
    title: "Primitives/Progress",
    component: Progress,
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: { type: "range", min: 0, max: 100 },
        },
        label: {
            control: "text",
        },
        showValue: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
    args: {
        value: 66,
    },
    render: (args) => (
        <div className="w-[400px]">
            <Progress {...args} />
        </div>
    ),
}

export const WithLabel: Story = {
    args: {
        value: 66,
        label: "Upload progress",
        showValue: true,
    },
    render: (args) => (
        <div className="w-[400px]">
            <Progress {...args} />
        </div>
    ),
}

export const AnimatedPlay: Story = {
    parameters: {
        chromatic: { disableSnapshot: true },
    },
    render: () => {
        // Wrap in a function call to avoid top-level state
        const AnimatedProgress = () => {
            const [progress, setProgress] = React.useState(0)

            React.useEffect(() => {
                let current = 0
                const interval = setInterval(() => {
                    current += Math.floor(Math.random() * 15) + 10
                    if (current > 100) current = 100
                    setProgress(current)
                    if (current >= 100) clearInterval(interval)
                }, 800)
                return () => clearInterval(interval)
            }, [])

            return (
                <div className="w-[400px]">
                    <Progress
                        value={progress}
                        label="Loading resources..."
                        showValue
                    />
                </div>
            )
        }
        return <AnimatedProgress />
    },
}
