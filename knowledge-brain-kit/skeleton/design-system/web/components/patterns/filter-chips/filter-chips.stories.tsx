import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterChips } from "./filter-chips";

const meta: Meta<typeof FilterChips> = {
  title: "Patterns/FilterChips",
  component: FilterChips,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FilterChips>;

const OPCIONES = [
  { id: "a", label: "Categoría A" },
  { id: "b", label: "Categoría B" },
  { id: "c", label: "Categoría C" },
];

export const Interactivo: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <FilterChips options={OPCIONES} value={value} onChange={setValue} className="gap-2" />;
  },
};

export const EstiloBlog: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <FilterChips
        options={OPCIONES}
        value={value}
        onChange={(id) => setValue(id === value ? null : id)}
        allLabel="Todos"
        paddingClassName="px-4 py-2"
        inactiveClassName="border-neutral-300 text-muted-foreground"
        className="items-center gap-2"
      />
    );
  },
};
