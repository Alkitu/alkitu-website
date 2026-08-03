import type { Meta, StoryObj } from "@storybook/react"
import { Field, FieldLabel, FieldDescription, FieldError } from "./field"
import { Input } from "~/components/primitives/input"

const meta: Meta<typeof Field> = {
    title: "Primitives/Field",
    component: Field,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
    render: () => (
        <Field className="max-w-sm">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" placeholder="shadcn" />
            <FieldDescription>This is your public display name.</FieldDescription>
        </Field>
    ),
}

export const WithError: Story = {
    render: () => (
        <Field className="max-w-sm">
            <FieldLabel htmlFor="email" className="text-destructive">Email</FieldLabel>
            <Input id="email" type="email" value="invalid-email" className="border-destructive focus-visible:ring-destructive" />
            <FieldError>Please enter a valid email address.</FieldError>
        </Field>
    ),
}
