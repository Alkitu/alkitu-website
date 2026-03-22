import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.cookiePolicyPage.title,
    description: text.cookiePolicyPage.metaDescription,
  };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const t = text.cookiePolicyPage;

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

        {/* What Are Cookies */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.whatAreCookies.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.whatAreCookies.description}
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.howWeUse.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            {t.howWeUse.description}
          </p>

          {/* Necessary Cookies */}
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t.necessaryCookies.title}
          </h3>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.necessaryCookies.description}
          </p>
          <CookieTable
            cookies={t.necessaryCookies.cookies}
            headers={t.tableHeaders}
          />

          {/* Analytics Cookies */}
          <h3 className="text-lg font-medium text-foreground mt-8 mb-2">
            {t.analyticsCookies.title}
          </h3>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            {t.analyticsCookies.description}
          </p>
          <CookieTable
            cookies={t.analyticsCookies.cookies}
            headers={t.tableHeaders}
          />
        </section>

        {/* How to Manage Cookies */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t.manageCookies.title}
          </h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
            {t.manageCookies.description}
          </p>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t.manageCookies.browserSettings}
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

function CookieTable({
  cookies,
  headers,
}: {
  cookies: { name: string; purpose: string; duration: string; type: string }[];
  headers: { name: string; purpose: string; duration: string; type: string };
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-100 dark:bg-zinc-800">
            <th className="text-left px-4 py-3 font-medium text-foreground">{headers.name}</th>
            <th className="text-left px-4 py-3 font-medium text-foreground">{headers.purpose}</th>
            <th className="text-left px-4 py-3 font-medium text-foreground">{headers.duration}</th>
            <th className="text-left px-4 py-3 font-medium text-foreground">{headers.type}</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie) => (
            <tr
              key={cookie.name}
              className="border-t border-zinc-200 dark:border-zinc-700"
            >
              <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                {cookie.name}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                {cookie.purpose}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                {cookie.duration}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                {cookie.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
