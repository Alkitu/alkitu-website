/**
 * Personalized Color Scale Generator
 *
 * Takes a single HEX color (treated as shade 600) and generates
 * a complete 50–950 palette via HSL manipulation.
 */

// ─── HEX ↔ HSL Conversion Helpers ──────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * Math.max(0, Math.min(1, color)))
            .toString(16)
            .padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

// ─── Scale Generation ───────────────────────────────────────────────────────

/**
 * Shade targets: maps each shade to a target lightness.
 * The 600 shade anchors to the input color's actual lightness.
 * All other shades are interpolated relative to that anchor.
 */
const SHADE_TARGETS: Record<string, number> = {
    '50': 97,
    '100': 94,
    '200': 86,
    '300': 76,
    '400': 64,
    '500': 50,
    '600': 40,   // Anchor reference (will be overridden by actual)
    '700': 32,
    '800': 24,
    '900': 17,
    '950': 10,
};

/**
 * Saturation adjustment per shade.
 * Extremes are slightly desaturated for a natural palette feel.
 */
const SAT_ADJUST: Record<string, number> = {
    '50': -15,
    '100': -10,
    '200': -5,
    '300': 0,
    '400': 2,
    '500': 5,
    '600': 0,    // Anchor — no adjustment
    '700': -2,
    '800': -5,
    '900': -8,
    '950': -12,
};

/**
 * Generate a complete color scale from a single HEX value.
 *
 * @param hex - The base color HEX (used as shade 600)
 * @returns Record mapping shade names ('50'–'950') to HEX values
 */
export function generateColorScale(hex: string): Record<string, string> {
    // Validate
    const clean = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
        // Return a grey fallback if invalid
        return generateColorScale('#6366F1');
    }

    const [r, g, b] = hexToRgb(hex);
    const [hue, sat, light] = rgbToHsl(r, g, b);

    // Calculate the offset: how far the actual 600 lightness is from the reference
    const lightOffset = light - SHADE_TARGETS['600'];

    const scale: Record<string, string> = {};

    for (const [shade, targetLight] of Object.entries(SHADE_TARGETS)) {
        // Adjust lightness: apply offset proportionally
        // For lighter shades (above 600), compress toward the anchor
        // For darker shades (below 600), compress toward the anchor
        let adjustedLight: number;

        if (shade === '600') {
            adjustedLight = light; // Exact input color
        } else {
            // Scale the offset based on distance from 600
            const shadeNum = parseInt(shade);
            const factor = shadeNum < 600
                ? (600 - shadeNum) / 600  // 0–1 for lighter shades
                : (shadeNum - 600) / 400; // 0–1 for darker shades

            adjustedLight = targetLight + lightOffset * (1 - factor * 0.5);
        }

        // Clamp lightness
        adjustedLight = Math.max(3, Math.min(98, adjustedLight));

        // Adjust saturation
        const adjustedSat = Math.max(0, Math.min(100, sat + (SAT_ADJUST[shade] || 0)));

        scale[shade] = hslToHex(hue, adjustedSat, adjustedLight);
    }

    return scale;
}

/**
 * Inject the personalized color scale as CSS custom properties.
 *
 * @param hex - The base HEX color (shade 600)
 */
export function injectPersonalizedScale(hex: string): void {
    const scale = generateColorScale(hex);
    const root = document.documentElement;

    for (const [shade, color] of Object.entries(scale)) {
        root.style.setProperty(`--color-personalized-${shade}`, color);
    }
}

/**
 * Remove all personalized color CSS custom properties.
 */
export function removePersonalizedScale(): void {
    const root = document.documentElement;
    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

    for (const shade of shades) {
        root.style.removeProperty(`--color-personalized-${shade}`);
    }
}
