import type { Meta, StoryObj } from "@storybook/react"
import { ButtonGroup } from "./button-group"
import { Button } from "../button"
import { Input } from "../input"
import { ChevronDown, Hash, Square, Circle, Share, Copy, Search, ChevronLeft, ChevronRight, Plus, Minus, SearchIcon } from "lucide-react"

const meta: Meta<typeof ButtonGroup> = {
    title: "Primitives/Button Group",
    component: ButtonGroup,
    tags: ["autodocs"],
    argTypes: {
        orientation: {
            control: "radio",
            options: ["horizontal", "vertical"],
        },
    },
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Basic: Story = {
    render: (args) => (
        <ButtonGroup {...args}>
            <Button variant="outline">Button</Button>
            <Button variant="outline">Another Button</Button>
        </ButtonGroup>
    ),
}

export const WithInput: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <ButtonGroup {...args}>
                <Button variant="outline">Button</Button>
                <Input placeholder="Type something here..." className="rounded-r-md rounded-l-none border-l-0 w-[200px]" />
            </ButtonGroup>
            <ButtonGroup {...args}>
                <Input placeholder="Type something here..." className="rounded-l-md rounded-r-none border-r-0 w-[200px]" />
                <Button variant="outline">Button</Button>
            </ButtonGroup>
        </div>
    ),
}

export const WithText: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <ButtonGroup {...args}>
                <div className="flex items-center justify-center px-4 border border-input bg-muted/50 rounded-l-md text-sm font-medium">Text</div>
                <Button variant="outline" className="rounded-l-none border-l-0">Another Button</Button>
            </ButtonGroup>
            <ButtonGroup {...args}>
                <div className="flex items-center justify-center px-4 border border-input bg-muted/50 rounded-l-md text-sm font-medium">GPU Size</div>
                <Input placeholder="Type something here..." className="rounded-l-none border-l-0 w-[200px]" />
            </ButtonGroup>
        </div>
    ),
}

export const WithDropdown: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <ButtonGroup {...args}>
                <Button variant="outline">Update</Button>
                <Button variant="outline" size="icon"><ChevronDown className="h-4 w-4" /></Button>
            </ButtonGroup>
            <ButtonGroup {...args}>
                <Button variant="outline">Follow</Button>
                <Button variant="outline" size="icon"><ChevronDown className="h-4 w-4" /></Button>
            </ButtonGroup>
        </div>
    ),
}

export const WithSelect: Story = {
    render: (args) => (
        <div className="w-[400px]">
            <label className="text-sm font-medium mb-2 block">Amount</label>
            <ButtonGroup className="w-full" {...args}>
                <Button variant="outline" className="px-3 gap-1 rounded-r-none border-r-0 focus:z-10">
                    $ <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Input placeholder="Enter amount to send" className="rounded-none border-x-0 flex-1 focus-visible:z-10" />
                <Button variant="outline" size="icon" className="rounded-l-none border-l-0 focus:z-10">→</Button>
            </ButtonGroup>
        </div>
    ),
}

export const WithIcons: Story = {
    render: (args) => (
        <ButtonGroup {...args}>
            <Button variant="outline" size="icon"><Square className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Hash className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Circle className="h-4 w-4" /></Button>
        </ButtonGroup>
    ),
}

export const WithInputGroup: Story = {
    render: (args) => (
        <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Type to search..." className="pl-9" />
        </div>
    ),
}


export const WithFields: Story = {
    render: (args) => (
        <div className="w-[300px]">
            <label className="text-sm font-medium mb-2 block">Width</label>
            <ButtonGroup className="w-full" {...args}>
                <div className="flex flex-1 items-center border border-input rounded-l-md px-3 bg-background">
                    <span className="text-muted-foreground text-sm flex-1">W</span>
                    <span className="text-muted-foreground text-sm border-none outline-none bg-transparent text-right w-full">px</span>
                </div>
                <Button variant="outline" size="icon" className="rounded-none border-x-0"><Minus className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
            </ButtonGroup>
        </div>
    ),
}

export const Nested: Story = {
    render: (args) => (
        <ButtonGroup className="w-[400px]" {...args}>
            <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
            <Input placeholder="Send a message..." className="rounded-none border-x-0 w-full" />
            <Button variant="outline" size="icon"><Share className="h-4 w-4" /></Button>
        </ButtonGroup>
    ),
}

// Pagination specific group with outline borders merging
export const Pagination: Story = {
    render: (args) => (
        <ButtonGroup {...args}>
            <Button variant="outline" className="gap-1"><ChevronLeft className="h-4 w-4" /> Previous</Button>
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">4</Button>
            <Button variant="outline">5</Button>
            <Button variant="outline" className="gap-1">Next <ChevronRight className="h-4 w-4" /></Button>
        </ButtonGroup>
    ),
}

export const PaginationSplit: Story = {
    render: (args) => (
        <div className="flex gap-4">
            <ButtonGroup {...args}>
                <Button variant="outline">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">4</Button>
                <Button variant="outline">5</Button>
            </ButtonGroup>
            <ButtonGroup {...args}>
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
            </ButtonGroup>
        </div>
    ),
}

export const Navigation: Story = {
    render: (args) => (
        <div className="flex gap-4">
            <ButtonGroup {...args}>
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
            </ButtonGroup>
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
        </div>
    ),
}

export const TextAlignment: Story = {
    render: (args) => (
        <div>
            <label className="text-sm font-medium mb-2 block">Text Alignment</label>
            <ButtonGroup {...args}>
                <Button variant="outline">Left</Button>
                <Button variant="outline">Center</Button>
                <Button variant="outline">Right</Button>
                <Button variant="outline">Justify</Button>
            </ButtonGroup>
        </div>
    ),
}

export const Vertical: Story = {
    render: (args) => (
        <ButtonGroup orientation="vertical" {...args}>
            <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
        </ButtonGroup>
    ),
}

export const VerticalNested: Story = {
    render: (args) => (
        <ButtonGroup orientation="vertical" {...args}>
            <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Share className="h-4 w-4" /></Button>
        </ButtonGroup>
    ),
}
