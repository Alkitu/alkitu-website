import { Metadata } from 'next';
import Link from 'next/link';
import { Locale } from '@/i18n.config';
import { getSeoAlternates } from '@/lib/seo';
import TailwindGrid from '@/app/components/templates/grid';
import { getTerms, tituloDe, definicionDe } from '@/lib/blog/wiki';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Glosario' : 'Glossary',
    description:
      lang === 'es'
        ? 'Definiciones de los conceptos que usamos en marketing, diseño y desarrollo.'
        : 'Definitions of the concepts we use across marketing, design and development.',
    alternates: getSeoAlternates(lang, '/wiki'),
  };
}

export default async function WikiIndexPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const terms = await getTerms();
  const isEs = lang === 'es';

  // Group by domain so the glossary reads as a taxonomy rather than a flat list.
  const byDomain = new Map<string, typeof terms>();
  for (const term of terms) {
    const key = term.dominio ?? (isEs ? 'General' : 'General');
    byDomain.set(key, [...(byDomain.get(key) ?? []), term]);
  }

  return (
    <TailwindGrid>
      <section className="col-span-full py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold text-foreground">
            {isEs ? 'Glosario' : 'Glossary'}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isEs
              ? 'Definiciones canónicas de los conceptos que aparecen en el blog.'
              : 'Canonical definitions of the concepts referenced across the blog.'}
          </p>

          {terms.length === 0 ? (
            <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">
                {isEs ? 'Todavía no hay términos publicados.' : 'No published terms yet.'}
              </p>
            </div>
          ) : (
            <div className="mt-12 space-y-12">
              {[...byDomain.entries()].map(([domain, group]) => (
                <div key={domain}>
                  <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-primary">
                    {domain}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {group.map((term) => (
                      <Link
                        key={term.slug}
                        href={`/${lang}/wiki/${term.slug}`}
                        className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
                      >
                        <h3 className="font-semibold text-foreground">
                          {tituloDe(term, lang as 'es' | 'en')}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {definicionDe(term, lang as 'es' | 'en')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </TailwindGrid>
  );
}
