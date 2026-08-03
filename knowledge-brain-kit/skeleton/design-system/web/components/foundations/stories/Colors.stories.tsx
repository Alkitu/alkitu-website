import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useThemeEngine } from '../../theme-provider';
import { generateColorScale } from '../../../lib/color-generator';

/**
 * Color swatch that reads its computed background color and displays the HEX value.
 */
const Swatch = ({
    name,
    cssVar,
    className,
}: {
    name: string;
    cssVar: string;
    className?: string;
}) => {
    const swatchRef = React.useRef<HTMLDivElement>(null);
    const [hex, setHex] = React.useState('');
    const [rawToken, setRawToken] = React.useState('');

    const cssVarsMap = React.useContext(CssVarsContext);

    React.useEffect(() => {
        const el = swatchRef.current;
        if (!el) return;

        const readColor = () => {
            // 1. Get computed HEX
            const computedStyle = getComputedStyle(el);
            const computedBg = computedStyle.backgroundColor;
            const currentHex = rgbToHex(computedBg);
            setHex(currentHex);

            // 2. Try inline style first (Dynamic Theme overrides)
            let rootValue = document.documentElement.style.getPropertyValue(cssVar).trim();

            // 3. If no inline, try to find matching candidate from stylesheets
            if (!rootValue && cssVarsMap[cssVar]) {
                const candidates = cssVarsMap[cssVar];
                // Check which candidate resolves to the current HEX
                // This handles finding the correct value between Light (.root) and Dark (.dark) definitions
                const rootComputed = getComputedStyle(document.documentElement);

                const match = candidates.find(candidate => {
                    // If candidate is var(--foo), resolve --foo
                    const varMatch = candidate.match(/var\(\s*(.+?)\s*\)/);
                    if (varMatch) {
                        const innerVar = varMatch[1];
                        const resolvedInner = rootComputed.getPropertyValue(innerVar).trim();
                        // innerVar might verify to a hex.
                        return rgbToHex(resolvedInner).toLowerCase() === currentHex.toLowerCase();
                    }
                    // Literal check (e.g. #fff)
                    return candidate.toLowerCase() === currentHex.toLowerCase() ||
                        rgbToHex(candidate).toLowerCase() === currentHex.toLowerCase();
                });

                if (match) rootValue = match;
            }

            // 4. Fallback: Computed value if nothing found (e.g. global primitive)
            if (!rootValue) {
                rootValue = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
            }

            // Extract the inner variable name: var(--color-neutral-100) -> neutral-100
            // Handle cases with spaces: var( --color-neutral-100 )
            const matchRef = rootValue.match(/var\(\s*--color-(.+?)\s*\)/);
            if (matchRef && matchRef[1]) {
                setRawToken(matchRef[1]);
            } else if (rootValue) {
                // If it's a direct color value or other format, show it if it's not the same as computed
                // But for semantic tokens, we mostly care about the mapping
                setRawToken(rootValue);
            } else {
                setRawToken('');
            }
        };

        // Initial read
        readColor();

        // Re-read when attributes change on <html>
        // We add a small delay because theme-provider updates styles asynchronously after class change
        const observer = new MutationObserver(() => {
            readColor();
            setTimeout(readColor, 50);
            setTimeout(readColor, 150);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });

        return () => observer.disconnect();
    }, [cssVar, cssVarsMap]);

    return (
        <div className="flex items-center gap-3">
            <div
                ref={swatchRef}
                className={`h-10 w-10 rounded-md border border-border shrink-0 shadow-sm ${className || ''}`}
                style={{ backgroundColor: `var(${cssVar})` }}
            />
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground">{name}</span>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-mono truncate">
                        {cssVar}
                    </span>
                    {/* Show raw token if it exists and isn't identical to the hex value (case-insensitive) */}
                    {rawToken && rawToken.toLowerCase() !== hex.toLowerCase() && (
                        <span className="text-[10px] text-blue-500 font-mono truncate">
                            → {rawToken}
                        </span>
                    )}
                </div>
                {hex && (
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide">
                        {hex}
                    </span>
                )}
            </div>
        </div>
    );
};

/** Convert rgb(r, g, b) string to #RRGGBB */
function rgbToHex(rgb: string): string {
    if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return 'transparent';

    // Handle rgba
    const match = rgb.match(
        /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/
    );
    if (!match) return rgb;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    if (a < 1) {
        return `${hex} / ${Math.round(a * 100)}%`;
    }
    return hex;
}

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 capitalize">
            {title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {children}
        </div>
    </div>
);

