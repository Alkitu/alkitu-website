import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getSeoAlternates } from '@/lib/seo';
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.privacyPolicyPage.title,
    description: text.privacyPolicyPage.metaDescription,
    alternates: getSeoAlternates(lang, '/privacy-policy'),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const t = text.privacyPolicyPage;

  return (
    <TailwindGrid fullSize>
      <article className="col-span-full lg:col-start-3 lg:col-end-11 px-6 py-16 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
          {t.lastUpdated}
        </p>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-10">
          {t.intro}
        </p>

        {/* Data Controller */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.dataController.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-2">
            {t.dataController.description}
          </p>
          <ul className="list-none space-y-1 text-base text-zinc-700 dark:text-zinc-300">
            <li><strong>{t.dataController.entity}</strong></li>
            <li>
              <a href={`mailto:${t.dataController.email}`} className="text-primary hover:underline">
                {t.dataController.email}
              </a>
            </li>
            <li>
              <a href={t.dataController.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {t.dataController.website}
              </a>
            </li>
          </ul>
        </section>

        {/* Data We Collect */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.dataWeCollect.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.dataWeCollect.description}
          </p>
          <div className="space-y-4">
            {t.dataWeCollect.items.map((item) => (
              <div key={item.title} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Basis */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.legalBasis.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.legalBasis.description}
          </p>
          <div className="space-y-3">
            {t.legalBasis.items.map((item) => (
              <div key={item.basis} className="flex gap-3">
                <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-primary" />
                <div>
                  <strong className="text-foreground">{item.basis}:</strong>{' '}
                  <span className="text-zinc-700 dark:text-zinc-300">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How We Use Your Data */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.howWeUse.title}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base text-zinc-700 dark:text-zinc-300">
            {t.howWeUse.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.dataSharing.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.dataSharing.description}
          </p>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    {lang === 'es' ? 'Servicio' : 'Service'}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    {lang === 'es' ? 'Propósito' : 'Purpose'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.dataSharing.items.map((item) => (
                  <tr key={item.service} className="border-t border-zinc-200 dark:border-zinc-700">
                    <td className="px-4 py-3 font-medium text-foreground">{item.service}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{item.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.dataRetention.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.dataRetention.description}
          </p>
          <ul className="list-disc list-inside space-y-2 text-base text-zinc-700 dark:text-zinc-300">
            {t.dataRetention.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.yourRights.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.yourRights.description}
          </p>
          <div className="space-y-3">
            {t.yourRights.items.map((item) => (
              <div key={item.right} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.right}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.dataSecurity.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.dataSecurity.description}
          </p>
        </section>

        {/* Children */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.children.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.children.description}
          </p>
        </section>

        {/* Changes */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.changes.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.changes.description}
          </p>
        </section>

        {/* Supervisory Authority */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.supervisoryAuthority.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.supervisoryAuthority.description}
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.contact.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.contact.description}
          </p>
          <p className="mt-2">
            <a
              href="mailto:info@alkitu.com"
              className="text-primary hover:underline"
            >
              info@alkitu.com
            </a>
          </p>
        </section>

        {/* Back link */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <Link
            href={`/${lang}`}
            className="text-primary hover:underline text-sm"
          >
            &larr; {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
        </div>
      </article>
    </TailwindGrid>
  );
}
