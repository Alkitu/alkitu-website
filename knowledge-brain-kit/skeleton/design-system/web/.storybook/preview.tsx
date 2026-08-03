import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import '../app/globals.css';
import { ThemeProvider, useThemeEngine } from '../components/theme-provider';
import { BASE_COLORS, BRAND_COLORS, FONTS, RADIUS_OPTIONS, SPACING_OPTIONS, SHADOW_OPTIONS, TRANSITION_OPTIONS } from '../lib/theme-config';

// 1. Discover custom fonts
const customFontsGlob = import.meta.glob('../components/foundations/fonts/*.{ttf,otf,woff,woff2}', {
    query: '?url',
    import: 'default',
    eager: true,
});

const customFontsMap: Record<string, string> = {};
const customFontItems: { value: string; title: string }[] = [];

Object.entries(customFontsGlob).forEach(([path, url]) => {
    // Extract filename without extension: ../components/foundations/fonts/MyFont.ttf -> MyFont
    const name = path.split('/').pop()?.replace(/\.(ttf|otf|woff2?)$/, '') || 'Unknown';
    customFontsMap[name] = url as string;
    customFontItems.push({ value: name, title: `Custom: ${name}` });
});

// Merge static and custom fonts for Toolbar
const allFontItems = [
    ...FONTS.map(f => ({ value: f.name, title: f.name })),
    ...customFontItems.sort((a, b) => a.title.localeCompare(b.title))
];

// Component to sync Storybook globals with ThemeContext
const ThemeSync = ({ globals }: { globals: any }) => {
    const { setThemeConfig } = useThemeEngine();

    React.useEffect(() => {
        setThemeConfig({
            baseColor: globals.baseColor || 'neutral',
            brandColor: globals.brandColor || 'neutral',
            font: globals.font || 'Geist',
            radius: globals.radius ? parseFloat(globals.radius) : 0.5,
            spacing: globals.spacing ? parseFloat(globals.spacing) : 1.5,
            shadow: globals.shadow || 'md',
            transition: globals.transition ? parseInt(globals.transition, 10) : 200,
            customBrandHex: globals.customBrandHex || '#6366F1',
        });
    }, [globals, setThemeConfig]);

    return null;
};

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
            exclude: ['ref', 'key', 'style', 'className', 'asChild'],
        },
        // actions: { argTypesRegex: '^on[A-Z].*' },
        a11y: {
            test: 'todo',
        },
        layout: 'centered',
    },
    globalTypes: {
        theme: {
            description: 'Theme mode',
            defaultValue: 'light',
            toolbar: {
                title: 'Mode',
                icon: 'sun',
                items: [
                    { value: 'light', title: 'Light', icon: 'sun' },
                    { value: 'dark', title: 'Dark', icon: 'moon' },
                ],
                dynamicTitle: true,
            },
        },
        baseColor: {
            description: 'Base Neutral Color',
            defaultValue: 'neutral',
            toolbar: {
                title: 'Base',
                icon: 'circlehollow',
                items: BASE_COLORS.map(c => ({ value: c.value, title: c.name })),
                dynamicTitle: true,
            },
        },
        brandColor: {
            description: 'Theme/Primary Color',
            defaultValue: 'neutral',
            toolbar: {
                title: 'Theme',
                icon: 'paintbrush',
                items: BRAND_COLORS.map(c => ({ value: c.value, title: c.name })),
                dynamicTitle: true,
            },
        },
        font: {
            description: 'Font Family',
            defaultValue: 'Geist',
            toolbar: {
                title: 'Font',
                icon: 'paragraph',
                items: allFontItems,
                dynamicTitle: true,
            },
        },
        radius: {
            description: 'Border Radius',
            defaultValue: '0.5',
            toolbar: {
                title: 'Radius',
                icon: 'component',
                items: RADIUS_OPTIONS.map(r => ({ value: String(r.value), title: r.name })),
                dynamicTitle: true,
            },
        },
        spacing: {
            description: 'Component Spacing',
            defaultValue: '1.5',
            toolbar: {
                title: 'Spacing',
                icon: 'ruler',
                items: SPACING_OPTIONS.map(s => ({ value: String(s.value), title: s.name })),
                dynamicTitle: true,
            },
        },
        shadow: {
            description: 'Card Shadow Depth',
            defaultValue: 'md',
            toolbar: {
                title: 'Shadow',
                icon: 'mirror',
                items: SHADOW_OPTIONS.map(s => ({ value: s.value, title: s.name })),
                dynamicTitle: true,
            },
        },
        transition: {
            description: 'Transition Speed',
            defaultValue: '200',
            toolbar: {
                title: 'Motion',
                icon: 'timer',
                items: TRANSITION_OPTIONS.map(t => ({ value: String(t.value), title: t.name })),
                dynamicTitle: true,
            },
        },
        customBrandHex: {
            description: 'Custom HEX for Personalized theme',
            defaultValue: '#6366F1',
        },
    },
    decorators: [
        (Story, context) => {
            const theme = context.globals.theme || 'light';

            // Sync background color manually since we're unmounting/remounting or changing themes
            // next-themes handles the class, but we want to ensure the body bg is correct immediately
            // actually next-themes handles it via global css if class is present.

            return (
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    forcedTheme={theme}
                    customFonts={customFontsMap}
                >
                    <ThemeSync globals={context.globals} />
                    <Story />
                </ThemeProvider>
            );
        },
    ],
};

export default preview;
