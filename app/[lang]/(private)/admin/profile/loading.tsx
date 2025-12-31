/**
 * Loading state for My Profile page
 *
 * Displays skeleton screens while profile data is being fetched
 */

import { Loader2 } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
        <div className="mt-2 h-5 w-96 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Card Container */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="space-y-6">
          {/* Header with username */}
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-40 bg-muted rounded-md animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="mt-1 h-4 w-64 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="-mb-px flex space-x-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-32 bg-muted rounded-t-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Form Content Loading */}
          <div className="space-y-6">
            {/* Photo Upload Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bio Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-24 w-full bg-muted rounded-md animate-pulse" />
            </div>

            {/* Department Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
            </div>

            {/* Additional Fields */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <div className="h-10 w-28 bg-muted rounded-md animate-pulse" />
            <div className="h-10 w-40 bg-primary/20 rounded-md animate-pulse" />
          </div>

          {/* Centered Loading Indicator */}
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
