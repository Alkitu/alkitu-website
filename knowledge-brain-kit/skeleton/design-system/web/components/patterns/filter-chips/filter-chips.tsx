"use client";

export type FilterChipOption = { id: string; label: string };

/**
 * Chips de filtro tipo píldora (categorías de Blog/Reviews). Activo = marca
 * (tokens primary), inactivo configurable. El chip "todos" emite id=null. La
 * semántica de selección (toggle o set directo) la decide el padre en onChange.
 * ds:patterns/filter-chips.
 */
export function FilterChips({
  options,
  value,
  onChange,
  allLabel = "Todas",
  inactiveClassName = "border-neutral-300 text-foreground",
  paddingClassName = "px-4 py-1.5",
  className = "",
}: {
  options: FilterChipOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  allLabel?: string;
  inactiveClassName?: string;
  paddingClassName?: string;
  className?: string;
}) {
  const chip = (id: string | null, label: string) => {
    const active = value === id;
    return (
      <button
        key={id ?? "__all__"}
        type="button"
        onClick={() => onChange(id)}
        className={`rounded-full border ${paddingClassName} text-sm transition-colors ${
          active ? "border-primary bg-primary text-white" : inactiveClassName
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={`flex flex-wrap ${className}`}>
      {chip(null, allLabel)}
      {options.map((o) => chip(o.id, o.label))}
    </div>
  );
}
