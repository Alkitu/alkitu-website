"use client"

import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./calendar"

const meta: Meta<typeof Calendar> = {
    title: "Primitives/Calendar",
    component: Calendar,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>(new Date())
        return (
            <div className="space-y-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow"
                />
                <p className="text-sm text-center text-muted-foreground">
                    Selected: {date ? date.toLocaleDateString() : "None"}
                </p>
            </div>
        )
    },
}

export const WithDropdowns: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>(new Date())
        return (
            <div className="space-y-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                    className="rounded-md border shadow"
                />
                <p className="text-sm text-center text-muted-foreground">
                    Selected: {date ? date.toLocaleDateString() : "None"}
                </p>
            </div>
        )
    },
}

export const RangeMode: Story = {
    render: () => {
        const [range, setRange] = React.useState<{ from: Date | undefined; to?: Date | undefined }>({
            from: new Date(),
            to: undefined,
        })
        return (
            <div className="space-y-4">
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={(r) => setRange(r ?? { from: undefined })}
                    numberOfMonths={2}
                    className="rounded-md border shadow"
                />
                <p className="text-sm text-center text-muted-foreground">
                    {range.from ? range.from.toLocaleDateString() : "Pick"}{" "}
                    → {range.to ? range.to.toLocaleDateString() : "Pick end date"}
                </p>
            </div>
        )
    },
}

export const WithDisabledDates: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>()
        const today = new Date()
        return (
            <div className="space-y-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < today}
                    className="rounded-md border shadow"
                />
                <p className="text-sm text-center text-muted-foreground">
                    Past dates are disabled. Selected: {date ? date.toLocaleDateString() : "None"}
                </p>
            </div>
        )
    },
}
