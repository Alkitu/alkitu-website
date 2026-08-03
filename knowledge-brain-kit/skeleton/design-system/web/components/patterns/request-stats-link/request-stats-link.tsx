'use client';

import * as React from 'react';
import { ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '~/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RequestStatsLinkLabels {
  noRequests: string;
  request: string;
  requests: string;
  pending: string;
  pendingPlural: string;
  pendingTitle: string;
  ongoingTitle: string;
  viewRequests: string;
}

export interface RequestStatsLinkProps {
  /** Unique identifier for the linked entity */
  serviceId: string;
  /** Display name (used in aria-label) */
  serviceName: string;
  /** Total number of requests */
  requestCount?: number;
  /** Number of pending requests */
  pendingCount?: number;
  /** Number of ongoing requests */
  ongoingCount?: number;
  /** Fully computed href for the link */
  href: string;
  /** Whether to show detailed stats or compact view */
  detailed?: boolean;
  /** Translated labels (optional, defaults to Spanish) */
  labels?: Partial<RequestStatsLinkLabels>;
  /** Custom className */
  className?: string;
  /**
   * Component to render the link element.
   * Defaults to a plain `'a'` tag. Inject Next.js `Link` from the web wrapper.
   */
  linkComponent?: React.ElementType;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const defaultLabels: RequestStatsLinkLabels = {
  noRequests: 'Sin solicitudes',
  request: 'solicitud',
  requests: 'solicitudes',
  pending: 'pendiente',
  pendingPlural: 'pendientes',
  pendingTitle: 'Pendientes',
  ongoingTitle: 'En progreso',
  viewRequests: 'Ver {count} solicitudes de {name}',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const RequestStatsLink = React.forwardRef<HTMLAnchorElement, RequestStatsLinkProps>(
  (
    {
      serviceName,
      requestCount = 0,
      pendingCount = 0,
      ongoingCount = 0,
      href,
      detailed = false,
      labels: labelsProp,
      className,
      linkComponent: LinkComp = 'a',
      ...props
    },
    ref,
  ) => {
    const l = { ...defaultLabels, ...labelsProp };
    const hasRequests = requestCount > 0;
    const hasPending = pendingCount > 0;
    const hasOngoing = ongoingCount > 0;

    // Zero state
    if (!hasRequests) {
      return (
        <div
          className={cn(
            'text-sm text-muted-foreground flex items-center gap-1.5',
            className,
          )}
          data-testid="service-request-link-zero"
        >
          <span>{l.noRequests}</span>
        </div>
      );
    }

    const ariaLabel = l.viewRequests
      .replace('{count}', String(requestCount))
      .replace('{name}', serviceName);

    const Link = LinkComp as React.FC<Record<string, unknown>>;
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          'group inline-flex items-center gap-2 text-sm transition-colors',
          'hover:text-primary focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1',
          className,
        )}
        data-testid="service-request-link"
        aria-label={ariaLabel}
        {...props}
      >
        {/* Request count */}
        <span className="font-medium text-foreground group-hover:text-primary">
          {requestCount} {requestCount === 1 ? l.request : l.requests}
        </span>

        {/* Status indicators */}
        {detailed ? (
          <div className="flex items-center gap-2 text-xs">
            {hasPending && (
              <span
                className="flex items-center gap-1 text-amber-600 dark:text-amber-400"
                title={l.pendingTitle}
              >
                <AlertCircle className="h-3 w-3" />
                {pendingCount}
              </span>
            )}
            {hasOngoing && (
              <span
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                title={l.ongoingTitle}
              >
                <Clock className="h-3 w-3" />
                {ongoingCount}
              </span>
            )}
          </div>
        ) : (
          hasPending && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              title={l.pendingTitle}
            >
              {pendingCount} {pendingCount !== 1 ? l.pendingPlural : l.pending}
            </span>
          )
        )}

        {/* Arrow icon */}
        <ArrowRight
          className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    );
  },
);

RequestStatsLink.displayName = 'RequestStatsLink';
