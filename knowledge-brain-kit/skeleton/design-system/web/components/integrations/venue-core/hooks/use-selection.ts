'use client';

import { useCallback, useState } from 'react';
import type { SelectionConfig } from '../types';

// ---------------------------------------------------------------------------
// useSelection — multi-select hook with Shift/Ctrl support
// ---------------------------------------------------------------------------

interface UseSelectionReturn {
  /** Currently selected IDs */
  selected: Set<string>;
  /** Toggle an item. Pass the keyboard event to support Shift/Ctrl. */
  toggle: (id: string, event?: Pick<React.MouseEvent, 'shiftKey' | 'metaKey' | 'ctrlKey'>) => void;
  /** Select a single item (deselects all others) */
  selectOne: (id: string) => void;
  /** Select multiple items at once */
  selectMany: (ids: string[]) => void;
  /** Clear the entire selection */
  clear: () => void;
  /** Check if an item is selected */
  isSelected: (id: string) => boolean;
  /** Replace the full selection */
  setSelected: (ids: Set<string>) => void;
}

export function useSelection(config?: SelectionConfig): UseSelectionReturn {
  const mode = config?.mode ?? 'multiple';
  const maxSelection = config?.maxSelection;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const selectOne = useCallback((id: string) => {
    setSelected(new Set([id]));
  }, []);

  const selectMany = useCallback(
    (ids: string[]) => {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const id of ids) next.add(id);
        if (maxSelection && next.size > maxSelection) {
          const arr = Array.from(next);
          return new Set(arr.slice(arr.length - maxSelection));
        }
        return next;
      });
    },
    [maxSelection],
  );

  const toggle = useCallback(
    (id: string, event?: Pick<React.MouseEvent, 'shiftKey' | 'metaKey' | 'ctrlKey'>) => {
      if (mode === 'single') {
        setSelected((prev) => (prev.has(id) ? new Set() : new Set([id])));
        return;
      }

      const isMulti = event?.shiftKey || event?.metaKey || event?.ctrlKey;

      if (!isMulti) {
        // No modifier — select only this item
        setSelected((prev) => (prev.has(id) && prev.size === 1 ? new Set() : new Set([id])));
        return;
      }

      // Modifier held — toggle this item in the set
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (maxSelection && next.size >= maxSelection) return prev;
          next.add(id);
        }
        return next;
      });
    },
    [mode, maxSelection],
  );

  const clear = useCallback(() => setSelected(new Set()), []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  return { selected, toggle, selectOne, selectMany, clear, isSelected, setSelected };
}
