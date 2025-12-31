/**
 * Privacy Toggle Component
 *
 * Reusable toggle switch for controlling field visibility.
 * Used across all profile fields to control public/private status.
 */

'use client';

import { Eye, EyeOff } from 'lucide-react';

interface PrivacyToggleProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PrivacyToggle({
  isPublic,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: PrivacyToggleProps) {
  const sizeClasses = {
    sm: 'h-4 w-8',
    md: 'h-5 w-10',
    lg: 'h-6 w-12',
  };

  const dotSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={() => !disabled && onChange(!isPublic)}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full transition-colors
          ${sizeClasses[size]}
          ${isPublic
            ? 'bg-primary'
            : 'bg-secondary'
          }
          ${disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:opacity-80'
          }
        `}
        aria-label={`Toggle privacy: ${isPublic ? 'Public' : 'Private'}`}
        aria-pressed={isPublic}
      >
        <span
          className={`
            inline-flex items-center justify-center rounded-full bg-white shadow-sm transition-transform
            ${dotSizeClasses[size]}
            ${isPublic
              ? 'translate-x-5'
              : 'translate-x-1'
            }
          `}
        >
          {isPublic ? (
            <Eye className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-primary`} />
          ) : (
            <EyeOff className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-secondary`} />
          )}
        </span>
      </button>

      <span className={`text-xs ${isPublic ? 'text-primary' : 'text-muted-foreground'}`}>
        {isPublic ? 'Público' : 'Privado'}
      </span>
    </div>
  );
}
