import type { Meta, StoryObj } from "@storybook/react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./drawer"
import { Button } from "~/components/primitives/button"
import { Input } from "~/components/primitives/input"
import { Label } from "~/components/primitives/label"

const meta: Meta<typeof Drawer> = {
    title: "Primitives/Drawer",
    component: Drawer,
    tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Drawer>

const DRAWER_SIDES = ["top", "right", "bottom", "left"] as const

export const Scrollable: Story = {
    render: (args) => (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Scrollable Content</h3>
            <div className="p-8 border border-dashed rounded-md bg-transparent flex items-center justify-start w-[500px]">
                <Drawer {...args}>
                    <DrawerTrigger asChild>
                        <Button variant="outline">Scrollable Content</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
                            <DrawerHeader>
                                <DrawerTitle>Edit profile</DrawerTitle>
                                <DrawerDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 grid gap-4 py-4 overflow-y-auto">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={`name-${i}`} className="text-right">
                                            Data {i + 1}
                                        </Label>
                                        <Input id={`name-${i}`} defaultValue="Pedro Duarte" className="col-span-3 w-full" />
                                    </div>
                                ))}
                            </div>
                            <DrawerFooter>
                                <Button type="submit">Save changes</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    ),
}

export const Sides: Story = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Sides</h3>
            <div className="p-8 border border-dashed rounded-md bg-transparent flex items-center justify-start w-[500px] gap-2">
                {DRAWER_SIDES.map((side) => (
                    <Drawer key={side} direction={side}>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="capitalize">
                                {side}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Edit profile</DrawerTitle>
                                    <DrawerDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4 grid gap-4 py-4 w-full">
                                    <div className="grid grid-cols-4 items-center gap-4 w-full">
                                        <Label htmlFor={`name-${side}`} className="text-right whitespace-nowrap">
                                            Name
                                        </Label>
                                        <Input id={`name-${side}`} defaultValue="Pedro Duarte" className="col-span-3 flex-1" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4 w-full">
                                        <Label htmlFor={`username-${side}`} className="text-right whitespace-nowrap">
                                            Username
                                        </Label>
                                        <Input id={`username-${side}`} defaultValue="@peduarte" className="col-span-3 flex-1" />
                                    </div>
                                </div>
                                <DrawerFooter>
                                    <Button type="submit">Save changes</Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                ))}
            </div>
        </div>
    ),
}
