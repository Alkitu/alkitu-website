"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "~/lib/utils"
import { Card, CardContent } from "~/components/primitives/card"
import { Badge } from "~/components/primitives/badge"
import type { BadgeVariant } from "~/components/primitives/badge"

// ---------------------------------------------------------------------------
// Original DS KpiCard types & helpers
// ---------------------------------------------------------------------------

const trendIconVariants = cva("flex items-center", {
    variants: {
        trend: {
            up: "text-success",
            down: "text-destructive",
            stable: "text-muted-foreground",
        },
    },
    defaultVariants: {
        trend: "stable",
    },
})

type KpiTrendDirection = "up" | "down" | "stable"

function TrendIcon({ direction }: { direction: KpiTrendDirection }) {
    const paths: Record<KpiTrendDirection, string> = {
        up: "m18 15-6-6-6 6",
        down: "m6 9 6 6 6-6",
        stable: "M5 12h14",
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={paths[direction]} />
        </svg>
    )
}

const trendBadgeVariant: Record<KpiTrendDirection, "default" | "destructive" | "secondary"> = {
    up: "default",
    down: "destructive",
    stable: "secondary",
}

export interface KpiCardProps {
    /** Label displayed above the value */
    label: string
    /** The metric value to display */
    value: string | number
    /** Trend direction (shows icon and colors the badge) */
    trend?: KpiTrendDirection
    /** Percentage change to display in the badge */
    changePercent?: number
    /** Comparison period text (e.g., "vs previous month") */
    periodComparison?: string
    /** Optional className for the outer Card */
    className?: string
}

