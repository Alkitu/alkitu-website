"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeConfig, DEFAULT_THEME, BASE_COLORS, FONTS } from "~/lib/theme-config";
import { injectPersonalizedScale, removePersonalizedScale } from "~/lib/color-generator";

type ThemeContextType = {
    themeConfig: ThemeConfig;
    setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useThemeEngine() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeEngine must be used within a ThemeProvider");
    }
    return context;
}

/**
 * Inject a Google Fonts <link> into <head> for a given font name.
 * Skips if the font is "Geist" (built-in via next/font).
 */
function loadGoogleFont(fontName: string) {
    if (!fontName || fontName === 'Geist' || fontName === 'Geist Mono') return;

    const linkId = 'dynamic-google-font';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    const encoded = fontName.replace(/ /g, '+');
    const url = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700&display=swap`;

    if (link.href !== url) {
        link.href = url;
    }
}

// ─── Neutral palettes: the monochromatic exception ───────────────────────────
const NEUTRAL_PALETTES = new Set(['neutral', 'slate', 'gray', 'zinc', 'stone']);

/**
 * Apply theme color overrides via JS.
 * - Secondary: Derived from BASE color (Neutral scale)
 * - Primary/Accent: Derived from BRAND color (Theme scale)
 */
function applyThemeTokens(brand: string, base: string, isDark: boolean) {
    const root = document.documentElement;

    // 1. Secondary (Base-derived)
    // Formula: Light -> Base-600/50 | Dark -> Base-50/500 (High Contrast / Solid)
    if (isDark) {
        root.style.setProperty('--secondary', `var(--color-${base}-50)`);
        root.style.setProperty('--secondary-foreground', `var(--color-${base}-500)`);
    } else {
        root.style.setProperty('--secondary', `var(--color-${base}-600)`);
        root.style.setProperty('--secondary-foreground', `var(--color-${base}-50)`);
    }

    // 2. Base Brand Logic (Primary/Ring)
    if (NEUTRAL_PALETTES.has(brand)) {
        // Monochromatic: CSS defaults already set --primary etc.
        root.style.removeProperty('--primary');
        root.style.removeProperty('--primary-foreground');
        root.style.removeProperty('--ring');
        if (isDark) {
            root.style.setProperty('--accent', `var(--color-${brand}-800)`);
            root.style.setProperty('--accent-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--chart-1', `var(--color-${brand}-400)`);
            root.style.setProperty('--chart-2', `var(--color-${brand}-600)`);
            root.style.setProperty('--chart-3', `var(--color-${brand}-300)`);
            root.style.setProperty('--chart-4', `var(--color-${brand}-700)`);
            root.style.setProperty('--chart-5', `var(--color-${brand}-500)`);
            // Sidebar: neutral tones
            root.style.setProperty('--sidebar-primary', `var(--color-${brand}-50)`);
            root.style.setProperty('--sidebar-primary-foreground', `var(--color-${brand}-500)`);
            root.style.setProperty('--sidebar-accent', `var(--color-${brand}-800)`);
            root.style.setProperty('--sidebar-accent-foreground', `var(--color-${brand}-50)`);
        } else {
            root.style.setProperty('--accent', `var(--color-${brand}-100)`);
            root.style.setProperty('--accent-foreground', `var(--color-${brand}-900)`);
            root.style.setProperty('--chart-1', `var(--color-${brand}-800)`);
            root.style.setProperty('--chart-2', `var(--color-${brand}-600)`);
            root.style.setProperty('--chart-3', `var(--color-${brand}-900)`);
            root.style.setProperty('--chart-4', `var(--color-${brand}-500)`);
            root.style.setProperty('--chart-5', `var(--color-${brand}-700)`);
            // Sidebar: neutral tones
            root.style.setProperty('--sidebar-primary', `var(--color-${brand}-900)`);
            root.style.setProperty('--sidebar-primary-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--sidebar-accent', `var(--color-${brand}-100)`);
            root.style.setProperty('--sidebar-accent-foreground', `var(--color-${brand}-900)`);
        }
    } else {
        // Color theme — apply the mapping algorithm
        if (isDark) {
            root.style.setProperty('--primary', `var(--color-${brand}-500)`);
            root.style.setProperty('--primary-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--ring', `var(--color-${brand}-500)`);
            root.style.setProperty('--accent', `var(--color-${brand}-800)`);
            root.style.setProperty('--accent-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--chart-1', `var(--color-${brand}-500)`);
            root.style.setProperty('--chart-2', `var(--color-${brand}-300)`);
            root.style.setProperty('--chart-3', `var(--color-${brand}-600)`);
            root.style.setProperty('--chart-4', `var(--color-${brand}-400)`);
            root.style.setProperty('--chart-5', `var(--color-${brand}-700)`);
            // Sidebar: brand-derived
            root.style.setProperty('--sidebar-primary', `var(--color-${brand}-500)`);
            root.style.setProperty('--sidebar-primary-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--sidebar-accent', `var(--color-${brand}-800)`);
            root.style.setProperty('--sidebar-accent-foreground', `var(--color-${brand}-50)`);
        } else {
            root.style.setProperty('--primary', `var(--color-${brand}-600)`);
            root.style.setProperty('--primary-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--ring', `var(--color-${brand}-600)`);
            root.style.setProperty('--accent', `var(--color-${brand}-100)`);
            root.style.setProperty('--accent-foreground', `var(--color-${brand}-900)`);
            root.style.setProperty('--chart-1', `var(--color-${brand}-600)`);
            root.style.setProperty('--chart-2', `var(--color-${brand}-400)`);
            root.style.setProperty('--chart-3', `var(--color-${brand}-700)`);
            root.style.setProperty('--chart-4', `var(--color-${brand}-500)`);
            root.style.setProperty('--chart-5', `var(--color-${brand}-800)`);
            // Sidebar: brand-derived
            root.style.setProperty('--sidebar-primary', `var(--color-${brand}-600)`);
            root.style.setProperty('--sidebar-primary-foreground', `var(--color-${brand}-50)`);
            root.style.setProperty('--sidebar-accent', `var(--color-${brand}-100)`);
            root.style.setProperty('--sidebar-accent-foreground', `var(--color-${brand}-900)`);
        }
    }
}

interface ThemeProviderProps extends React.ComponentProps<typeof NextThemesProvider> {
    customFonts?: Record<string, string>;
    storageKey?: string;
    /** Initial config from server (SSR) — takes priority over localStorage */
    initialConfig?: ThemeConfig;
    /** Whether to persist config to localStorage (default: true). Set false when using DB persistence. */
    persist?: boolean;
}

export function ThemeProvider({
    children,
    customFonts = {},
    storageKey = "ds-theme-config",
    initialConfig,
    persist = true,
    ...props
}: ThemeProviderProps) {
    const [themeConfig, setThemeConfig] = React.useState<ThemeConfig>(initialConfig ?? DEFAULT_THEME);
    const [mounted, setMounted] = React.useState(false);

    // Ref to always hold the latest brandColor for the MutationObserver closure
    const brandColorRef = React.useRef(themeConfig.brandColor);
    React.useEffect(() => {
        brandColorRef.current = themeConfig.brandColor;
    }, [themeConfig.brandColor]);

    // Load from local storage on mount (only when persist is enabled and no initialConfig)
    React.useEffect(() => {
        setMounted(true);
        if (persist && !initialConfig) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    setThemeConfig(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse theme config", e);
                }
            }
        }
        // When persist is disabled, clear any stale localStorage config
        // to prevent conflicts from previous sessions (e.g., DS Storybook)
        if (!persist) {
            localStorage.removeItem(storageKey);
        }
    }, []);

    // Save to local storage on change (only when persist is enabled)
    React.useEffect(() => {
        if (mounted && persist) {
            localStorage.setItem(storageKey, JSON.stringify(themeConfig));
        }
    }, [themeConfig, mounted, persist]);

    // Apply Theme Changes
    React.useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const body = document.body;

        // 1. Base Color (Class toggling — themes.css swaps --color-neutral-*)
        BASE_COLORS.forEach((c) => root.classList.remove(`theme-${c.value}`));
        root.classList.add(`theme-${themeConfig.baseColor}`);

        // 2. Font Family — apply DIRECTLY on root & body so it overrides everything
        // 2. Font Family — apply DIRECTLY on root & body
        const fontName = themeConfig.font;
        // Find the font config object to get the mono pairing
        const fontConfig = FONTS.find(f => f.name === fontName) ||
            FONTS[0];

        const monoFont = (fontConfig as any).mono || 'var(--font-geist-mono)'; // Fallback

        if (fontName === 'Geist') {
            root.style.removeProperty('font-family');
            body.style.removeProperty('font-family');
            root.style.removeProperty('--font-sans');
            root.style.removeProperty('--font-mono');
        } else {
            // Load Mono font if it's a Google Font (not a var)
            if (!monoFont.startsWith('var(')) {
                loadGoogleFont(monoFont);
            }

            // Handle Custom Fonts (Vite/Storybook injection)
            if (customFonts && customFonts[fontName]) {
                const fontUrl = customFonts[fontName];
                const styleId = `dynamic-font-${fontName}`;
                let style = document.getElementById(styleId) as HTMLStyleElement | null;

                if (!style) {
                    style = document.createElement('style');
                    style.id = styleId;
                    document.head.appendChild(style);
                }

                const fontFace = `
                    @font-face {
                        font-family: "${fontName}";
                        src: url("${fontUrl}");
                        font-weight: 400 700;
                        font-display: swap;
                        font-style: normal;
                    }
                `;

                if (style.textContent !== fontFace) {
                    style.textContent = fontFace;
                }
            } else {
                // Only load Google Font if it's NOT a custom font
                // (loadGoogleFont function already has checks, but we ensure we don't double load)
                if (!customFonts[fontName]) {
                    loadGoogleFont(fontName);
                }
            }

            const family = `"${fontName}", system-ui, sans-serif`;
            root.style.setProperty('font-family', family);
            body.style.setProperty('font-family', family);
            root.style.setProperty('--font-sans', family);

            // Set dynamic mono font variable
            const monoFamily = monoFont.startsWith('var(')
                ? monoFont // It's already a var, e.g. var(--font-geist-mono)
                : `"${monoFont}", monospace`;

            root.style.setProperty('--font-mono', monoFamily);
        }

        // 3. Radius — scale from base value
        // Sets --radius (used by Tailwind rounded-lg/md/sm) AND --radius-*-val (used by DS)
        const base = themeConfig.radius;
        root.style.setProperty("--radius", `${base}rem`);
        root.style.setProperty("--radius-xs-val", `${base * 0.25}rem`);
        root.style.setProperty("--radius-sm-val", `${base * 0.5}rem`);
        root.style.setProperty("--radius-md-val", `${base * 0.75}rem`);
        root.style.setProperty("--radius-lg-val", `${base}rem`);
        root.style.setProperty("--radius-xl-val", `${base * 1.5}rem`);
        root.style.setProperty("--radius-2xl-val", `${base * 2}rem`);
        root.style.setProperty("--radius-3xl-val", `${base * 3}rem`);
        root.style.setProperty("--radius-card", `calc(${base}rem + 4px)`);
        root.style.setProperty("--radius-input", `${base * 0.75}rem`);
        root.style.setProperty("--radius-dropdown", `${base * 0.75}rem`);

        // 4. Spacing — set --spacing-unit so the full scale (xs–3xl) responds
        const spacing = themeConfig.spacing ?? 1.5;
        const spacingUnit = spacing / 6;
        root.style.setProperty("--spacing-unit", `${spacingUnit}rem`);

        // 5. Shadow — set ALL component shadow vars relative to the base preset
        const shadow = themeConfig.shadow ?? 'md';
        const SHADOW_SCALE = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
        const baseIdx = shadow === 'none' ? 0 : SHADOW_SCALE.indexOf(shadow);
        const getShadow = (offset: number) => {
            if (shadow === 'none') return 'none';
            const idx = Math.max(1, Math.min(baseIdx + offset, SHADOW_SCALE.length - 1));
            return `var(--shadow-${SHADOW_SCALE[idx]})`;
        };
        root.style.setProperty("--shadow-button", getShadow(-1));
        root.style.setProperty("--shadow-button-hover", getShadow(0));
        root.style.setProperty("--shadow-card", getShadow(0));
        root.style.setProperty("--shadow-card-hover", getShadow(1));
        root.style.setProperty("--shadow-dialog", getShadow(3));
        root.style.setProperty("--shadow-popover", getShadow(1));
        root.style.setProperty("--shadow-dropdown", getShadow(1));
        root.style.setProperty("--shadow-tooltip", getShadow(-1));
        root.style.setProperty("--shadow-toast", getShadow(2));

        // 6. Transition speed
        const transition = themeConfig.transition ?? 200;
        root.style.setProperty("--transition-base", `${transition}ms cubic-bezier(0.4, 0, 0.2, 1)`);

        // 7. Brand Color — apply theme token overrides
        // If personalized, inject the generated CSS vars first
        if (themeConfig.brandColor === 'personalized' && themeConfig.customBrandHex) {
            injectPersonalizedScale(themeConfig.customBrandHex);
        } else {
            removePersonalizedScale();
        }

        const isDark = root.classList.contains('dark');
        applyThemeTokens(themeConfig.brandColor, themeConfig.baseColor, isDark);

    }, [themeConfig, mounted]);

    // ─── MutationObserver: reapply brand tokens when dark mode class toggles ─
    // Re-run when themeConfig changes so the closure has the fresh values
    React.useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const isDark = root.classList.contains('dark');
                    // Now themeConfig is fresh because checking [themeConfig, mounted]
                    applyThemeTokens(themeConfig.brandColor, themeConfig.baseColor, isDark);
                }
            }
        });

        observer.observe(root, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, [themeConfig, mounted]); // Only depends on mounted — reads brandColor from ref

    return (
        <ThemeContext.Provider value={{ themeConfig, setThemeConfig }}>
            <NextThemesProvider {...props}>
                {children}
            </NextThemesProvider>
        </ThemeContext.Provider>
    );
}

export { ThemeContext };
