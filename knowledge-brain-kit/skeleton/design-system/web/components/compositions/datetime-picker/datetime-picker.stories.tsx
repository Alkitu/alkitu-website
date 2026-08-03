"use client"

import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { format, subMonths } from "date-fns"
import { DateTimePicker, DateAndTimePicker } from "./datetime-picker"

const meta: Meta<typeof DateTimePicker> = {
    title: "Compositions/Datetime Picker",
    component: DateTimePicker,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

// Basic usage - value starts undefined
export const Default: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>(undefined)
        return (
            <div className="space-y-4">
                <DateTimePicker
                    value={date}
                    onChange={setDate}
                    className="w-[280px]"
                />
                <p className="text-xs text-center text-muted-foreground">
                    Selected: {date ? format(date, "yyyy/MM/dd HH:mm:ss") : "None"}
                </p>
            </div>
        )
    },
}

// Pre-initialized 3 months ago at 13:14:00
export const WithDefaultPopupValue: Story = {
    render: () => {
        const DefaultDate = React.useMemo(() => {
            const d = subMonths(new Date(), 3)
            d.setHours(13, 14, 0, 0)
            return d
        }, [])

        const [date, setDate] = React.useState<Date | undefined>(undefined)
        return (
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground max-w-[320px]">
                    Opens on <strong>{format(DefaultDate, "MMMM yyyy")}</strong> at{" "}
                    <strong>13:14:00</strong>. The <code className="text-xs bg-muted px-1 rounded">defaultPopupValue</code>{" "}
                    prop sets the initial calendar month without pre-selecting a date.
                </p>
                <DateTimePicker
                    value={date}
                    defaultPopupValue={DefaultDate}
                    onChange={setDate}
                    className="w-[280px]"
                />
                <p className="text-xs text-center text-muted-foreground">
                    Selected: {date ? format(date, "yyyy/MM/dd HH:mm:ss") : "None"}
                </p>
            </div>
        )
    },
}

// Side by side - Date Picker + separate Time Input (matches user's mockup)
export const DateAndTime: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>(undefined)
        return (
            <div className="space-y-4">
                <DateAndTimePicker value={date} onChange={setDate} />
                <p className="text-xs text-center text-muted-foreground">
                    Selected: {date ? format(date, "PPP HH:mm:ss") : "None"}
                </p>
            </div>
        )
    },
}
