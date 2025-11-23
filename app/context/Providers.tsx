'use client';

import { ThemeProvider } from '@/app/context/ThemeContext';
import { TranslationsProvider } from '@/app/context/TranslationContext';
import { DropdownProvider } from '@/app/context/DropdownContext';
import { Locale } from '@/i18n.config';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  initialTranslations: any;
}

export default function Providers({ children, locale, initialTranslations }: ProvidersProps) {
  return (
    <ThemeProvider>
      <TranslationsProvider initialLocale={locale} initialTranslations={initialTranslations}>
        <DropdownProvider>
          {children}
        </DropdownProvider>
      </TranslationsProvider>
    </ThemeProvider>
  );
}