const ColorScale = ({ name }: { name: string }) => (
    <Section title={`${name} Scale`}>
        {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(
            (n) => (
                <Swatch key={n} name={`${name}-${n}`} cssVar={`--color-${name}-${n}`} />
            )
        )}
    </Section>
);

/* ─── Personalized Color Scale ────────────────────────── */

const PersonalizedSwatch = ({
    shade,
    hex,
    isAnchor,
}: {
    shade: string;
    hex: string;
    isAnchor?: boolean;
}) => (
    <div className="flex items-center gap-3">
        <div
            className={`h-10 w-10 rounded-md border shrink-0 shadow-sm ${isAnchor ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : 'border-border'
                }`}
            style={{ backgroundColor: hex }}
        />
        <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground">
                personalized-{shade}{isAnchor ? ' (base)' : ''}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
                --color-personalized-{shade}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide">
                {hex}
            </span>
        </div>
    </div>
);

const PersonalizedColorScale = () => {
    let themeEngine: ReturnType<typeof useThemeEngine> | null = null;
    try {
        themeEngine = useThemeEngine();
    } catch {
        // Not inside ThemeProvider — will not render interactively
    }

    const currentHex = themeEngine?.themeConfig?.customBrandHex || '#6366F1';
    const [inputValue, setInputValue] = React.useState(currentHex);

    // Sync input when themeConfig changes externally
    React.useEffect(() => {
        setInputValue(currentHex);
    }, [currentHex]);

    const scale = React.useMemo(() => generateColorScale(inputValue), [inputValue]);

    const handleColorChange = (hex: string) => {
        setInputValue(hex);
        if (themeEngine) {
            themeEngine.setThemeConfig((prev) => ({
                ...prev,
                customBrandHex: hex,
            }));
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Personalized Scale
            </h3>

            {/* HEX Input */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <label
                    htmlFor="custom-hex-input"
                    className="text-sm font-medium text-foreground whitespace-nowrap"
                >
                    Base Color (600):
                </label>
                <input
                    type="color"
                    id="custom-hex-picker"
                    value={inputValue}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded-md cursor-pointer border border-border"
                />
                <input
                    type="text"
                    id="custom-hex-input"
                    value={inputValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        setInputValue(val);
                        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                            handleColorChange(val);
                        }
                    }}
                    placeholder="#6366F1"
                    className="w-28 px-2 py-1 rounded-md border border-input bg-background text-foreground font-mono text-sm"
                    maxLength={7}
                />
                <span className="text-xs text-muted-foreground">
                    Input the HEX that will be used as shade 600. The rest of the scale is auto-generated.
                </span>
            </div>

            {/* Generated Swatches */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(
                    (shade) => (
                        <PersonalizedSwatch
                            key={shade}
                            shade={shade}
                            hex={scale[shade]}
                            isAnchor={shade === '600'}
                        />
                    )
                )}
            </div>
        </div>
    );
};

/* ─── CSS Variable Context ────────────────────────────── */
const CssVarsContext = React.createContext<Record<string, string[]>>({});

