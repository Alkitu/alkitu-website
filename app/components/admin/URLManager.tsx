'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { ProjectUrl } from '@/lib/types';

interface URLManagerProps {
  urls: ProjectUrl[];
  onChange: (urls: ProjectUrl[]) => void;
}

export default function URLManager({ urls, onChange }: URLManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState<ProjectUrl>({
    name: '',
    url: '',
    active: true,
    fallback: '',
  });

  const addUrl = () => {
    if (newUrl.name.trim() && newUrl.url.trim()) {
      onChange([...urls, newUrl]);
      setNewUrl({ name: '', url: '', active: true, fallback: '' });
      setIsAdding(false);
    }
  };

  const updateUrl = (index: number, field: keyof ProjectUrl, value: string | boolean) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = { ...updatedUrls[index], [field]: value };
    onChange(updatedUrls);
  };

  const removeUrl = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {urls.map((urlItem, index) => (
        <div key={index} className="border border-border rounded-md p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={urlItem.name}
                  onChange={(e) => updateUrl(index, 'name', e.target.value)}
                  placeholder="Name (e.g., Website, Repository)"
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="url"
                  value={urlItem.url}
                  onChange={(e) => updateUrl(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={urlItem.fallback || ''}
                  onChange={(e) => updateUrl(index, 'fallback', e.target.value)}
                  placeholder="Fallback message (optional)"
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="flex items-center gap-2 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={urlItem.active ?? true}
                    onChange={(e) => updateUrl(index, 'active', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Active</span>
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeUrl(index)}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {isAdding && (
        <div className="border border-border rounded-md p-4 space-y-3 bg-muted/50">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newUrl.name}
              onChange={(e) => setNewUrl({ ...newUrl, name: e.target.value })}
              placeholder="Name (e.g., Website, Repository)"
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="url"
              value={newUrl.url}
              onChange={(e) => setNewUrl({ ...newUrl, url: e.target.value })}
              placeholder="https://example.com"
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newUrl.fallback || ''}
              onChange={(e) => setNewUrl({ ...newUrl, fallback: e.target.value })}
              placeholder="Fallback message (optional)"
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={newUrl.active ?? true}
                onChange={(e) => setNewUrl({ ...newUrl, active: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Active</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addUrl}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save URL
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewUrl({ name: '', url: '', active: true, fallback: '' });
              }}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
          Add URL
        </button>
      )}
    </div>
  );
}
