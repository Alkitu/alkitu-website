export const BASE_COLORS = [
    { name: 'Neutral', value: 'neutral' },
    { name: 'Slate', value: 'slate' },
    { name: 'Gray', value: 'gray' },
    { name: 'Zinc', value: 'zinc' },
    { name: 'Stone', value: 'stone' },
    { name: 'Black', value: 'black' },
] as const;

export const BRAND_COLORS = [
    { name: 'Neutral', value: 'neutral' },
    { name: 'Red', value: 'red' },
    { name: 'Orange', value: 'orange' },
    { name: 'Amber', value: 'amber' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Lime', value: 'lime' },
    { name: 'Green', value: 'green' },
    { name: 'Emerald', value: 'emerald' },
    { name: 'Teal', value: 'teal' },
    { name: 'Cyan', value: 'cyan' },
    { name: 'Sky', value: 'sky' },
    { name: 'Blue', value: 'blue' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Violet', value: 'violet' },
    { name: 'Purple', value: 'purple' },
    { name: 'Fuchsia', value: 'fuchsia' },
    { name: 'Pink', value: 'pink' },
    { name: 'Rose', value: 'rose' },
    { name: 'Personalized', value: 'personalized' },
] as const;

export const FONTS = [
    { name: 'Geist', value: 'var(--font-geist-sans)', class: 'font-sans', mono: 'var(--font-geist-mono)' },
    { name: 'Inter', value: 'Inter', class: 'font-inter', mono: 'Roboto Mono' },
    { name: 'Roboto', value: 'Roboto', class: 'font-roboto', mono: 'Roboto Mono' },
    { name: 'Open Sans', value: 'Open Sans', class: 'font-open-sans', mono: 'Roboto Mono' },
    { name: 'Lato', value: 'Lato', class: 'font-lato', mono: 'Roboto Mono' },
    { name: 'Montserrat', value: 'Montserrat', class: 'font-montserrat', mono: 'Roboto Mono' },
    { name: 'Poppins', value: 'Poppins', class: 'font-poppins', mono: 'Roboto Mono' },
    { name: 'Oswald', value: 'Oswald', class: 'font-oswald', mono: 'Roboto Mono' },
    { name: 'Raleway', value: 'Raleway', class: 'font-raleway', mono: 'Roboto Mono' },
    { name: 'Nunito', value: 'Nunito', class: 'font-nunito', mono: 'Roboto Mono' },
    { name: 'Playfair Display', value: 'Playfair Display', class: 'font-playfair', mono: 'Roboto Mono' },
    { name: 'Merriweather', value: 'Merriweather', class: 'font-merriweather', mono: 'Roboto Mono' },
    { name: 'Rubik', value: 'Rubik', class: 'font-rubik', mono: 'Roboto Mono' },
    { name: 'Work Sans', value: 'Work Sans', class: 'font-work-sans', mono: 'Roboto Mono' },
] as const;

export const RADIUS_OPTIONS = [
    { name: 'None', value: 0 },
    { name: 'XSmall', value: 0.125 },
    { name: 'Small', value: 0.25 },
    { name: 'Medium', value: 0.5 },
    { name: 'Large', value: 0.75 },
    { name: 'XLarge', value: 1.0 },
    { name: 'Rounded 2XL', value: 1.5 },
    { name: 'Rounded 3XL', value: 2.0 },
    { name: 'Rounded Full', value: 9999 },
] as const;

export const SPACING_OPTIONS = [
    { name: 'Compact', value: 1.0 },
    { name: 'Default', value: 1.5 },
    { name: 'Relaxed', value: 2.0 },
    { name: 'Spacious', value: 2.5 },
] as const;

export const SHADOW_OPTIONS = [
    { name: 'None', value: 'none' },
    { name: 'Subtle', value: 'sm' },
    { name: 'Default', value: 'md' },
    { name: 'Elevated', value: 'lg' },
    { name: 'Dramatic', value: 'xl' },
] as const;

export const TRANSITION_OPTIONS = [
    { name: 'Instant', value: 0 },
    { name: 'Fast', value: 100 },
    { name: 'Default', value: 200 },
    { name: 'Smooth', value: 300 },
    { name: 'Slow', value: 500 },
] as const;

export type ThemeConfig = {
    baseColor: typeof BASE_COLORS[number]['value'];
    brandColor: typeof BRAND_COLORS[number]['value'];
    font: string;
    radius: number;
    spacing: number;
    shadow: string;
    transition: number;
    customBrandHex?: string;
};

export const DEFAULT_THEME: ThemeConfig = {
    baseColor: 'neutral',
    brandColor: 'neutral',
    font: 'Geist',
    radius: 0.5,
    spacing: 1.5,
    shadow: 'md',
    transition: 200,
    customBrandHex: '#6366F1',
};
