import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "~/components/primitives/button"
import { Checkbox } from "~/components/primitives/checkbox"
import { DataTable } from "./data-table"

const meta: Meta<typeof DataTable> = {
    title: "Compositions/Data Table",
    component: DataTable,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
}

export default meta
type Story = StoryObj<typeof DataTable>

type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

const data: Payment[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@yahoo.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@gmail.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@gmail.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@gmail.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@hotmail.com",
    },
    {
        id: "tq5x3j21",
        amount: 153,
        status: "processing",
        email: "james_bond@mi6.co.uk",
    },
    {
        id: "pw2l7z8x",
        amount: 549,
        status: "success",
        email: "luke.skywalker@rebel.org",
    },
    {
        id: "f8jvw3nx",
        amount: 420,
        status: "pending",
        email: "han.solo@smugglers.inc",
    },
    {
        id: "1cydk8lz",
        amount: 890,
        status: "failed",
        email: "darth.vader@empire.gov",
    },
    {
        id: "q9rxt72p",
        amount: 600,
        status: "success",
        email: "leia.organa@rebel.org",
    }
]

const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onChange={(checked) => row.toggleSelected(!!checked)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
]

export const Demo: Story = {
    render: () => (
        <div className="w-full">
            <DataTable columns={columns} data={data} searchKey="email" />
        </div>
    ),
}
