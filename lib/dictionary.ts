import type { Locale } from '@/i18n.config'
import en from '@/app/dictionaries/en.json'
import es from '@/app/dictionaries/es.json'

const dictionaries = {
  en,
  es
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]