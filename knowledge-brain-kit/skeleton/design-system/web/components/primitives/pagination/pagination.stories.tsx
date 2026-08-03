import type { Meta, StoryObj } from "@storybook/react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./pagination"

const meta: Meta<typeof Pagination> = {
    title: "Primitives/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => e.preventDefault()}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => e.preventDefault()}>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
}
