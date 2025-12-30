"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { Translations, TranslationsProviderProps, Locale } from "../types/translations";

interface TranslationsContextType {
  t: (key: string, params?: Record<string, string | number>, namespace?: string) => string;
  translations: Translations;
  locale: Locale;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export function TranslationsProvider({
  children,
  initialLocale,
  initialTranslations,
}: TranslationsProviderProps) {
  const translations = initialTranslations;
  const locale = initialLocale;

  const t = useCallback(
    (key: string, params?: Record<string, string | number>, namespace?: string): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const keys = fullKey.split(".");
      let current: Record<string, unknown> | unknown = translations;

      for (const k of keys) {
        if (typeof current !== 'object' || current === null || !(k in current)) {
          console.warn(`Translation key not found: ${fullKey}`);
          return fullKey;
        }
        current = (current as Record<string, unknown>)[k];
      }

      if (typeof current !== "string") {
        console.warn(`Invalid translation key: ${fullKey}`);
        return fullKey;
      }

      if (params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, paramValue]) =>
            acc.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue)),
          current
        );
      }

      return current;
    },
    [translations]
  );

  const contextValue = useMemo(
    () => ({ t, translations, locale }),
    [t, translations, locale]
  );

  return (
    <TranslationsContext.Provider value={contextValue}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error("useTranslations must be used within a TranslationsProvider");
  }

  if (namespace) {
    return (key: string, params?: Record<string, string | number>) =>
      context.t(key, params, namespace);
  }

  return context.t;
}

export function useTranslationContext() {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error("useTranslationContext must be used within a TranslationsProvider");
  }
  return context;
}
