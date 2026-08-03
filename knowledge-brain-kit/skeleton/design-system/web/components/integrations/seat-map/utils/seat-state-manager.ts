import type { Seat, SeatSection, SeatStatus, PricingZone, ZoneAssignment } from '../types';

// ---------------------------------------------------------------------------
// Seat State Manager — manages seat statuses and zone assignments
// ---------------------------------------------------------------------------

/** Apply occupied statuses from a list of seat IDs */
export function applyOccupiedSeats(sections: SeatSection[], occupiedIds: Set<string>): SeatSection[] {
  return sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      seats: row.seats.map((seat) => ({
        ...seat,
        status: occupiedIds.has(seat.id)
          ? ('occupied' as SeatStatus)
          : seat.status === 'occupied'
            ? 'available'
            : seat.status,
      })),
    })),
  }));
}

/** Toggle seat selection — only available seats can be selected */
export function toggleSeatSelection(
  sections: SeatSection[],
  seatId: string,
  selected: Set<string>,
): Set<string> {
  const seat = findSeat(sections, seatId);
  if (!seat || seat.status === 'occupied' || seat.status === 'disabled') return selected;

  const next = new Set(selected);
  if (next.has(seatId)) {
    next.delete(seatId);
  } else {
    next.add(seatId);
  }
  return next;
}

/** Apply selection set as status updates on sections */
export function applySeatSelection(sections: SeatSection[], selected: Set<string>): SeatSection[] {
  return sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      seats: row.seats.map((seat) => {
        if (seat.status === 'occupied' || seat.status === 'disabled') return seat;
        return {
          ...seat,
          status: selected.has(seat.id) ? ('selected' as SeatStatus) : ('available' as SeatStatus),
        };
      }),
    })),
  }));
}

/** Apply zone assignments to seats (sets the zoneId field) */
export function applyZoneAssignments(
  sections: SeatSection[],
  zoneAssignments: Record<string, ZoneAssignment[]>,
): SeatSection[] {
  return sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      seats: row.seats.map((seat) => {
        const zoneId = findZoneForSeat(section.id, row.index, zoneAssignments);
        return zoneId ? { ...seat, zoneId } : seat;
      }),
    })),
  }));
}

/** Find which zone a seat belongs to based on section and row */
function findZoneForSeat(
  sectionId: string,
  rowIndex: number,
  zoneAssignments: Record<string, ZoneAssignment[]>,
): string | undefined {
  for (const [zoneId, assignments] of Object.entries(zoneAssignments)) {
    for (const assignment of assignments) {
      if (assignment.sectionId !== sectionId) continue;
      if (assignment.startRow === undefined && assignment.endRow === undefined) return zoneId;
      const start = assignment.startRow ?? 0;
      const end = assignment.endRow ?? Infinity;
      if (rowIndex >= start && rowIndex <= end) return zoneId;
    }
  }
  return undefined;
}

/** Find a seat by ID across all sections */
export function findSeat(sections: SeatSection[], seatId: string): Seat | undefined {
  for (const section of sections) {
    for (const row of section.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) return seat;
    }
  }
  return undefined;
}

/** Get zone color for a seat — uses zone color or falls back to index-based hue */
export function getZoneColor(zoneId: string | undefined, zones: PricingZone[]): string | undefined {
  if (!zoneId) return undefined;
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return undefined;
  if (zone.color) return zone.color;
  // Generate a color from zone index
  const idx = zones.indexOf(zone);
  const hue = (idx * 137.5) % 360; // golden angle for good distribution
  return `oklch(0.65 0.2 ${hue})`;
}

/** Count seats by status */
export function countByStatus(sections: SeatSection[]): Record<SeatStatus, number> {
  const counts: Record<string, number> = {
    available: 0,
    occupied: 0,
    selected: 0,
    disabled: 0,
    reserved: 0,
  };

  for (const section of sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        counts[seat.status] = (counts[seat.status] || 0) + 1;
      }
    }
  }

  return counts as Record<SeatStatus, number>;
}

/** Get total seat count across all sections */
export function totalSeatCount(sections: SeatSection[]): number {
  let count = 0;
  for (const section of sections) {
    for (const row of section.rows) {
      count += row.seats.length;
    }
  }
  return count;
}
