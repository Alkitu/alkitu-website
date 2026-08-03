'use client';

import * as React from 'react';
import { Badge } from '~/components/primitives/badge';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * Mirrors the UserStatus enum from @brain/shared so the design system
 * stays free of application-level dependencies.
 */
export type StatusBadgeStatus = 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'ANONYMIZED';

export interface StatusBadgeProps {
  /** User status value */
  status: StatusBadgeStatus;
  /** Whether the user is currently online */
  isActive?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Status configuration                                               */
/* ------------------------------------------------------------------ */

const statusConfig: Record<
  StatusBadgeStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  VERIFIED: { label: 'Verified', variant: 'default' },
  PENDING: { label: 'Pending', variant: 'secondary' },
  SUSPENDED: { label: 'Suspended', variant: 'destructive' },
  ANONYMIZED: { label: 'Anonymized', variant: 'outline' },
};

/* ------------------------------------------------------------------ */
/*  StatusBadge Component                                              */
/* ------------------------------------------------------------------ */

function StatusBadge({ status, isActive }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  const label = isActive ? `${config.label} (Online)` : config.label;

  return (
    <Badge data-slot="status-badge" variant={config.variant}>
      {label}
    </Badge>
  );
}

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
