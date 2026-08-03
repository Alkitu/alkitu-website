import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
} from "lucide-react"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "./command"

const meta: Meta<typeof Command> = {
    title: "Compositions/Command",
    component: Command,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
    render: () => (
        <Command className="rounded-lg border shadow-md max-w-[450px]">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>
                        <Calendar />
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                        <Smile />
                        <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem disabled>
                        <Calculator />
                        <span>Calculator</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem>
                        <User />
                        <span>Profile</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <CreditCard />
                        <span>Billing</span>
                        <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <Settings />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
}

export const DialogExample: Story = {
    render: () => {
        // using a custom component to handle internal state
        const CommandDialogDemo = () => {
            const [open, setOpen] = React.useState(false)

            React.useEffect(() => {
                const down = (e: KeyboardEvent) => {
                    if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        setOpen((open) => !open)
                    }
                }

                document.addEventListener("keydown", down)
                return () => document.removeEventListener("keydown", down)
            }, [])

            return (
                <div>
                    <p className="text-sm text-muted-foreground">
                        Press{" "}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>J
                        </kbd>{" "}
                        to open the command menu.
                    </p>
                    <CommandDialog open={open} onOpenChange={setOpen}>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem>
                                    <Calendar />
                                    <span>Calendar</span>
                                </CommandItem>
                                <CommandItem>
                                    <Smile />
                                    <span>Search Emoji</span>
                                </CommandItem>
                                <CommandItem>
                                    <Calculator />
                                    <span>Calculator</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem>
                                    <User />
                                    <span>Profile</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <CreditCard />
                                    <span>Billing</span>
                                    <CommandShortcut>⌘B</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <Settings />
                                    <span>Settings</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </CommandDialog>
                </div>
            )
        }

        return <CommandDialogDemo />
    },
}
