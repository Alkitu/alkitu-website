import type { Meta, StoryObj } from "@storybook/react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./sheet"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"

const meta: Meta<typeof Sheet> = {
    title: "Primitives/Sheet",
    component: Sheet,
    tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Sheet>

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

export const Scrollable: Story = {
    render: (args) => (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Scrollable Content</h3>
            <div className="p-8 border border-dashed rounded-md bg-transparent flex items-center justify-start w-[500px]">
                <Sheet {...args}>
                    <SheetTrigger asChild>
                        <Button variant="outline">Scrollable Content</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor={`name-${i}`} className="text-right">
                                        Data {i + 1}
                                    </Label>
                                    <Input id={`name-${i}`} defaultValue="Pedro Duarte" className="col-span-3 w-full" />
                                </div>
                            ))}
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    ),
}

export const Sides: Story = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Sides</h3>
            <div className="p-8 border border-dashed rounded-md bg-transparent flex items-center justify-start w-[500px] gap-2">
                {SHEET_SIDES.map((side) => (
                    <Sheet key={side}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="capitalize">
                                {side}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={side}>
                            <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4 w-full">
                                <div className="grid grid-cols-4 items-center gap-4 w-full">
                                    <Label htmlFor={`name-${side}`} className="text-right whitespace-nowrap">
                                        Name
                                    </Label>
                                    <Input id={`name-${side}`} defaultValue="Pedro Duarte" className="col-span-3 w-full" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 w-full">
                                    <Label htmlFor={`username-${side}`} className="text-right whitespace-nowrap">
                                        Username
                                    </Label>
                                    <Input id={`username-${side}`} defaultValue="@peduarte" className="col-span-3 w-full" />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                ))}
            </div>
        </div>
    ),
}
