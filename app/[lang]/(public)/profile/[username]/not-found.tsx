/**
 * Profile Not Found Page
 *
 * Shown when a profile username doesn't exist
 * or the profile is not publicly accessible.
 */

'use client';

import Link from 'next/link';
import { UserX } from 'lucide-react';
import { useTranslations, useTranslationContext } from '@/app/context/TranslationContext';

export default function ProfileNotFound() {
  const t = useTranslations('profile.public.notFound');
  const { locale } = useTranslationContext();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <div className="text-center">
        <UserX className="mx-auto h-24 w-24 text-muted-foreground" />

        <h1 className="mt-6 text-4xl font-bold text-foreground">
          {t('title')}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          {t('description')}
        </p>

        <div className="mt-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('backButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}
