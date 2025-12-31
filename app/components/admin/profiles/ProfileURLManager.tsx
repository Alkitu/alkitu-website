/**
 * Profile URL Manager Component
 *
 * Manages array of profile URLs with privacy toggles.
 * Allows adding, editing, and removing URLs.
 */

'use client';

import { useState } from 'react';
import { Plus, X, Link, ChevronUp, ChevronDown } from 'lucide-react';
import { PrivacyToggle } from './PrivacyToggle';
import type { ProfileUrl } from '@/lib/types/profiles';

interface ProfileURLManagerProps {
  urls: ProfileUrl[];
  onChange: (urls: ProfileUrl[]) => void;
  maxUrls?: number;
}

export function ProfileURLManager({
  urls,
  onChange,
  maxUrls = 10,
}: ProfileURLManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /**
   * Sort URLs by display_order
   */
  const sortedUrls = [...urls].sort((a, b) => a.display_order - b.display_order);

  /**
   * Add new URL with next display_order
   */
  const handleAdd = () => {
    if (urls.length >= maxUrls) return;

    const maxOrder = urls.length > 0
      ? Math.max(...urls.map(u => u.display_order))
      : -1;

    const newUrl: ProfileUrl = {
      urlName: '',
      url: '',
      display_order: maxOrder + 1,
      is_public: false,
    };

    onChange([...urls, newUrl]);
    setEditingIndex(urls.length); // Edit the new item immediately
  };

  /**
   * Update URL at index
   */
  const handleUpdate = (
    index: number,
    field: keyof ProfileUrl,
    value: string | boolean | number
  ) => {
    const updated = sortedUrls.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  /**
   * Remove URL at index and reorder remaining
   */
  const handleRemove = (index: number) => {
    const remaining = sortedUrls.filter((_, i) => i !== index);
    // Reorder display_order to be consecutive
    const reordered = remaining.map((url, i) => ({
      ...url,
      display_order: i,
    }));
    onChange(reordered);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  /**
   * Move URL up in order
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at top

    const updated = [...sortedUrls];
    // Swap display_order with previous item
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Move URL down in order
   */
  const handleMoveDown = (index: number) => {
    if (index === sortedUrls.length - 1) return; // Already at bottom

    const updated = [...sortedUrls];
    // Swap display_order with next item
    const temp = updated[index + 1].display_order;
    updated[index + 1] = { ...updated[index + 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          URLs
          <span className="ml-2 text-xs text-muted-foreground">
            ({sortedUrls.length} {sortedUrls.length === 1 ? 'URL' : 'URLs'})
          </span>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          disabled={urls.length >= maxUrls}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Agregar URL
        </button>
      </div>

      {urls.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <Link className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay URLs agregadas. Haz clic en &quot;Agregar URL&quot; para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedUrls.map((urlItem, index) => (
            <div
              key={urlItem.display_order}
              className="rounded-md border border-border bg-background p-4 space-y-3"
            >
              {/* URL Name */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nombre del enlace
                </label>
                <input
                  type="text"
                  value={urlItem.urlName}
                  onChange={(e) => handleUpdate(index, 'urlName', e.target.value)}
                  placeholder="ej. LinkedIn, GitHub, Portfolio"
                  maxLength={50}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={urlItem.url}
                  onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                  placeholder="https://ejemplo.com"
                  maxLength={500}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between gap-2">
                {/* Left side: Ordering buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="inline-flex items-center rounded-md p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sortedUrls.length - 1}
                    className="inline-flex items-center rounded-md p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted-foreground ml-2">
                    #{index + 1}
                  </span>
                </div>

                {/* Right side: Privacy toggle and delete */}
                <div className="flex items-center gap-3">
                  <PrivacyToggle
                    isPublic={urlItem.is_public}
                    onChange={(isPublic) => handleUpdate(index, 'is_public', isPublic)}
                    size="sm"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1"
                  >
                    <X className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
