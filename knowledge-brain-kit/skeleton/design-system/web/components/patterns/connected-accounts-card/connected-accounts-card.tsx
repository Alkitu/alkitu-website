'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/primitives/alert-dialog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OAuthProviderConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  isConnected: boolean;
  accountId?: string;
}

export interface ConnectedAccountsCardProps {
  /** Array of OAuth provider configurations to display */
  providers: OAuthProviderConfig[];
  /** Callback when user wants to connect a provider */
  onConnect: (providerId: string) => void;
  /** Callback when user confirms disconnecting a provider */
  onDisconnect: (providerId: string, accountId?: string) => void;
  /** Whether a disconnect mutation is in progress */
  isDisconnecting?: boolean;
  /** Whether the user can disconnect (has password or multiple accounts) */
  canDisconnect: boolean;
  /** Translated label strings */
  labels: {
    connected: string;
    notConnected: string;
    connect: string;
    disconnect: string;
    confirmTitle: string;
    confirmDescription: string;
    cancel: string;
    cannotDisconnect?: string;
  };
  /** Optional className for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ConnectedAccountsCard - Design System Kit (auth)
 *
 * Pure UI component that renders a list of OAuth providers with
 * connect/disconnect actions. All data fetching and side-effects
 * are handled by the consuming application via props.
 */
export const ConnectedAccountsCard: React.FC<ConnectedAccountsCardProps> = ({
  providers,
  onConnect,
  onDisconnect,
  isDisconnecting = false,
  canDisconnect,
  labels,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          {/* Provider info */}
          <div className="flex items-center gap-3">
            {provider.icon}
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {provider.label}
              </span>
              {provider.isConnected ? (
                <Badge variant="success" size="sm">
                  {labels.connected}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {labels.notConnected}
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          {provider.isConnected ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canDisconnect || isDisconnecting}
                  title={
                    !canDisconnect ? labels.cannotDisconnect : undefined
                  }
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    labels.disconnect
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{labels.confirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {labels.confirmDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      onDisconnect(provider.id, provider.accountId)
                    }
                  >
                    {labels.disconnect}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConnect(provider.id)}
            >
              {labels.connect}
            </Button>
          )}
        </div>
      ))}

      {/* Helper text when the only auth method cannot be removed */}
      {!canDisconnect &&
        providers.some((p) => p.isConnected) &&
        labels.cannotDisconnect && (
          <p className="text-sm text-muted-foreground">
            {labels.cannotDisconnect}
          </p>
        )}
    </div>
  );
};

ConnectedAccountsCard.displayName = 'ConnectedAccountsCard';

export default ConnectedAccountsCard;
