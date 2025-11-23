'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COOKIE_NAME = 'theme';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Detectar el tema del sistema
  const getSystemTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Inicializar el tema desde cookie o detectar sistema en primera visita
  useEffect(() => {
    setMounted(true);
    const savedTheme = getCookie(COOKIE_NAME) as Theme | undefined;

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      // Cookie existe - usar ese valor
      setTheme(savedTheme);
      setResolvedTheme(savedTheme);
    } else {
      // Primera visita - detectar tema del sistema y guardarlo en cookie
      const systemTheme = getSystemTheme();
      setTheme(systemTheme);
      setResolvedTheme(systemTheme);
      setCookie(COOKIE_NAME, systemTheme, {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'strict',
      });
    }
  }, []);

  // Aplicar el tema al documento cuando cambie
  useEffect(() => {
    if (!mounted) return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setResolvedTheme(theme);
  }, [theme, mounted]);

  // Guardar el tema en cookie cuando el usuario lo cambie
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setCookie(COOKIE_NAME, newTheme, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'strict',
    });
  };

  // Siempre proveer el contexto, incluso antes de montar
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  // Durante SSR o si el provider no está disponible, retornar valores por defecto
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // Durante SSR, retornar valores por defecto
      return {
        theme: 'light' as Theme,
        setTheme: () => {},
        resolvedTheme: 'light' as 'light' | 'dark',
      };
    }
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
