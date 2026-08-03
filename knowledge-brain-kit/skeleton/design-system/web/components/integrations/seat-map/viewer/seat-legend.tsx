'use client';

import type { PricingZone, SeatStatus } from '../types';
import { getStateTokens } from '../../venue-core/utils/state-colors';
import { getZoneColor } from '../utils/seat-state-manager';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// SeatLegend — color legend for seat states and pricing zones
// ---------------------------------------------------------------------------

export interface SeatLegendProps {
  zones?: PricingZone[];
  /** Which statuses to show in the legend */
  statuses?: SeatStatus[];
  /** Format the price display (default: (price) => `$${price}`) */
  formatPrice?: (price: number) => string;
  className?: string;
}

const STATUS_LABELS: Record<SeatStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  selected: 'Selected',
  disabled: 'Unavailable',
  reserved: 'Reserved',
};

export function SeatLegend({
  zones = [],
  statuses = ['available', 'selected', 'occupied', 'reserved'],
  formatPrice = (p) => `$${p}`,
  className,
}: SeatLegendProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-4 px-3 py-2 text-sm', className)}>
      {/* Status legend */}
      {statuses.map((status) => {
        const tokens = getStateTokens(status);
        return (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3.5 w-3.5 rounded-sm border border-border"
              style={{ backgroundColor: tokens.bg }}
            />
            <span className="text-muted-foreground">{STATUS_LABELS[status]}</span>
          </div>
        );
      })}

      {/* Zone legend */}
      {zones.length > 0 && (
        <>
          <span className="text-border">|</span>
          {zones.map((zone) => {
            const color = getZoneColor(zone.id, zones);
            return (
              <div key={zone.id} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3.5 w-3.5 rounded-sm border border-border"
                  style={{ backgroundColor: color }}
                />
                <span className="text-muted-foreground">
                  {zone.name} ({formatPrice(zone.price)})
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
