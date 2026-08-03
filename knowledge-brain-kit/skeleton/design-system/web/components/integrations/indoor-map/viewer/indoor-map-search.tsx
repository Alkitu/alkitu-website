'use client';

import * as React from 'react';
import type { MapArea } from '../types';
import { Input } from '~/components/primitives/input';
import { Search } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// IndoorMapSearch — search areas by name with results dropdown
// ---------------------------------------------------------------------------

export interface IndoorMapSearchProps {
  areas: MapArea[];
  onSelect: (area: MapArea) => void;
  className?: string;
  placeholder?: string;
}

export function IndoorMapSearch({
  areas,
  onSelect,
  className,
  placeholder = 'Search stands...',
}: IndoorMapSearchProps) {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const linkedAreas = React.useMemo(
    () => areas.filter((a) => a.data !== null),
    [areas],
  );

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return linkedAreas
      .filter((a) => a.data!.name.toLowerCase().includes(lower))
      .slice(0, 10);
  }, [query, linkedAreas]);

  const handleSelect = (area: MapArea) => {
    setQuery(area.data!.name);
    setIsOpen(false);
    onSelect(area);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-30 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
          {results.map((area) => (
            <button
              key={area.id}
              onClick={() => handleSelect(area)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="font-medium">{area.data!.name}</span>
              {area.data!.location && (
                <span className="text-muted-foreground text-xs ml-2">{area.data!.location}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-30 mt-1 w-full bg-popover border border-border rounded-md shadow-lg px-3 py-2 text-sm text-muted-foreground">
          No results found
        </div>
      )}
    </div>
  );
}
