"use client"

import * as React from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, GripHorizontal } from "lucide-react"
import { cn } from "~/lib/utils"

// -----------------------------------------------------------------------------
// Sortable Wrapper Components
// -----------------------------------------------------------------------------

interface SortableProps<T> {
    items: T[]
    onReorder: (items: T[]) => void
    children: React.ReactNode
    strategy?: "vertical" | "grid"
    className?: string
}

export function Sortable<T extends { id: string | number }>({
    items,
    onReorder,
    children,
    strategy = "vertical",
    className,
}: SortableProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                // Delay 10ms to allow clicks on buttons inside draggable items
                delay: 10,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            onReorder(arrayMove(items, oldIndex, newIndex))
        }
    }

    const sortingStrategy =
        strategy === "grid" ? rectSortingStrategy : verticalListSortingStrategy

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={sortingStrategy}>
                <div className={cn("flex", strategy === "vertical" ? "flex-col gap-2" : "flex-wrap gap-4", className)}>
                    {children}
                </div>
            </SortableContext>
        </DndContext>
    )
}

// -----------------------------------------------------------------------------
// Sortable Item
// -----------------------------------------------------------------------------

export const SortableItemContext = React.createContext<{
    attributes: Record<string, any>
    listeners: Record<string, any>
    setNodeRef: (node: HTMLElement | null) => void
    isDragging: boolean
} | null>(null)

interface SortableItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
    id: string | number
    asChild?: boolean
}

export function SortableItem({ id, className, children, ...props }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <SortableItemContext.Provider value={{ attributes, listeners: listeners ?? {}, setNodeRef, isDragging }}>
            <div
                ref={setNodeRef}
                style={style}
                className={cn(isDragging && "z-50 opacity-50", className)}
                {...props}
            >
                {children}
            </div>
        </SortableItemContext.Provider>
    )
}

// -----------------------------------------------------------------------------
// Sortable Drag Handle
// -----------------------------------------------------------------------------

interface SortableDragHandleProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "vertical" | "horizontal"
    withIcon?: boolean
}

export function SortableDragHandle({
    className,
    variant = "vertical",
    withIcon = true,
    ...props
}: SortableDragHandleProps) {
    const context = React.useContext(SortableItemContext)

    if (!context) {
        throw new Error("SortableDragHandle must be used within a SortableItem")
    }

    const { attributes, listeners } = context
    const Icon = variant === "vertical" ? GripVertical : GripHorizontal

    return (
        <div
            {...attributes}
            {...listeners}
            className={cn(
                "cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md",
                className
            )}
            {...props}
        >
            {withIcon && <Icon className="h-4 w-4" />}
        </div>
    )
}
