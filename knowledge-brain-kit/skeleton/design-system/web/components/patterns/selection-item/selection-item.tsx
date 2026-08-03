import React from 'react';
import { Heart } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SelectionItemData {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string | null;
  iconColor?: string;
  categoryName: string;
}

export interface SelectionItemProps {
  /** The item data to display */
  item: SelectionItemData;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Callback when the item is selected */
  onSelect: (id: string) => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the item is marked as favorite */
  isFavorite?: boolean;
  /** Callback to toggle favorite status */
  onToggleFavorite?: (id: string) => void;
  /**
   * Render function for the icon/image fallback area.
   * Receives the item data and should return a ReactNode to display
   * inside the 40px-tall icon container.
   */
  renderIcon?: (item: SelectionItemData) => React.ReactNode;
  /**
   * Compute a background color for the icon fallback area.
   * Receives the item's iconColor and returns a CSS color string.
   */
  getBackgroundColor?: (iconColor: string) => string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SelectionItem: React.FC<SelectionItemProps> = ({
  item,
  isSelected,
  onSelect,
  disabled = false,
  className = '',
  isFavorite = false,
  onToggleFavorite,
  renderIcon,
  getBackgroundColor,
}) => {
  const isImageUrl =
    item.thumbnail &&
    (item.thumbnail.startsWith('http') || item.thumbnail.startsWith('/'));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onSelect(item.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && onSelect(item.id)}
      onKeyDown={handleKeyDown}
      className={`
        relative flex w-full flex-col rounded-xl border transition-all overflow-hidden
        ${isSelected
          ? 'ring-2 ring-primary border-primary'
          : 'border-border hover:border-primary/30'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Title bar + Heart */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
          {item.name}
        </p>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`shrink-0 rounded-full p-1 transition-colors ${
              isFavorite
                ? 'text-red-500'
                : 'text-muted-foreground hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Hero image / icon fallback */}
      <div className="px-3 pb-3">
        {isImageUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={item.thumbnail!}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-sm"
            />
            <img
              src={item.thumbnail!}
              alt={item.name}
              className="relative z-10 mx-auto h-full rounded-2xl object-contain p-2"
            />
          </div>
        ) : (
          <div
            className="flex h-40 w-full items-center justify-center rounded-lg"
            style={{
              backgroundColor: getBackgroundColor
                ? getBackgroundColor(item.iconColor || '#000000')
                : undefined,
            }}
          >
            {renderIcon ? (
              renderIcon(item)
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {item.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SelectionItem.displayName = 'SelectionItem';