function KpiCard({
    label,
    value,
    trend,
    changePercent,
    periodComparison,
    className,
}: KpiCardProps) {
    const hasTrend = trend !== undefined && changePercent !== undefined

    return (
        <Card className={cn("flex flex-col justify-between", className)}>
            <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
                {hasTrend && (
                    <div className="mt-2 flex items-center gap-1.5">
                        <span className={cn(trendIconVariants({ trend }))}>
                            <TrendIcon direction={trend} />
                        </span>
                        <Badge variant={trendBadgeVariant[trend]} className="text-xs">
                            {changePercent}%
                        </Badge>
                        {periodComparison && (
                            <span className="text-xs text-muted-foreground">{periodComparison}</span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
KpiCard.displayName = "KpiCard"

// ---------------------------------------------------------------------------
// Advanced StatCard types & helpers
// ---------------------------------------------------------------------------

/**
 * Trend direction for statistical data
 */
export type TrendDirection = "up" | "down" | "neutral"

/**
 * Variant options for StatCard styling
 */
export type StatCardVariant = "default" | "success" | "warning" | "error" | "neutral"

/**
 * Props for StatCard component
 *
 * A statistical information card for displaying key metrics and statistics
 * with trend indicators, icons, comparison data, loading state, and chart slot.
 */
export interface StatCardProps {
    /** Label/title for the statistic @example "Total Users" */
    label: string
    /** Primary value to display (large number/text) @example 1234 or "$1,234.56" */
    value: number | string
    /** Icon to display (from lucide-react) */
    icon: React.ComponentType<{ className?: string }>
    /** Custom color class for the icon @default 'text-primary' */
    iconColor?: string
    /** Subtitle/description text */
    subtitle?: string
    /** Trend indicator text @example "+12% from last month" */
    trend?: string
    /** Trend direction for visual indicator */
    trendDirection?: TrendDirection
    /** Comparison text for context @example "vs last month" */
    comparison?: string
    /** Loading state - shows skeleton @default false */
    isLoading?: boolean
    /** Visual variant for the card @default 'default' */
    variant?: StatCardVariant
    /** Badge to display with the stat */
    badge?: string
    /** Badge variant when badge prop is provided @default 'default' */
    badgeVariant?: BadgeVariant
    /** Auto-format large numbers (1000 -> 1K, 1000000 -> 1M) @default false */
    formatNumber?: boolean
    /** Number of decimal places for formatted numbers @default 1 */
    decimals?: number
    /** Click handler for making the card interactive */
    onClick?: () => void
    /** Makes the card focusable and shows hover state */
    clickable?: boolean
    /** Mini chart or sparkline element */
    chart?: ReactNode
    /** Additional CSS classes */
    className?: string
    /** Data test ID for testing */
    "data-testid"?: string
}

/**
 * StatCard - Statistical Information Card
 *
 * A card component for displaying key metrics and statistics with trend indicators,
 * icons, and comparison data. Perfect for dashboard views and analytics displays.
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Users"
 *   value={1234}
 *   icon={Users}
 *   trend="+12%"
 *   trendDirection="up"
 *   comparison="vs last month"
 *   formatNumber
 * />
 * ```
 */
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    (
        {
            label,
            value,
            icon: Icon,
            iconColor = "text-primary",
            subtitle,
            trend,
            trendDirection,
            comparison,
            isLoading = false,
            variant = "default",
            badge,
            badgeVariant = "default",
            formatNumber = false,
            decimals = 1,
            onClick,
            clickable = false,
            chart,
            className,
            "data-testid": dataTestId,
            ...props
        },
        ref,
    ) => {
        // Determine if card should be clickable
        const isClickable = clickable || !!onClick

        // Format number if enabled and value is numeric
        const formatValue = (val: number | string): string => {
            if (!formatNumber || typeof val === "string") {
                return String(val)
            }

            const num = Number(val)
            if (isNaN(num)) return String(val)

            const abs = Math.abs(num)
            const sign = num < 0 ? "-" : ""

            if (abs >= 1_000_000_000) {
                return `${sign}${(abs / 1_000_000_000).toFixed(decimals)}B`
            }
            if (abs >= 1_000_000) {
                return `${sign}${(abs / 1_000_000).toFixed(decimals)}M`
            }
            if (abs >= 1_000) {
                return `${sign}${(abs / 1_000).toFixed(decimals)}K`
            }
            return String(num)
        }

        // Get trend icon based on direction
        const getTrendIcon = (direction?: TrendDirection) => {
            switch (direction) {
                case "up":
                    return <ArrowUp className="h-4 w-4" aria-label="Trending up" />
                case "down":
                    return <ArrowDown className="h-4 w-4" aria-label="Trending down" />
                case "neutral":
                    return <Minus className="h-4 w-4" aria-label="Neutral trend" />
                default:
                    return null
            }
        }

        // Get trend color based on direction
        const getTrendColor = (direction?: TrendDirection) => {
            switch (direction) {
                case "up":
                    return "text-success"
                case "down":
                    return "text-error"
                case "neutral":
                    return "text-muted-foreground"
                default:
                    return "text-primary"
            }
        }

        // Variant-based styling
        const variantClasses = {
            default: "",
            success: "border-l-4 border-l-success",
            warning: "border-l-4 border-l-warning",
            error: "border-l-4 border-l-error",
            neutral: "border-l-4 border-l-muted",
        }[variant]

        const displayValue = formatValue(value)

        return (
            <Card
                ref={ref}
                className={cn(
                    "transition-all duration-200",
                    variantClasses,
                    isClickable && [
                        "cursor-pointer",
                        "hover:shadow-md",
                        "hover:scale-[1.02]",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-ring",
                        "focus-visible:ring-offset-2",
                    ],
                    className,
                )}
                onClick={onClick}
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? "button" : undefined}
                onKeyDown={
                    isClickable
                        ? (e: React.KeyboardEvent) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  onClick?.()
                              }
                          }
                        : undefined
                }
                data-testid={dataTestId}
                data-variant={variant}
                data-clickable={isClickable}
                {...props}
            >
                <CardContent className="p-4">
                    {/* Header: Label + Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
                            {badge && (
                                <Badge variant={badgeVariant} size="sm" data-testid="stat-card-badge">
                                    {badge}
                                </Badge>
                            )}
                        </div>
                        <Icon className={cn("h-5 w-5", iconColor)} aria-hidden="true" />
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="space-y-3">
                            <div
                                className="animate-pulse h-9 bg-muted rounded w-24"
                                data-testid="stat-card-skeleton"
                            />
                            {(trend || subtitle) && (
                                <div className="animate-pulse h-4 bg-muted rounded w-32" />
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Value */}
                            <p className="text-3xl font-bold mb-1" data-testid="stat-card-value">
                                {displayValue}
                            </p>

                            {/* Trend + Comparison */}
                            {(trend || trendDirection) && (
                                <div
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-medium",
                                        getTrendColor(trendDirection),
                                    )}
                                    data-testid="stat-card-trend"
                                >
                                    {getTrendIcon(trendDirection)}
                                    {trend && <span>{trend}</span>}
                                </div>
                            )}

                            {/* Comparison */}
                            {comparison && (
                                <p
                                    className="text-xs text-muted-foreground mt-1"
                                    data-testid="stat-card-comparison"
                                >
                                    {comparison}
                                </p>
                            )}

                            {/* Subtitle */}
                            {subtitle && (
                                <p className="text-xs text-muted-foreground mt-2" data-testid="stat-card-subtitle">
                                    {subtitle}
                                </p>
                            )}

                            {/* Chart/Sparkline */}
                            {chart && (
                                <div className="mt-4" data-testid="stat-card-chart">
                                    {chart}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        )
    },
)

StatCard.displayName = "StatCard"

export { KpiCard, StatCard, trendIconVariants }
