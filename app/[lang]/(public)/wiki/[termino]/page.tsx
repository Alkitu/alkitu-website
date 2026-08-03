import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale, i18n } from '@/i18n.config';
import TailwindGrid from '@/app/components/templates/grid';
import { Breadcrumbs } from '@/app/components/molecules/breadcrumbs';
import { getTerm, getTermSlugs, tituloDe, definicionDe, definedTermLd } from '@/lib/blog/wiki';
import { searchContent } from '@/lib/agent/content';

export const revalidate = 3600;

interface TermPageProps {
  params: Promise<{ lang: Locale; termino: string }>;
}

export async function generateStaticParams() {
  const slugs = await getTermSlugs();
  return i18n.locales.flatMap((lang) => slugs.map((termino) => ({ lang, termino })));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { lang, termino } = await params;
  const term = await getTerm(termino);
  if (!term) return { title: 'Term not found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';
  const titulo = tituloDe(term, lang as 'es' | 'en');

  return {
    title: titulo,
    description: definicionDe(term, lang as 'es' | 'en').slice(0, 155),
    alternates: {
      canonical: `${baseUrl}/${lang}/wiki/${term.slug}`,
      languages: {
        es: `${baseUrl}/es/wiki/${term.slug}`,
        en: `${baseUrl}/en/wiki/${term.slug}`,
        'x-default': `${baseUrl}/es/wiki/${term.slug}`,
      },
    },
  };
}

export default async function WikiTermPage({ params }: TermPageProps) {
  const { lang, termino } = await params;
  const term = await getTerm(termino);
  if (!term) notFound();

  const locale = lang as 'es' | 'en';
  const isEs = locale === 'es';
  const titulo = tituloDe(term, locale);
  const definicion = definicionDe(term, locale);

  // Posts that actually discuss the term, so a glossary entry is an entry point
  // into the content rather than a dead end.
  const mentions = (await searchContent(term.titulo, locale)).slice(0, 5);

  const schemas = [definedTermLd(term, locale)];

  const relationGroups: Array<{ label: string; items: typeof term.hiperonimos }> = [
    { label: isEs ? 'Concepto más amplio' : 'Broader concept', items: term.hiperonimos },
    { label: isEs ? 'Conceptos específicos' : 'Narrower concepts', items: term.hiponimos },
    { label: isEs ? 'Relacionados' : 'Related', items: term.relacionados },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Breadcrumbs
        locale={lang}
        items={[
          { label: isEs ? 'Inicio' : 'Home', href: '' },
          { label: isEs ? 'Glosario' : 'Glossary', href: '/wiki' },
          { label: titulo },
        ]}
      />

      <TailwindGrid>
        <article className="col-span-full py-12">
          <div className="mx-auto max-w-3xl px-6">
            {term.dominio && (
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                {term.dominio}
              </span>
            )}
            <h1 className="mt-2 text-4xl font-bold text-foreground">{titulo}</h1>

            {term.aliases.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {isEs ? 'También: ' : 'Also: '}
                {term.aliases.join(', ')}
              </p>
            )}

            {/* The definition leads, so it is the first thing a crawler or a
                language model extracts. */}
            <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
              <p className="text-lg leading-relaxed text-foreground">{definicion}</p>
            </div>

            {relationGroups.length > 0 && (
              <div className="mt-10 space-y-5">
                {relationGroups.map((group) => (
                  <div key={group.label}>
                    <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                      {group.label}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((ref) => (
                        <Link
                          key={ref.slug}
                          href={`/${lang}/wiki/${ref.slug}`}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20"
                        >
                          {ref.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mentions.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  {isEs ? 'Artículos que lo tratan' : 'Articles covering this'}
                </h2>
                <div className="space-y-3">
                  {mentions.map((hit) => (
                    <Link
                      key={hit.url}
                      href={hit.url}
                      className="block rounded-lg border border-border p-4 transition-colors hover:border-primary"
                    >
                      <h3 className="font-medium text-foreground">{hit.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {hit.fragmento}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12">
              <Link
                href={`/${lang}/wiki`}
                className="text-sm font-medium text-primary hover:underline"
              >
                ← {isEs ? 'Volver al glosario' : 'Back to the glossary'}
              </Link>
            </div>
          </div>
        </article>
      </TailwindGrid>
    </>
  );
}
