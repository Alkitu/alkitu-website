import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import en from '@/app/dictionaries/en.json';
import es from '@/app/dictionaries/es.json';

const translations = {
  en,
  es,
} as const;

/**
 * Schema for language parameter validation
 */
const LanguageSchema = z.enum(['en', 'es']);

/**
 * GET /api/translations?lang=en
 * Get translations for a specific language
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang');

    // Validate language parameter
    const validationResult = LanguageSchema.safeParse(lang);

    if (!validationResult.success) {
      return ApiError.badRequest(
        `Invalid language parameter. Must be one of: ${LanguageSchema.options.join(', ')}`
      );
    }

    const validatedLang = validationResult.data;

    return ApiSuccess.ok(
      { translations: translations[validatedLang] },
      'Translations retrieved successfully'
    );
  } catch (error) {
    console.error('Translations API error:', error);
    return ApiError.internal('Failed to retrieve translations', error);
  }
}
