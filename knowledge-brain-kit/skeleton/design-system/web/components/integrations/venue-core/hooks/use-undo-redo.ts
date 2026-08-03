'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { UndoableCommand } from '../types';

// ---------------------------------------------------------------------------
// useUndoRedo — command-pattern undo/redo stack
// ---------------------------------------------------------------------------

interface UseUndoRedoReturn<T> {
  /** Current state */
  state: T;
  /** Push and execute a command */
  execute: (command: UndoableCommand<T>) => void;
  /** Undo the last command */
  undo: () => void;
  /** Redo the last undone command */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Reset to initial state, clearing history */
  reset: (newState?: T) => void;
  /** Number of commands in the undo stack */
  historySize: number;
}

export function useUndoRedo<T>(initialState: T): UseUndoRedoReturn<T> {
  const stateRef = useRef<T>(initialState);
  const undoStack = useRef<UndoableCommand<T>[]>([]);
  const redoStack = useRef<UndoableCommand<T>[]>([]);
  const [renderKey, setRenderKey] = useState(0);

  const tick = () => setRenderKey((n) => n + 1);

  const execute = useCallback((command: UndoableCommand<T>) => {
    stateRef.current = command.execute(stateRef.current);
    undoStack.current.push(command);
    redoStack.current = [];
    tick();
  }, []);

  const undo = useCallback(() => {
    const command = undoStack.current.pop();
    if (!command) return;
    stateRef.current = command.undo(stateRef.current);
    redoStack.current.push(command);
    tick();
  }, []);

  const redo = useCallback(() => {
    const command = redoStack.current.pop();
    if (!command) return;
    stateRef.current = command.execute(stateRef.current);
    undoStack.current.push(command);
    tick();
  }, []);

  const reset = useCallback(
    (newState?: T) => {
      stateRef.current = newState ?? initialState;
      undoStack.current = [];
      redoStack.current = [];
      tick();
    },
    [initialState],
  );

  return useMemo(
    () => ({
      state: stateRef.current,
      execute,
      undo,
      redo,
      canUndo: undoStack.current.length > 0,
      canRedo: redoStack.current.length > 0,
      reset,
      historySize: undoStack.current.length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderKey, execute, undo, redo, reset],
  );
}
