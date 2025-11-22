export type Locale = 'es' | 'en';

export type Translations = Record<string, any>;

export interface TranslationsProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Translations;
}
