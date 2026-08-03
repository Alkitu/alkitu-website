import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { DatePicker, DateRangePicker } from "./date-picker"

const meta: Meta<typeof DatePicker> = {
    title: "Compositions/Date Picker",
    component: DatePicker,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
    render: () => <DatePicker />,
}

export const WithPlaceholder: Story = {
    render: () => <DatePicker placeholder="Select a due date..." />,
}

export const RangePicker: Story = {
    render: () => <DateRangePicker />,
}
