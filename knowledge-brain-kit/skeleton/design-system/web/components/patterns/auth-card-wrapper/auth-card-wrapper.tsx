'use client';

import React from 'react';
import { cn } from '~/lib/utils';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '~/components/primitives/card';
import { Spinner } from '~/components/primitives/spinner';
import { Typography } from '~/components/primitives/typography';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * Props for the AuthCardWrapper composed component.
 *
 * A responsive card wrapper for authentication forms with branding, navigation,
 * and layout optimisations. Framework-agnostic: accepts custom link/logo/icon
 * components via props so it can be used with Next.js, React Router, etc.
 */
export interface AuthCardWrapperProps {
  /** The form or content to display inside the card */
  children: React.ReactNode;

  /** Main title/heading for the auth card */
  title: string;

  /** Optional subtitle or description text below the title */
  subtitle?: string;

  /**
   * Optional icon node to display above the title.
   * Render your own icon element (e.g. `<Icon name="lock" />`) and pass it here.
   */
  icon?: React.ReactNode;

  /**
   * Optional logo node to display at the top of the card.
   * Pass your app-specific `<Logo />` component here.
   */
  logo?: React.ReactNode;

  /** Label for the back button */
  backButtonLabel?: string;

  /**
   * Resolved href for the back button.
   * The caller is responsible for locale resolution; pass the final URL here.
   */
  backButtonHref?: string;

  /**
   * Custom link component for the back button.
   * Defaults to plain `<a>` when not provided.
   */
  linkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
    'data-testid'?: string;
  }>;

  /** Whether to show social auth section */
  showSocial?: boolean;

  /** Text for the divider above social auth buttons */
  socialDividerText?: string;

  /**
   * Custom social auth content.
   * When provided, replaces the default Google sign-in button.
   */
  socialContent?: React.ReactNode;

  /**
   * API URL used for the default Google sign-in button.
   * Only used when `showSocial` is true and `socialContent` is not provided.
   * @default "http://localhost:3001"
   */
  apiUrl?: string;

  /** Footer content (e.g., links like "Don't have an account? Sign up") */
  footer?: React.ReactNode;

  /** Whether the card is in a loading state */
  isLoading?: boolean;

  /** Custom className for the wrapper container */
  className?: string;

  /** Custom className for the card */
  cardClassName?: string;

  /** Disable responsive behaviour (always show desktop layout) */
  disableResponsive?: boolean;

  /** Layout variant: vertical (default) or horizontal split */
  layout?: 'vertical' | 'horizontal';

  /** Content to display on the left side when layout is horizontal */
  sideContent?: React.ReactNode;

  /** Test ID for testing */
  'data-testid'?: string;
}

/* ------------------------------------------------------------------ */
/*  Back-arrow SVG (inline to avoid framework-specific icon deps)      */
/* ------------------------------------------------------------------ */

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * AuthCardWrapper - Design System Composed Component
 *
 * A responsive authentication card layout with branding, navigation and
 * social auth support. App-specific elements (Logo, Icon, locale routing)
 * are injected via props so the component remains framework-agnostic.
 *
 * @example
 * ```tsx
 * <AuthCardWrapper
 *   title="Sign In"
 *   subtitle="Welcome back"
 *   logo={<Logo />}
 *   icon={<LockIcon className="h-8 w-8 text-primary" />}
 *   backButtonLabel="Back to home"
 *   backButtonHref="/en"
 *   linkComponent={NextLink}
 *   footer={<p>Don't have an account? <a href="/register">Sign up</a></p>}
 * >
 *   <LoginForm />
 * </AuthCardWrapper>
 * ```
 */
