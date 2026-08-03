import type { Meta, StoryObj } from "@storybook/react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../button"
import { Input } from "../input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { DataTable } from "../../compositions/data-table"
import { Checkbox } from "../checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

const meta: Meta<typeof Table> = {
    title: "Primitives/Table",
    component: Table,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
}

export default meta
type Story = StoryObj<typeof Table>

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
]

export const Default: Story = {
    render: () => (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    ),
}

export const WithActions: Story = {
    render: () => (
        <Table className="max-w-xl mx-auto border rounded-md">
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Wireless Mouse</TableCell>
                    <TableCell>$29.99</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Mechanical Keyboard</TableCell>
                    <TableCell>$129.99</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">USB-C Hub</TableCell>
                    <TableCell>$49.99</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
}

export const WithSelect: Story = {
    render: () => (
        <Table className="max-w-2xl mx-auto border rounded-md">
            <TableHeader>
                <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Design homepage</TableCell>
                    <TableCell>
                        <Select defaultValue="sarah">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sarah">Sarah Chen</SelectItem>
                                <SelectItem value="marc">Marc Rodriguez</SelectItem>
                                <SelectItem value="emily">Emily Watson</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell>In Progress</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Implement API</TableCell>
                    <TableCell>
                        <Select defaultValue="marc">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sarah">Sarah Chen</SelectItem>
                                <SelectItem value="marc">Marc Rodriguez</SelectItem>
                                <SelectItem value="emily">Emily Watson</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell>Pending</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Write tests</TableCell>
                    <TableCell>
                        <Select defaultValue="emily">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sarah">Sarah Chen</SelectItem>
                                <SelectItem value="marc">Marc Rodriguez</SelectItem>
                                <SelectItem value="emily">Emily Watson</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell>Not Started</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
}

export const WithInput: Story = {
    render: () => (
        <Table className="max-w-xl mx-auto border rounded-md">
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Wireless Mouse</TableCell>
                    <TableCell>
                        <Input type="number" defaultValue={1} className="w-[80px]" />
                    </TableCell>
                    <TableCell>$29.99</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Mechanical Keyboard</TableCell>
                    <TableCell>
                        <Input type="number" defaultValue={2} className="w-[80px]" />
                    </TableCell>
                    <TableCell>$129.99</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">USB-C Hub</TableCell>
                    <TableCell>
                        <Input type="number" defaultValue={1} className="w-[80px]" />
                    </TableCell>
                    <TableCell>$49.99</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
}

type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

const dataPayments: Payment[] = [
    { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com" },
    { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@gmail.com" },
    { id: "derv1ws0", amount: 837, status: "processing", email: "Monserrat44@gmail.com" },
    { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@gmail.com" },
    { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@hotmail.com" },
    { id: "tq5x3j21", amount: 153, status: "processing", email: "james_bond@mi6.co.uk" },
    { id: "pw2l7z8x", amount: 549, status: "success", email: "luke.skywalker@rebel.org" },
    { id: "f8jvw3nx", amount: 420, status: "pending", email: "han.solo@smugglers.inc" },
    { id: "1cydk8lz", amount: 890, status: "failed", email: "darth.vader@empire.gov" },
    { id: "q9rxt72p", amount: 600, status: "success", email: "leia.organa@rebel.org" },
]

const paymentColumns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(checked) => row.toggleSelected(!!checked)}
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
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
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

export const WithDataTable: Story = {
    render: () => (
        <div className="w-full max-w-4xl mx-auto">
            <DataTable columns={paymentColumns} data={dataPayments} searchKey="email" />
        </div>
    ),
}
