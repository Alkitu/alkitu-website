"use client";

import { useTranslationContext } from "../context/TranslationContext";

/**
 * Hook to generate localized paths
 * @example
 * const localizedPath = useLocalizedPath();
 * <Link href={localizedPath('/projects')}> // Returns '/en/projects' or '/es/projects'
 */
export function useLocalizedPath() {
  const { locale } = useTranslationContext();

  return (path: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${locale}/${cleanPath}`;
  };
}
