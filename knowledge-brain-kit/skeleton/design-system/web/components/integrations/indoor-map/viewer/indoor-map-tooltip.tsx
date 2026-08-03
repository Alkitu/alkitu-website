'use client';

import type { MapArea, AreaCategory } from '../types';
import { Badge } from '~/components/primitives/badge';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// IndoorMapTooltip — rich tooltip showing area details
// ---------------------------------------------------------------------------

export interface IndoorMapTooltipProps {
  area: MapArea | null;
  categories: AreaCategory[];
  /** Position relative to the map container */
  position?: { x: number; y: number };
  className?: string;
}

export function IndoorMapTooltip({ area, categories, position, className }: IndoorMapTooltipProps) {
  if (!area || !area.data) return null;

  const { data } = area;
  const category = categories.find((c) => c.id === data.categoryId);

  return (
    <div
      className={cn(
        'absolute z-20 pointer-events-none bg-popover text-popover-foreground',
        'border border-border rounded-lg shadow-lg p-3 w-64',
        'animate-in fade-in-0 slide-in-from-bottom-2 duration-200',
        className,
      )}
      style={
        position
          ? { left: position.x, top: position.y, transform: 'translate(-50%, -110%)' }
          : { left: '50%', bottom: 12, transform: 'translateX(-50%)' }
      }
    >
      <div className="flex items-start gap-3">
        {/* Logo */}
        {data.logoUrl && (
          <img
            src={data.logoUrl}
            alt=""
            className="h-10 w-10 rounded-md object-cover shrink-0 border border-border"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Name */}
          <p className="font-semibold text-sm leading-tight truncate">{data.name}</p>

          {/* Category badge */}
          {category && (
            <Badge
              variant="outline"
              className="mt-1 text-xs"
              style={category.color ? { borderColor: category.color, color: category.color } : undefined}
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </Badge>
          )}

          {/* Schedule */}
          {data.schedule && (
            <p className="text-xs text-muted-foreground mt-1.5">{data.schedule}</p>
          )}

          {/* Location */}
          {data.location && (
            <p className="text-xs text-muted-foreground">{data.location}</p>
          )}

          {/* Description */}
          {data.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{data.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