export const AuthCardWrapper = React.forwardRef<HTMLDivElement, AuthCardWrapperProps>(
  (
    {
      children,
      title,
      subtitle,
      icon,
      logo,
      backButtonLabel,
      backButtonHref,
      linkComponent: LinkComponent,
      showSocial = false,
      socialDividerText = 'Or continue with',
      socialContent,
      apiUrl = 'http://localhost:3001',
      footer,
      isLoading = false,
      className,
      cardClassName,
      disableResponsive = false,
      layout = 'vertical',
      sideContent,
      'data-testid': dataTestId = 'auth-card-wrapper',
      ...props
    },
    ref,
  ) => {
    // Resolve link element: prefer custom LinkComponent, fall back to <a>
    const BackLink = LinkComponent ?? 'a';

    // Desktop back button component
    const DesktopBackButton = () => {
      if (!backButtonLabel || !backButtonHref) return null;

      return (
        <div className="w-full max-w-[1200px] mx-auto mb-8 hidden md:block">
          <BackLink
            href={backButtonHref}
            className="inline-flex items-center gap-2 group text-primary hover:no-underline"
            data-testid="desktop-back-button"
          >
            <div className="flex items-center justify-center p-[2px] w-4 h-4">
              <ArrowLeftIcon className="h-4 w-4" />
            </div>
            <Typography
              variant="span"
              size="sm"
              weight="light"
              className="group-hover:underline"
            >
              {backButtonLabel}
            </Typography>
          </BackLink>
        </div>
      );
    };

    // Mobile back button component
    const MobileBackButton = () => {
      if (!backButtonLabel || !backButtonHref) return null;

      return (
        <div className="flex items-center justify-center mt-2 md:hidden">
          <BackLink
            href={backButtonHref}
            className="inline-flex items-center gap-2 text-primary hover:no-underline group"
            data-testid="mobile-back-button"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <Typography variant="span" size="sm" weight="light">
              {backButtonLabel}
            </Typography>
          </BackLink>
        </div>
      );
    };

    // Social auth section component
    const SocialSection = () => {
      if (!showSocial) return null;

      return (
        <>
          <div className="w-full flex items-center gap-4 my-2" data-testid="social-divider">
            <div className="h-px bg-border flex-1" />
            <Typography
              variant="span"
              size="xs"
              weight="medium"
              className="tracking-widest text-muted-foreground uppercase"
            >
              {socialDividerText}
            </Typography>
            <div className="h-px bg-border flex-1" />
          </div>

          {socialContent ?? (
            <a
              href={`${apiUrl}/auth/google`}
              className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid="google-sign-in-button"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </a>
          )}
        </>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-background flex flex-col min-h-screen',
          disableResponsive ? 'p-8' : 'p-0 md:p-8',
          className,
        )}
        data-testid={dataTestId}
        {...props}
      >
        {/* Desktop Back Button (Top Left) */}
        <DesktopBackButton />

        {/* Main Content Area */}
        <div
          className={cn(
            'flex-1 flex items-start justify-center',
            disableResponsive ? 'pt-0' : 'pt-4 md:pt-0',
          )}
        >
          <Card
            className={cn(
              'w-full flex flex-col items-center relative overflow-hidden',
              layout === 'horizontal' 
                ? (sideContent ? 'md:flex-row md:max-w-[1000px]' : 'md:max-w-[800px]') 
                : 'md:max-w-[1000px] gap-6',
              disableResponsive || layout === 'horizontal'
                ? 'bg-card rounded-2xl shadow-sm border border-border'
                : 'md:bg-card md:rounded-2xl md:shadow-sm md:border md:border-border p-6 md:p-[42px]',
              cardClassName,
            )}
          >
            {layout === 'horizontal' && sideContent && (
              <div className="hidden md:flex w-1/2 relative self-stretch">
                {sideContent}
              </div>
            )}
            
            <div className={cn(
              'flex flex-col items-center w-full',
              layout === 'horizontal' ? (sideContent ? 'p-6 md:p-[52px] md:w-1/2 gap-6' : 'p-6 md:p-[52px] md:w-full gap-6') : 'p-0',
            )}>
            {/* Loading Overlay */}
            {isLoading && (
              <div
                className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center z-10"
                data-testid="loading-overlay"
              >
                <Spinner size="lg" />
              </div>
            )}

            {/* Logo */}
            {logo && (
              <div className="mb-2" data-testid="auth-logo">
                {logo}
              </div>
            )}

            {/* Header Section */}
            <CardHeader className="flex flex-col items-center gap-2 text-center mb-2 p-0 w-full">
              {/* Icon */}
              {icon && (
                <div
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                  data-testid="auth-icon-container"
                >
                  {icon}
                </div>
              )}

              {/* Title */}
              <Typography
                variant="h1"
                size="4xl"
                weight="bold"
                color="foreground"
                className="scroll-m-20 tracking-tight"
              >
                {title}
              </Typography>

              {/* Subtitle */}
              {subtitle && (
                <Typography
                  variant="p"
                  size="md"
                  weight="light"
                  color="muted"
                  className="w-full"
                  data-testid="auth-subtitle"
                >
                  {subtitle}
                </Typography>
              )}
            </CardHeader>

            {/* Content Area (Form) */}
            <CardContent className="w-full p-0">
              {children}
            </CardContent>

            {/* Social Section */}
            <SocialSection />

            {/* Footer Section */}
            {footer && (
              <CardFooter
                className="w-full flex flex-col items-center justify-center gap-2 text-center p-0"
                data-testid="auth-footer"
              >
                {footer}
              </CardFooter>
            )}

            {/* Mobile Back Button (Bottom) */}
            <MobileBackButton />
            </div>
          </Card>
        </div>
      </div>
    );
  },
);

AuthCardWrapper.displayName = 'AuthCardWrapper';
