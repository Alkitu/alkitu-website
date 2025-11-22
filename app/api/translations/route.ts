import { NextResponse } from 'next/server';
import en from '@/app/dictionaries/en.json';
import es from '@/app/dictionaries/es.json';

const translations = {
  en,
  es,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') as 'en' | 'es';

  if (!lang || !translations[lang]) {
    return NextResponse.json(
      { error: 'Invalid language parameter' },
      { status: 400 }
    );
  }

  return NextResponse.json(translations[lang]);
}
