'use client';

import * as React from 'react';
import type { ToolMode } from '../types';
import { Button } from '~/components/primitives/button';
import { Toggle } from '~/components/primitives/toggle';
import { Switch } from '~/components/primitives/switch';
import { Label } from '~/components/primitives/label';
import { Separator } from '~/components/primitives/separator';
import {
  MousePointer2,
  Hand,
  Undo2,
  Redo2,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Trash2,
  Copy,
  Grid3X3,
} from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// EditorToolbar — top toolbar for the event layout editor
// ---------------------------------------------------------------------------

export interface EditorToolbarProps {
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAlignH: () => void;
  onAlignV: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  snapToGrid: boolean;
  onSnapToGridChange: (enabled: boolean) => void;
  hasSelection: boolean;
  className?: string;
}

export function EditorToolbar({
  toolMode,
  onToolModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAlignH,
  onAlignV,
  onDuplicate,
  onDelete,
  snapToGrid,
  onSnapToGridChange,
  hasSelection,
  className,
}: EditorToolbarProps) {
  return (
    <div className={cn('flex items-center gap-1 px-2 py-1.5 border-b border-border bg-card', className)}>
      {/* Tool mode */}
      <Toggle
        pressed={toolMode === 'select'}
        onPressedChange={() => onToolModeChange('select')}
        size="sm"
        aria-label="Select tool"
      >
        <MousePointer2 size={14} />
      </Toggle>
      <Toggle
        pressed={toolMode === 'pan'}
        onPressedChange={() => onToolModeChange('pan')}
        size="sm"
        aria-label="Pan tool"
      >
        <Hand size={14} />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Undo/Redo */}
      <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
        <Undo2 size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} aria-label="Redo">
        <Redo2 size={14} />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <Button variant="ghost" size="sm" onClick={onAlignH} disabled={!hasSelection} aria-label="Align horizontal">
        <AlignCenterHorizontal size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={onAlignV} disabled={!hasSelection} aria-label="Align vertical">
        <AlignCenterVertical size={14} />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Element actions */}
      <Button variant="ghost" size="sm" onClick={onDuplicate} disabled={!hasSelection} aria-label="Duplicate">
        <Copy size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} disabled={!hasSelection} aria-label="Delete">
        <Trash2 size={14} />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grid snap */}
      <div className="flex items-center gap-1.5">
        <Grid3X3 size={14} className="text-muted-foreground" />
        <Switch checked={snapToGrid} onCheckedChange={onSnapToGridChange} />
        <Label className="text-xs text-muted-foreground">Snap</Label>
      </div>
    </div>
  );
}
