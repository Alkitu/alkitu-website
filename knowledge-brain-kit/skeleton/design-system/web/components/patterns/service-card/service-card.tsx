'use client';

import React from 'react';
import type { HTMLAttributes } from 'react';
import { Edit, Trash2, Eye, Star } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Card, CardHeader, CardContent, CardFooter } from '~/components/primitives/card';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import { Chip } from '~/components/primitives/chip';

// ---------------------------------------------------------------------------
// Generic data interface – only the fields the component actually reads
// ---------------------------------------------------------------------------

/**
 * Minimal service shape consumed by ServiceCard.
 * Application code can pass a superset (e.g. a Prisma model) as long as it
 * satisfies this contract.
 */
export interface ServiceCardItem {
  /** Unique service identifier */
  id: string;

  /** Service name/title */
  name: string;

  /** Service description */
  description?: string;

  /** Service category ID */
  categoryId: string;

  /** Service category details */
  category: {
    id: string;
    name: string;
  };

  /** Service thumbnail/image URL */
  thumbnail?: string | null;

  /** Service icon color (hex) */
  iconColor?: string | null;

  /** Service price */
  price?: number | null;

  /** Service status */
  status?: 'active' | 'inactive' | 'pending';

  /** Service rating (0-5) */
  rating?: number;

  /** Number of reviews */
  reviewCount?: number;

  /** Request template with form fields */
  requestTemplate?: {
    fields?: Array<{ name: string; type: string }>;
  } | null;

  /** Creation timestamp */
  createdAt: string;

  /** Update timestamp */
  updatedAt: string;
}

/**
 * Visual variants for ServiceCard
 */
export type ServiceCardVariant = 'default' | 'compact' | 'detailed';

/**
 * Props for ServiceCard component
 */
export interface ServiceCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Service data to display */
  service: ServiceCardItem;

  /** Visual variant of the card @default 'default' */
  variant?: ServiceCardVariant;

  /** Show edit button @default false */
  showEdit?: boolean;

  /** Show delete button @default false */
  showDelete?: boolean;

  /** Show view details button @default false */
  showViewDetails?: boolean;

  /** Show service image/thumbnail @default true */
  showImage?: boolean;

  /** Show service description @default true */
  showDescription?: boolean;

  /** Show service price @default true */
  showPrice?: boolean;

  /** Show service category @default true */
  showCategory?: boolean;

  /** Show service status @default true */
  showStatus?: boolean;

  /** Show service rating @default true */
  showRating?: boolean;

  /** Show creation date @default false */
  showCreatedAt?: boolean;

  /** Show field count from request template @default false */
  showFieldCount?: boolean;

  /** Truncate description to N characters @default 100 */
  descriptionLimit?: number;

  /** Loading state for delete operation @default false */
  isDeleting?: boolean;

  /** Loading skeleton state @default false */
  isLoading?: boolean;

  /** Callback when edit button is clicked */
  onEdit?: (service: ServiceCardItem) => void;

  /** Callback when delete button is clicked */
  onDelete?: (service: ServiceCardItem) => void;

  /** Callback when view details button is clicked */
  onViewDetails?: (service: ServiceCardItem) => void;

  /** Callback when card is clicked (not on buttons) */
  onClick?: (service: ServiceCardItem) => void;

  /** Currency symbol for price display @default '$' */
  currencySymbol?: string;

  /** Custom className for the card */
  className?: string;

  /** Render function for the icon/thumbnail fallback area */
  renderIcon?: (service: ServiceCardItem, size: 'sm' | 'md') => React.ReactNode;

  /** Utility to compute a background color from a hex color string */
  getIconBackgroundColor?: (color: string) => string;
}

/**
 * ServiceCard - Atomic Design Molecule
 *
 * Displays service information in a card format with optional actions.
 * Features:
 * - Service image with fallback to renderIcon prop
 * - Service name, description, category, price
 * - Status indicator (active, inactive, pending)
 * - Rating display with stars
 * - Action buttons (Edit, Delete, View Details)
 * - Clickable card for navigation
 * - Multiple display variants (default, compact, detailed)
 * - Loading skeleton state
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <ServiceCard
 *   service={service}
 *   showEdit
 *   showDelete
 *   onEdit={(svc) => handleEdit(svc)}
 *   onDelete={(svc) => handleDelete(svc)}
 *   onClick={(svc) => navigate(`/services/${svc.id}`)}
 * />
 * ```
 */
