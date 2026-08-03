import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { AdvancedMultiSelect, type Tag } from "./advanced-multi-select"

const meta: Meta<typeof AdvancedMultiSelect> = {
    title: "Compositions/Advanced Multi Select",
    component: AdvancedMultiSelect,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
}

export default meta
type Story = StoryObj<typeof AdvancedMultiSelect>

// Initial mock data simulating a CMS or database lookup table
const MOCK_OPTIONS: Tag[] = [
    { id: "opt-1", label: "Frontend", color: "blue" },
    { id: "opt-2", label: "Backend", color: "green" },
    { id: "opt-3", label: "Design System", color: "purple" },
    { id: "opt-4", label: "Bug", color: "red" },
    { id: "opt-5", label: "Feature", color: "amber" },
]

export const Default: Story = {
    render: () => {
        // State lives in the story so interactions persist during preview
        const [selectedTags, setSelectedTags] = React.useState<Tag[]>([
            MOCK_OPTIONS[2], // Design System
            MOCK_OPTIONS[0], // Frontend
        ])

        return (
            <div className="w-full max-w-sm">
                <h3 className="text-sm font-medium mb-1.5">Categorías del Proyecto</h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Selecciona, crea o reordena las categorías arrastrando las etiquetas.
                </p>
                <AdvancedMultiSelect
                    value={selectedTags}
                    onChange={setSelectedTags}
                    options={MOCK_OPTIONS}
                    placeholder="Selecciona o crea un tag..."
                />
            </div>
        )
    },
}

export const EmptyState: Story = {
    render: () => {
        const [selectedTags, setSelectedTags] = React.useState<Tag[]>([])

        return (
            <div className="w-full max-w-sm">
                <AdvanceMultiSelectWrapper
                    value={selectedTags}
                    onChange={setSelectedTags}
                    options={MOCK_OPTIONS}
                />
            </div>
        )
    }
}

// Wrapper for stories to maintain local state implicitly without cluttering code tabs
function AdvanceMultiSelectWrapper(props: any) {
    const [val, setVal] = React.useState<Tag[]>(props.value || [])
    return <AdvancedMultiSelect {...props} value={val} onChange={setVal} />
}

export const InTableContext: Story = {
    render: () => {
        const [rowState, setRowState] = React.useState<Record<string, Tag[]>>({
            "task-1": [MOCK_OPTIONS[4], MOCK_OPTIONS[0]], // Feature, Frontend
            "task-2": [MOCK_OPTIONS[3]],                  // Bug
            "task-3": [],
        })

        const updateRow = (taskId: string, newTags: Tag[]) => {
            setRowState(prev => ({ ...prev, [taskId]: newTags }))
        }

        return (
            <div className="w-full max-w-2xl border rounded-md">
                <div className="grid grid-cols-[1fr_250px] gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div>Nombre de Tarea</div>
                    <div>Etiquetas (Variante Table)</div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-[1fr_250px] gap-4 p-4 border-b items-center">
                    <div className="text-sm font-medium">Implementar Drag and Drop</div>
                    <div>
                        <AdvancedMultiSelect
                            variant="table"
                            value={rowState["task-1"]}
                            onChange={(t) => updateRow("task-1", t)}
                            options={MOCK_OPTIONS}
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-[1fr_250px] gap-4 p-4 border-b items-center">
                    <div className="text-sm font-medium">Corregir CSS en Safari</div>
                    <div>
                        <AdvancedMultiSelect
                            variant="table"
                            value={rowState["task-2"]}
                            onChange={(t) => updateRow("task-2", t)}
                            options={MOCK_OPTIONS}
                        />
                    </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-[1fr_250px] gap-4 p-4 items-center">
                    <div className="text-sm font-medium">Reunión de Planificación Q3</div>
                    <div>
                        <AdvancedMultiSelect
                            variant="table"
                            value={rowState["task-3"]}
                            onChange={(t) => updateRow("task-3", t)}
                            options={MOCK_OPTIONS}
                        />
                    </div>
                </div>
            </div>
        )
    },
}
