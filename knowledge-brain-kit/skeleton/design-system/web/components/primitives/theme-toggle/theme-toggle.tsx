"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
    /** Optional callback fired after theme mode changes */
    onThemeChange?: (mode: "light" | "dark") => void;
}

/**
 * ThemeToggle - Circular button to toggle between light and dark mode.
 *
 * Uses next-themes for theme management. Animated sun/moon icons
 * with SSR hydration safety.
 */
function ThemeToggle({ onThemeChange }: ThemeToggleProps = {}) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newMode = isDark ? "light" : "dark";
        setTheme(newMode);
        onThemeChange?.(newMode);
    };

    // Prevent rendering until mounted on the client to avoid hydration mismatch
    if (!mounted) {
        return (
            <button
                className="cursor-pointer relative w-10 h-10 rounded-full border border-primary bg-transparent text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center group"
                aria-label="Toggle theme"
                disabled
                data-slot="theme-toggle"
            >
                <Sun className="absolute w-5 h-5 text-current opacity-0" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="cursor-pointer relative w-10 h-10 rounded-full border border-primary bg-transparent text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center group"
            aria-label={
                isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            suppressHydrationWarning
            data-slot="theme-toggle"
        >
            {/* Sun - visible in dark mode */}
            <Sun
                className={`absolute w-5 h-5 text-current transition-all duration-300 ${
                    isDark
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-0"
                }`}
            />

            {/* Moon - visible in light mode */}
            <Moon
                className={`absolute w-5 h-5 text-current transition-all duration-300 ${
                    !isDark
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-0"
                }`}
            />
        </button>
    );
}
ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
export type { ThemeToggleProps };