const CssVarsProvider = ({ children }: { children: React.ReactNode }) => {
    const [vars, setVars] = React.useState<Record<string, string[]>>({});

    React.useEffect(() => {
        // Debounce the scan to ensure styles are loaded
        const timeout = setTimeout(() => {
            const map: Record<string, Set<string>> = {};

            try {
                Array.from(document.styleSheets).forEach((sheet) => {
                    try {
                        Array.from(sheet.cssRules).forEach((rule) => {
                            if ((rule as CSSStyleRule).style) {
                                const style = (rule as CSSStyleRule).style;
                                for (let i = 0; i < style.length; i++) {
                                    const prop = style[i];
                                    if (prop.startsWith('--')) {
                                        const val = style.getPropertyValue(prop).trim();
                                        if (!map[prop]) map[prop] = new Set();
                                        map[prop].add(val);
                                    }
                                }
                            }
                        });
                    } catch (e) {
                        // CORS restrictions might block some sheets, easier to ignore
                    }
                });

                const finalMap: Record<string, string[]> = {};
                Object.entries(map).forEach(([key, val]) => {
                    finalMap[key] = Array.from(val);
                });
                setVars(finalMap);
            } catch (e) {
                console.error("Error scanning stylesheets", e);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    return <CssVarsContext.Provider value={vars}>{children}</CssVarsContext.Provider>;
};

/* ─── Semantic Tokens ─────────────────────────────────── */

const SemanticColors = () => (
    <div className="space-y-6">
        {/* Structure */}
        <Section title="Structure">
            <Swatch name="background" cssVar="--background" />
            <Swatch name="foreground" cssVar="--foreground" />
        </Section>

        {/* Brand / Primary */}
        <Section title="Brand / Primary">
            <Swatch name="primary" cssVar="--primary" />
            <Swatch name="primary-foreground" cssVar="--primary-foreground" />
            <Swatch name="ring" cssVar="--ring" />
        </Section>

        {/* Secondary / Muted / Accent */}
        <Section title="Secondary / Muted / Accent">
            <Swatch name="secondary" cssVar="--secondary" />
            <Swatch name="secondary-foreground" cssVar="--secondary-foreground" />
            <Swatch name="muted" cssVar="--muted" />
            <Swatch name="muted-foreground" cssVar="--muted-foreground" />
            <Swatch name="accent" cssVar="--accent" />
            <Swatch name="accent-foreground" cssVar="--accent-foreground" />
        </Section>

        {/* Card / Popover */}
        <Section title="Card / Popover">
            <Swatch name="card" cssVar="--card" />
            <Swatch name="card-foreground" cssVar="--card-foreground" />
            <Swatch name="popover" cssVar="--popover" />
            <Swatch name="popover-foreground" cssVar="--popover-foreground" />
        </Section>

        {/* Inputs / Borders */}
        <Section title="Inputs / Borders">
            <Swatch name="border" cssVar="--border" />
            <Swatch name="input" cssVar="--input" />
        </Section>

        {/* Destructive */}
        <Section title="Destructive">
            <Swatch name="destructive" cssVar="--destructive" />
            <Swatch name="destructive-foreground" cssVar="--destructive-foreground" />
            <Swatch name="destructive-subtle" cssVar="--destructive-subtle" />
            <Swatch name="destructive-border" cssVar="--destructive-border" />
        </Section>

        {/* Overlays */}
        <Section title="Overlays">
            <Swatch name="overlay" cssVar="--overlay" />
        </Section>

        {/* Scrollbar */}
        <Section title="Scrollbar">
            <Swatch name="scrollbar-track" cssVar="--scrollbar-track" />
            <Swatch name="scrollbar-thumb" cssVar="--scrollbar-thumb" />
            <Swatch name="scrollbar-thumb-hover" cssVar="--scrollbar-thumb-hover" />
        </Section>
    </div>
);

/* ─── Full Page ───────────────────────────────────────── */

const AllColors = () => (
    <div className="space-y-12 max-w-6xl relative">
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Color System</h2>
            <p className="text-muted-foreground mt-2">
                Semantic tokens that adapt to the current theme (Light/Dark).
                <br />
                These colors are used for specific UI elements and states.
                HEX values update automatically when switching themes.
            </p>
        </div>

        <div className="space-y-8">
            <h2 className="text-xl font-bold text-foreground">Semantic Tokens</h2>
            <SemanticColors />
        </div>

        <div className="space-y-8">
            <h2 className="text-xl font-bold text-foreground pt-8 border-t border-border">
                Raw Primitives
            </h2>
            <div className="grid gap-12">
                <PersonalizedColorScale />
                <ColorScale name="neutral" />
                <ColorScale name="slate" />
                <ColorScale name="gray" />
                <ColorScale name="zinc" />
                <ColorScale name="stone" />

                <ColorScale name="red" />
                <ColorScale name="orange" />
                <ColorScale name="amber" />
                <ColorScale name="yellow" />

                <ColorScale name="lime" />
                <ColorScale name="green" />
                <ColorScale name="emerald" />
                <ColorScale name="teal" />

                <ColorScale name="cyan" />
                <ColorScale name="sky" />
                <ColorScale name="blue" />
                <ColorScale name="indigo" />
                <ColorScale name="violet" />

                <ColorScale name="purple" />
                <ColorScale name="fuchsia" />
                <ColorScale name="pink" />
                <ColorScale name="rose" />
            </div>
        </div>
    </div>
);

const meta: Meta = {
    title: 'Foundations/Colors',
    component: AllColors,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <CssVarsProvider>
            <AllColors />
        </CssVarsProvider>
    ),
};
