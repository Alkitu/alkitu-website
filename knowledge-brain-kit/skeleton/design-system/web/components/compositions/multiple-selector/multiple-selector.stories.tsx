import type { Meta, StoryObj } from "@storybook/react"
import { userEvent, within, expect } from 'storybook/test';
import MultipleSelector, { Option } from "./multiple-selector"

const meta: Meta<typeof MultipleSelector> = {
    title: "Compositions/Multiple Selector",
    component: MultipleSelector,
    tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof MultipleSelector>

const OPTIONS: Option[] = [
    { label: 'Next.js', value: 'nextjs' },
    { label: 'React', value: 'react' },
    { label: 'Remix', value: 'remix' },
    { label: 'Vite', value: 'vite' },
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Angular', value: 'angular' },
    { label: 'Ember', value: 'ember', disable: true },
    { label: 'Gatsby', value: 'gatsby', disable: true },
    { label: 'Astro', value: 'astro' },
];

export const Demo: Story = {
    render: () => {
        return (
            <div className="w-full max-w-xl mx-auto py-10">
                <MultipleSelector
                    defaultOptions={OPTIONS}
                    placeholder="Select frameworks you like..."
                    emptyIndicator={
                        <p className="text-center text-lg leading-10 text-muted-foreground">
                            no results found.
                        </p>
                    }
                />
            </div>
        );
    }
}
