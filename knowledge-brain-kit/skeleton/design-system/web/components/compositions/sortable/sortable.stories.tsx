import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Sortable, SortableItem, SortableDragHandle } from "./sortable"
import { Card } from "~/components/primitives/card"
import { Button } from "~/components/primitives/button"
import { Switch } from "~/components/primitives/switch"
import { Badge } from "~/components/primitives/badge"
import { QrCode, Image, Star, Copy, Lock, BarChart3, Trash2, Pencil, Share } from "lucide-react"

const meta: Meta<typeof Sortable> = {
    title: "Compositions/Sortable",
    component: Sortable,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof Sortable>

// --- Helper Data ---
const initialListItems = [
    { id: "1", content: "Implement Authentication" },
    { id: "2", content: "Design System Foundations" },
    { id: "3", content: "Drag and Drop Functionality" },
    { id: "4", content: "Deploy to Production" },
]

const initialGridItems = [
    { id: "a", title: "Project A", color: "bg-blue-500/10 text-blue-600" },
    { id: "b", title: "Project B", color: "bg-emerald-500/10 text-emerald-600" },
    { id: "c", title: "Project C", color: "bg-amber-500/10 text-amber-600" },
    { id: "d", title: "Project D", color: "bg-rose-500/10 text-rose-600" },
    { id: "e", title: "Project E", color: "bg-indigo-500/10 text-indigo-600" },
    { id: "f", title: "Project F", color: "bg-teal-500/10 text-teal-600" },
]

// --- Stories ---
export const VerticalList: Story = {
    render: () => {
        const [items, setItems] = React.useState(initialListItems)

        return (
            <div className="w-full max-w-md">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Task Priority (Drag to reorder)</h3>
                <Sortable items={items} onReorder={setItems} strategy="vertical">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            <Card className="flex-row items-center gap-3 p-3 bg-card/50 hover:bg-muted/50 transition-colors">
                                <SortableDragHandle variant="vertical" />
                                <span className="text-sm font-medium">{item.content}</span>
                            </Card>
                        </SortableItem>
                    ))}
                </Sortable>
            </div>
        )
    },
}

// --- Link Manager (rich cards like Linktree) ---
const initialLinks = [
    { id: "1", name: "Google", url: "https://www.google.com", clicks: 0, enabled: true },
    { id: "2", name: "Snapchat", url: "", clicks: 0, enabled: false },
    { id: "3", name: "GitHub", url: "https://github.com", clicks: 24, enabled: true },
    { id: "4", name: "Portfolio", url: "https://mysite.dev", clicks: 112, enabled: true },
]

export const LinkManager: Story = {
    render: () => {
        const [items, setItems] = React.useState(initialLinks)

        const toggleItem = (id: string) => {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, enabled: !item.enabled } : item
                )
            )
        }

        const removeItem = (id: string) => {
            setItems((prev) => prev.filter((item) => item.id !== id))
        }

        return (
            <div className="w-full max-w-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Link Manager (Drag to reorder)</h3>
                <Sortable items={items} onReorder={setItems} strategy="vertical">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            <Card className="flex-row gap-0 p-0 overflow-hidden">
                                {/* Drag handle */}
                                <div className="flex items-center px-3 border-r border-border">
                                    <SortableDragHandle variant="vertical" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 space-y-2">
                                    {/* Top row: name + actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-foreground">{item.name}</span>
                                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" iconOnly>
                                                <Share className="h-3.5 w-3.5" />
                                            </Button>
                                            <Switch
                                                checked={item.enabled}
                                                onCheckedChange={() => toggleItem(item.id)}
                                            />
                                        </div>
                                    </div>

                                    {/* URL row */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground truncate">
                                            {item.url || "URL"}
                                        </span>
                                        <Pencil className="h-3 w-3 text-muted-foreground shrink-0" />
                                    </div>

                                    {/* Bottom row: icons + stats + delete */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <QrCode className="h-4 w-4" />
                                            <Image className="h-4 w-4" />
                                            <Star className="h-4 w-4" />
                                            <Copy className="h-4 w-4" />
                                            <Lock className="h-4 w-4" />
                                            <div className="flex items-center gap-1 text-xs">
                                                <BarChart3 className="h-4 w-4" />
                                                <span>{item.clicks} clicks</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            iconOnly
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </SortableItem>
                    ))}
                </Sortable>
            </div>
        )
    },
}

export const GridCards: Story = {
    render: () => {
        const [items, setItems] = React.useState(initialGridItems)

        return (
            <div className="w-full max-w-2xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Dashboard Widgets (Drag to rearrange)</h3>
                <Sortable items={items} onReorder={setItems} strategy="grid" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            <Card className="flex flex-col h-32 p-4 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-grab active:cursor-grabbing">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortableDragHandle variant="vertical" className="bg-background/80 backdrop-blur-sm" />
                                </div>
                                <div className={`mt-auto inline-flex px-2 py-1 rounded-md text-xs font-medium w-fit ${item.color}`}>
                                    {item.title}
                                </div>
                            </Card>
                        </SortableItem>
                    ))}
                </Sortable>
            </div>
        )
    },
}
