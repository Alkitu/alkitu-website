'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface StringListInputProps {
  label: string;
  hint?: string;
  values: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
}

/**
 * Chip-style editor for the contract's many string arrays (tags, secondary
 * keywords, entities, aliases). Enter or comma commits an entry.
 */
export function StringListInput({
  label,
  hint,
  values,
  placeholder,
  onChange,
}: StringListInputProps) {
  const [draft, setDraft] = useState('');

  const commit = (raw: string) => {
    const value = raw.trim().replace(/,$/, '');
    if (!value || values.includes(value)) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        <span className="ml-2 text-xs text-muted-foreground">({values.length})</span>
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      <div className="flex flex-wrap gap-2 rounded-md border border-border bg-background p-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== value))}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Quitar ${value}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(draft)}
          placeholder={values.length ? '' : placeholder}
          className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}
