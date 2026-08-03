'use client';

import * as React from 'react';
import type { AreaCategory } from '../types';
import { Checkbox } from '~/components/primitives/checkbox';
import { Label } from '~/components/primitives/label';
import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// IndoorMapFilters — category filter sidebar/panel
// ---------------------------------------------------------------------------

export interface IndoorMapFiltersProps {
  categories: AreaCategory[];
  activeFilters: Set<string>;
  onFilterChange: (activeIds: Set<string>) => void;
  className?: string;
}

export function IndoorMapFilters({
  categories,
  activeFilters,
  onFilterChange,
  className,
}: IndoorMapFiltersProps) {
  const toggleCategory = (categoryId: string) => {
    const next = new Set(activeFilters);
    if (next.has(categoryId)) {
      next.delete(categoryId);
    } else {
      next.add(categoryId);
    }
    onFilterChange(next);
  };

  const selectAll = () => {
    onFilterChange(new Set(categories.map((c) => c.id)));
  };

  const clearAll = () => {
    onFilterChange(new Set());
  };

  const allSelected = categories.length > 0 && activeFilters.size === categories.length;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Categories</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? clearAll : selectAll}
          className="text-xs h-auto py-1"
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2">
            <Checkbox
              id={`filter-${category.id}`}
              checked={activeFilters.has(category.id)}
              onCheckedChange={() => toggleCategory(category.id)}
            />
            <Label htmlFor={`filter-${category.id}`} className="flex items-center gap-1.5 text-sm cursor-pointer">
              {category.color && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              {category.icon && <span className="text-xs">{category.icon}</span>}
              {category.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
