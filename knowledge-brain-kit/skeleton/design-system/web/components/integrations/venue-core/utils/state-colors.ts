import type { VenueElementState } from '../types';

// ---------------------------------------------------------------------------
// State → Design-System token mapping
// ---------------------------------------------------------------------------
// Maps venue element states to the semantic CSS custom properties already
// defined in globals.css. This ensures seat/table/area colors inherit the
// current theme (light/dark), brand color, and any runtime customization
// applied by the ThemeProvider.
// ---------------------------------------------------------------------------

export interface StateColorTokens {
  bg: string;
  fg: string;
  border?: string;
}

const STATE_TOKEN_MAP: Record<VenueElementState, StateColorTokens> = {
  available: { bg: 'var(--success)',     fg: 'var(--success-foreground)' },
  occupied:  { bg: 'var(--destructive)', fg: 'var(--destructive-foreground)', border: 'var(--destructive-border)' },
  selected:  { bg: 'var(--primary)',     fg: 'var(--primary-foreground)' },
  disabled:  { bg: 'var(--muted)',       fg: 'var(--muted-foreground)' },
  reserved:  { bg: 'var(--warning)',     fg: 'var(--warning-foreground)' },
  hover:     { bg: 'var(--accent)',      fg: 'var(--accent-foreground)' },
};

/** Get the CSS variable tokens for a given venue element state */
export function getStateTokens(state: VenueElementState): StateColorTokens {
  return STATE_TOKEN_MAP[state];
}

/** Build an inline style object for an SVG element based on its state */
export function getStateFill(state: VenueElementState): React.CSSProperties {
  const tokens = STATE_TOKEN_MAP[state];
  return {
    fill: tokens.bg,
    color: tokens.fg,
    stroke: tokens.border ?? tokens.bg,
  };
}

/** All available state tokens (for legends, etc.) */
export function getAllStateTokens(): Record<VenueElementState, StateColorTokens> {
  return { ...STATE_TOKEN_MAP };
}
