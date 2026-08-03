'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { XIcon } from 'lucide-react';

import { cn } from '~/lib/utils';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

const ResponsiveModal = DialogPrimitive.Root;
const ResponsiveModalTrigger = DialogPrimitive.Trigger;
const ResponsiveModalClose = DialogPrimitive.Close;
const ResponsiveModalPortal = DialogPrimitive.Portal;

const ResponsiveModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    data-slot="responsive-modal-overlay"
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-modal-backdrop, 1040)' as unknown as number, backgroundColor: 'var(--overlay, rgba(0, 0, 0, 0.5))' }}
    {...props}
    ref={ref}
  />
));
ResponsiveModalOverlay.displayName = 'ResponsiveModalOverlay';

interface ResponsiveModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: 'bottom' | 'top' | 'left' | 'right';
}

const ResponsiveModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ResponsiveModalContentProps
>(({ side = 'bottom', className, children, style, ...props }, ref) => {
  const isDesktop = useIsDesktop();

  const mobileClasses: Record<string, string> = {
    bottom: 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
    top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
    left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
    right: 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  };

  const mobileStyles: Record<string, React.CSSProperties> = {
    bottom: { insetInline: 0, bottom: 0, maxHeight: '80dvh', borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem', borderTop: '1px solid var(--color-border, hsl(var(--border)))' },
    top: { insetInline: 0, top: 0, maxHeight: '80dvh', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem', borderBottom: '1px solid var(--color-border, hsl(var(--border)))' },
    left: { insetBlock: 0, left: 0, width: '75%', maxWidth: '24rem', borderRight: '1px solid var(--color-border, hsl(var(--border)))', borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' },
    right: { insetBlock: 0, right: 0, width: '75%', maxWidth: '24rem', borderLeft: '1px solid var(--color-border, hsl(var(--border)))', borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' },
  };

  const desktopStyles: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '32rem',
    maxHeight: '85vh',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-border, hsl(var(--border)))',
  };

  const positionStyles = isDesktop ? desktopStyles : mobileStyles[side || 'bottom'];

  return (
    <ResponsiveModalPortal>
      <ResponsiveModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="responsive-modal-content"
        className={cn(
          'bg-background shadow-lg overflow-y-auto outline-none',
          'transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          isDesktop
            ? 'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            : mobileClasses[side || 'bottom'],
          className,
        )}
        style={{
          position: 'fixed',
          zIndex: 'var(--z-modal, 1050)' as unknown as number,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem',
          ...positionStyles,
          ...style,
        }}
        {...props}
      >
        {children}
        <ResponsiveModalClose
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </ResponsiveModalClose>
      </DialogPrimitive.Content>
    </ResponsiveModalPortal>
  );
});
ResponsiveModalContent.displayName = 'ResponsiveModalContent';

const ResponsiveModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="responsive-modal-header"
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
);
ResponsiveModalHeader.displayName = 'ResponsiveModalHeader';

const ResponsiveModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="responsive-modal-footer"
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
ResponsiveModalFooter.displayName = 'ResponsiveModalFooter';

const ResponsiveModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="responsive-modal-title"
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
ResponsiveModalTitle.displayName = 'ResponsiveModalTitle';

const ResponsiveModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="responsive-modal-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
ResponsiveModalDescription.displayName = 'ResponsiveModalDescription';

export {
  ResponsiveModal,
  ResponsiveModalPortal,
  ResponsiveModalOverlay,
  ResponsiveModalTrigger,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalFooter,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
};

export type { ResponsiveModalContentProps };