export const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      service,
      variant = 'default',
      showEdit = false,
      showDelete = false,
      showViewDetails = false,
      showImage = true,
      showDescription = true,
      showPrice = true,
      showCategory = true,
      showStatus = true,
      showRating = true,
      showCreatedAt = false,
      showFieldCount = false,
      descriptionLimit = 100,
      isDeleting = false,
      isLoading = false,
      onEdit,
      onDelete,
      onViewDetails,
      onClick,
      currencySymbol = '$',
      className,
      renderIcon,
      getIconBackgroundColor,
      ...props
    },
    ref,
  ) => {
    // Loading skeleton
    if (isLoading) {
      return (
        <Card
          ref={ref}
          className={cn('shadow-md animate-pulse', className)}
          data-testid="service-card-skeleton"
          {...props}
        >
          <CardContent>
            <div className="flex gap-3">
              {showImage && <div className="h-16 w-16 rounded-[var(--radius-card)] bg-muted" />}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                {showDescription && <div className="h-3 w-full rounded bg-muted" />}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Truncate description
    const truncatedDescription =
      service.description && service.description.length > descriptionLimit
        ? `${service.description.substring(0, descriptionLimit)}...`
        : service.description;

    // Format price
    const formattedPrice =
      service.price !== undefined && service.price !== null
        ? `${currencySymbol}${service.price.toFixed(2)}`
        : null;

    // Field count
    const fieldCount = service.requestTemplate?.fields?.length ?? 0;

    // Status badge variant mapping
    const statusVariantMap = {
      active: 'success' as const,
      inactive: 'secondary' as const,
      pending: 'warning' as const,
    };

    // Compute icon bg color
    const iconBg = getIconBackgroundColor
      ? getIconBackgroundColor(service.iconColor || '#000000')
      : undefined;

    // Render star rating
    const renderRating = () => {
      if (!showRating || service.rating === undefined) return null;

      return (
        <div className="flex items-center gap-1" data-testid="service-rating">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
          {service.reviewCount !== undefined && (
            <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
          )}
        </div>
      );
    };

    // Handle card click (only if not clicking on buttons)
    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent card click if clicking on buttons
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        return;
      }
      onClick?.(service);
    };

    // Render the icon / thumbnail fallback for a given size
    const renderFallbackIcon = (size: 'sm' | 'md') => {
      if (renderIcon) {
        return renderIcon(service, size);
      }
      // Generic placeholder when no renderIcon is provided
      const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
      return (
        <div className={cn('rounded bg-muted flex items-center justify-center', sizeClass)}>
          <span className="text-muted-foreground text-xs">?</span>
        </div>
      );
    };

    // Compact variant
    if (variant === 'compact') {
      return (
        <Card
          ref={ref}
          className={cn(
            'shadow-md p-3 transition-all duration-200',
            onClick && 'cursor-pointer hover:shadow-lg',
            className,
          )}
          onClick={handleCardClick}
          data-testid="service-card"
          {...props}
        >
          <div className="flex items-center gap-3">
            {/* Image/Icon */}
            {showImage && (
              <div className="flex-shrink-0">
                {service.thumbnail ? (
                  <div className="h-12 w-12 overflow-hidden rounded-[var(--radius-card)] border border-border">
                    <img
                      src={service.thumbnail}
                      alt={service.name}
                      className="h-full w-full object-cover"
                      data-testid="service-image"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector(
                          '[data-fallback]',
                        ) as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div
                      data-fallback
                      className="hidden h-full w-full items-center justify-center bg-muted"
                    >
                      {renderFallbackIcon('sm')}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-muted">
                    {renderFallbackIcon('sm')}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-foreground">{service.name}</h3>
                  {showCategory && (
                    <p className="truncate text-sm text-muted-foreground">{service.category.name}</p>
                  )}
                </div>
                {showPrice && formattedPrice && (
                  <span className="flex-shrink-0 text-sm font-semibold text-primary">
                    {formattedPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            {(showEdit || showDelete || showViewDetails) && (
              <div className="flex flex-shrink-0 gap-1">
                {showViewDetails && onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(service)}
                    disabled={isDeleting}
                    iconOnly
                    aria-label="View service details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {showEdit && onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(service)}
                    disabled={isDeleting}
                    iconOnly
                    aria-label="Edit service"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {showDelete && onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(service)}
                    disabled={isDeleting}
                    loading={isDeleting}
                    iconOnly
                    aria-label="Delete service"
                  >
                    {!isDeleting && <Trash2 className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      );
    }

    // Default and Detailed variants
    return (
      <Card
        ref={ref}
        className={cn(
          'shadow-md p-4 flex flex-col transition-all duration-200',
          onClick && 'cursor-pointer hover:shadow-lg',
          className,
        )}
        onClick={handleCardClick}
        data-testid="service-card"
        {...props}
      >
        {/* Header with Image/Icon and Title */}
        <CardHeader className="pb-3">
          <div className="flex gap-4">
            {/* Image/Icon */}
            {showImage && (
              <div className="flex-shrink-0">
                {service.thumbnail ? (
                  <div className="h-16 w-16 overflow-hidden rounded-[var(--radius-card)] border border-border">
                    <img
                      src={service.thumbnail}
                      alt={service.name}
                      className="h-full w-full object-cover"
                      data-testid="service-image"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector(
                          '[data-fallback]',
                        ) as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div
                      data-fallback
                      className="hidden h-full w-full items-center justify-center transition-colors"
                      style={iconBg ? { backgroundColor: iconBg } : undefined}
                    >
                      {renderFallbackIcon('md')}
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-card)] transition-colors"
                    style={iconBg ? { backgroundColor: iconBg } : undefined}
                  >
                    {renderFallbackIcon('md')}
                  </div>
                )}
              </div>
            )}

            {/* Title and Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                  {service.name}
                </h3>
                {showStatus && service.status && (
                  <Badge
                    variant={statusVariantMap[service.status]}
                    size="sm"
                    data-testid="service-status"
                  >
                    {service.status}
                  </Badge>
                )}
              </div>

              {/* Category and Price */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {showCategory && (
                  <Chip {...({ variant: "secondary", size: "sm", "data-testid": "service-category" } as any)}>
                    {service.category.name}
                  </Chip>
                )}
                {showPrice && formattedPrice && (
                  <span className="text-lg font-bold text-primary" data-testid="service-price">
                    {formattedPrice}
                  </span>
                )}
              </div>

              {/* Rating */}
              {renderRating()}
            </div>
          </div>
        </CardHeader>

        {/* Content with Description */}
        <CardContent className="flex-1 pb-3">
          {showDescription && truncatedDescription && (
            <p className="text-sm text-muted-foreground" data-testid="service-description">
              {truncatedDescription}
            </p>
          )}

          {/* Additional metadata for detailed variant */}
          {variant === 'detailed' && (
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              {showFieldCount && (
                <div data-testid="service-field-count">
                  {fieldCount} {fieldCount === 1 ? 'field' : 'fields'} in form template
                </div>
              )}
              {showCreatedAt && (
                <div data-testid="service-created-at">
                  Created {new Date(service.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer with Actions */}
        {(showEdit || showDelete || showViewDetails) && (
          <CardFooter className="justify-end gap-2 pt-3">
            {showViewDetails && onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(service)}
                disabled={isDeleting}
                iconLeft={<Eye className="h-4 w-4" />}
                aria-label="View service details"
              >
                View Details
              </Button>
            )}
            {showEdit && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(service)}
                disabled={isDeleting}
                iconLeft={<Edit className="h-4 w-4" />}
                aria-label="Edit service"
              >
                Edit
              </Button>
            )}
            {showDelete && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(service)}
                disabled={isDeleting}
                loading={isDeleting}
                iconLeft={!isDeleting ? <Trash2 className="h-4 w-4" /> : undefined}
                aria-label="Delete service"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );
  },
);

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
