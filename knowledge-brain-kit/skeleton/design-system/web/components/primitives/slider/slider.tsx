'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '~/lib/utils';

/**
 * Size variants for Slider component
 */
export type SliderSize = 'sm' | 'md' | 'lg';

/**
 * Color variants for Slider component
 */
export type SliderVariant = 'default' | 'primary' | 'secondary';

/**
 * Orientation for Slider component
 */
export type SliderOrientation = 'horizontal' | 'vertical';

/**
 * Label position for value display
 */
export type SliderLabelPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Slider component
 */
export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /**
   * Current value (controlled mode).
   * Accepts a single number or a number[] (first element used) for
   * backward compatibility with Radix UI Slider API.
   */
  value?: number | number[];

  /**
   * Default value (uncontrolled mode).
   * Accepts a single number or a number[] (first element used) for
   * backward compatibility with Radix UI Slider API.
   * @default 50
   */
  defaultValue?: number | number[];

  /**
   * Minimum value
   * @default 0
   */
  min?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Step increment
   * @default 1
   */
  step?: number;

  /**
   * Size variant
   * @default 'md'
   */
  size?: SliderSize;

  /**
   * Color variant
   * @default 'default'
   */
  variant?: SliderVariant;

  /**
   * Whether to show value label
   * @default false
   */
  showValue?: boolean;

  /**
   * Label position
   * @default 'top'
   */
  labelPosition?: SliderLabelPosition;

  /**
   * Whether to show tick marks
   * @default false
   */
  showTicks?: boolean;

  /**
   * Tick mark positions (custom tick values)
   */
  ticks?: number[];

  /**
   * Whether slider is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: SliderOrientation;

  /**
   * Change handler - called during dragging
   */
  onChange?: (value: number) => void;

  /**
   * Change handler (Radix-compatible) - called during dragging.
   * Receives value as number[]. If both onChange and onValueChange are
   * provided, both will be called.
   */
  onValueChange?: (value: number[]) => void;

  /**
   * Commit handler - called on mouse up
   */
  onValueCommit?: (value: number) => void;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Slider - Design System Component
 *
 * Interactive slider for selecting numeric values from a range.
 * Supports horizontal/vertical orientations, keyboard navigation,
 * and full accessibility features.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Slider min={0} max={100} defaultValue={50} />
 *
 * // With value label
 * <Slider showValue labelPosition="top" />
 *
 * // Controlled mode
 * <Slider value={value} onChange={setValue} />
 *
 * // Vertical orientation
 * <Slider orientation="vertical" />
 * ```
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValueProp,
      defaultValue: defaultValueProp = 50,
      min = 0,
      max = 100,
      step = 1,
      size = 'md',
      variant = 'default',
      showValue = false,
      labelPosition = 'top',
      showTicks = false,
      ticks,
      disabled = false,
      orientation = 'horizontal',
      onChange,
      onValueChange,
      onValueCommit,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    // Normalize array values to single numbers for backward compatibility
    // with Radix UI Slider API which uses number[]
    const controlledValue = Array.isArray(controlledValueProp)
      ? controlledValueProp[0]
      : controlledValueProp;
    const defaultValue = Array.isArray(defaultValueProp)
      ? defaultValueProp[0]
      : (defaultValueProp as number);

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    // Use controlled or uncontrolled value
    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

    // Clamp value to bounds
    const clampedValue = Math.min(Math.max(currentValue, min), max);

    // Calculate percentage
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    // Get size styles
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            trackHeight: '4px',
            thumbSize: '14px',
            trackWidth: '200px',
            fontSize: '12px',
          };
        case 'lg':
          return {
            trackHeight: '8px',
            thumbSize: '22px',
            trackWidth: '300px',
            fontSize: '16px',
          };
        default: // md
          return {
            trackHeight: '6px',
            thumbSize: '18px',
            trackWidth: '250px',
            fontSize: '14px',
          };
      }
    };

    // Get variant colors using Tailwind CSS variables
    const getVariantColors = () => {
      switch (variant) {
        case 'primary':
          return {
            track: 'hsl(var(--primary))',
            thumb: 'hsl(var(--primary))',
            thumbBorder: 'hsl(var(--primary-foreground))',
          };
        case 'secondary':
          return {
            track: 'hsl(var(--secondary))',
            thumb: 'hsl(var(--secondary))',
            thumbBorder: 'hsl(var(--secondary-foreground))',
          };
        default:
          return {
            track: 'hsl(var(--accent))',
            thumb: 'hsl(var(--accent))',
            thumbBorder: 'hsl(var(--accent-foreground))',
          };
      }
    };

    const sizeStyles = getSizeStyles();
    const variantColors = getVariantColors();

    // Handle value update
    const updateValue = (newValue: number) => {
      const steppedValue = Math.round((newValue - min) / step) * step + min;
      const clampedSteppedValue = Math.min(Math.max(steppedValue, min), max);

      if (controlledValue === undefined) {
        setInternalValue(clampedSteppedValue);
      }

      onChange?.(clampedSteppedValue);
      onValueChange?.([clampedSteppedValue]);
    };

    // Handle mouse/touch events
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      let percentage: number;

      if (orientation === 'vertical') {
        percentage = ((rect.bottom - event.clientY) / rect.height) * 100;
      } else {
        percentage = ((event.clientX - rect.left) / rect.width) * 100;
      }

      percentage = Math.min(Math.max(percentage, 0), 100);
      const newValue = min + (percentage / 100) * (max - min);

      updateValue(newValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      onValueCommit?.(clampedValue);
    };

    const handlePointerDown = (event: React.PointerEvent) => {
      if (disabled) return;

      event.preventDefault();
      setIsDragging(true);

      // Handle initial click position
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        let percentage: number;

        if (orientation === 'vertical') {
          percentage = ((rect.bottom - event.clientY) / rect.height) * 100;
        } else {
          percentage = ((event.clientX - rect.left) / rect.width) * 100;
        }

        percentage = Math.min(Math.max(percentage, 0), 100);
        const newValue = min + (percentage / 100) * (max - min);

        updateValue(newValue);
      }
    };

    // Add global event listeners for dragging
    useEffect(() => {
      if (!isDragging) return;

      const handleGlobalPointerMove = (event: PointerEvent) => {
        handlePointerMove(event);
      };

      const handleGlobalPointerUp = () => {
        handlePointerUp();
      };

      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);
      document.addEventListener('pointercancel', handleGlobalPointerUp);

      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove);
        document.removeEventListener('pointerup', handleGlobalPointerUp);
        document.removeEventListener('pointercancel', handleGlobalPointerUp);
      };
    }, [isDragging]);

    // Handle keyboard events
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = clampedValue;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(clampedValue + step, max);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(clampedValue - step, min);
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        case 'PageUp':
          newValue = Math.min(clampedValue + step * 10, max);
          break;
        case 'PageDown':
          newValue = Math.max(clampedValue - step * 10, min);
          break;
        default:
          return;
      }

      event.preventDefault();
      updateValue(newValue);
      onValueCommit?.(newValue);
    };

    // Generate tick marks
    const generateTicks = () => {
      if (!showTicks) return [];

      const tickPositions = ticks || [];
      if (tickPositions.length === 0) {
        // Generate default ticks
        const tickCount = Math.min(Math.floor((max - min) / step) + 1, 11);
        for (let i = 0; i < tickCount; i++) {
          tickPositions.push(min + (i * (max - min)) / (tickCount - 1));
        }
      }

      return tickPositions.map((tickValue) => {
        const tickPercentage = ((tickValue - min) / (max - min)) * 100;
        return { value: tickValue, percentage: tickPercentage };
      });
    };

    const generatedTicks = generateTicks();

    // Container styles
    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      gap: '8px',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'default',
    };

    // Track styles
    const trackStyles: React.CSSProperties = {
      position: 'relative',
      backgroundColor: 'hsl(var(--muted))',
      borderRadius: 'var(--radius)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...(orientation === 'horizontal'
        ? {
            width: sizeStyles.trackWidth,
            height: sizeStyles.trackHeight,
          }
        : {
            width: sizeStyles.trackHeight,
            height: sizeStyles.trackWidth,
          }),
    };

    // Fill track styles
    const fillStyles: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: variantColors.track,
      borderRadius: 'inherit',
      ...(orientation === 'horizontal'
        ? {
            left: 0,
            top: 0,
            width: `${percentage}%`,
            height: '100%',
          }
        : {
            left: 0,
            bottom: 0,
            width: '100%',
            height: `${percentage}%`,
          }),
    };

    // Thumb styles
    const thumbStyles: React.CSSProperties = {
      position: 'absolute',
      width: sizeStyles.thumbSize,
      height: sizeStyles.thumbSize,
      backgroundColor: variantColors.thumb,
      border: `2px solid ${variantColors.thumbBorder}`,
      borderRadius: '50%',
      cursor: disabled ? 'not-allowed' : 'grab',
      transform: 'translate(-50%, -50%)',
      transition: isDragging ? 'none' : 'all 0.2s ease',
      boxShadow: isDragging ? '0 0 0 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.2)',
      ...(orientation === 'horizontal'
        ? {
            left: `${percentage}%`,
            top: '50%',
          }
        : {
            left: '50%',
            bottom: `${percentage}%`,
          }),
    };

    // Value label component
    const ValueLabel = () => {
      if (!showValue) return null;

      const labelStyles: React.CSSProperties = {
        fontSize: sizeStyles.fontSize,
        fontWeight: '500',
        color: 'hsl(var(--foreground))',
        minWidth: '40px',
        textAlign: 'center',
      };

      return <span style={labelStyles}>{clampedValue}</span>;
    };

    return (
      <div
        data-slot="slider"
        ref={ref}
        className={cn('slider-atom', className)}
        style={containerStyles}
        {...props}
      >
        {/* Value label - positioned based on labelPosition */}
        {(labelPosition === 'top' || labelPosition === 'left') && <ValueLabel />}

        {/* Slider track container */}
        <div style={{ position: 'relative' }}>
          {/* Track */}
          <div
            ref={trackRef}
            style={trackStyles}
            onPointerDown={handlePointerDown}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clampedValue}
            aria-orientation={orientation}
            aria-disabled={disabled}
            onKeyDown={handleKeyDown}
          >
            {/* Fill track */}
            <div style={fillStyles} />

            {/* Tick marks */}
            {generatedTicks.map((tick, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: orientation === 'horizontal' ? '8px' : '2px',
                  backgroundColor: 'hsl(var(--border))',
                  ...(orientation === 'horizontal'
                    ? {
                        left: `${tick.percentage}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }
                    : {
                        left: '50%',
                        bottom: `${tick.percentage}%`,
                        transform: 'translate(-50%, 50%)',
                      }),
                }}
              />
            ))}

            {/* Thumb */}
            <div ref={thumbRef} style={thumbStyles} />
          </div>
        </div>

        {/* Value label - positioned based on labelPosition */}
        {(labelPosition === 'bottom' || labelPosition === 'right') && <ValueLabel />}
      </div>
    );
  },
);

Slider.displayName = 'Slider';
