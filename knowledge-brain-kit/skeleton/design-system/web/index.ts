// ─── Utilities ───────────────────────────────────────────────────────────────
export { cn } from "~/lib/utils";
export {
  generateColorScale,
  injectPersonalizedScale,
  removePersonalizedScale,
} from "~/lib/color-generator";

// ─── Theme ───────────────────────────────────────────────────────────────────
export {
  DEFAULT_THEME,
  BASE_COLORS,
  BRAND_COLORS,
  FONTS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  SHADOW_OPTIONS,
  TRANSITION_OPTIONS,
} from "~/lib/theme-config";
export type { ThemeConfig } from "~/lib/theme-config";
export { generateThemeConfigCSS } from "~/lib/theme-css-generator";

export {
  ThemeProvider,
  useThemeEngine,
  ThemeContext,
} from "~/components/theme-provider";

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useIsMobile } from "~/hooks/use-mobile";
export { useReducedMotion } from "~/hooks/use-reduced-motion";

// ─── Core UI (re-export from category barrels) ──────────────────────────────
export * from "~/components/primitives";
export * from "~/components/compositions";
export * from "~/components/patterns";

// ─── Showcase & Integrations ────────────────────────────────────────────────
// These are NOT barrel-exported to avoid bundle bloat.
// Import directly when needed:
//   import { SplashCursor } from "@brain/design-system-web/components/showcase/animations/splash-cursor/splash-cursor"
//   import { BigCalendar } from "@brain/design-system-web/components/integrations/calendars/big-calendar"
//   import { Map } from "@brain/design-system-web/components/integrations/maps/map/map"
//   import { LottieAnimation } from "@brain/design-system-web/components/integrations/lottie/lottie-animation/lottie-animation"
//   import { RemotionPlayer } from "@brain/design-system-web/components/integrations/video/remotion-player/remotion-player"
//   import ModelAnimations from "@brain/design-system-web/components/integrations/model-staging/model-animations"

// Type-only exports for integrations (maps, calendars, video, 3D, lottie)
export type * from "~/components/integrations";
