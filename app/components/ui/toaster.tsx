'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '@/app/context/ThemeContext';

/**
 * Global toast notification component using Sonner
 *
 * Features:
 * - Theme-aware (follows light/dark mode)
 * - Positioned at bottom-right
 * - Rich toast types (success, error, warning, info)
 * - Dismissible with close button
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * import { toast } from 'sonner';
 *
 * // Success toast
 * toast.success('Operation completed successfully');
 *
 * // Error toast
 * toast.error('Something went wrong');
 *
 * // Info toast
 * toast.info('New update available');
 *
 * // Warning toast
 * toast.warning('Please review your changes');
 *
 * // Custom toast with action
 * toast('Event created', {
 *   action: {
 *     label: 'View',
 *     onClick: () => console.log('View clicked'),
 *   },
 * });
 * ```
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="bottom-right"
      theme={resolvedTheme}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
          title: 'text-sm font-semibold',
          description: 'text-sm',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90',
          closeButton: 'bg-background border-border hover:bg-muted',
        },
      }}
    />
  );
}
