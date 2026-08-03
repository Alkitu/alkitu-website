import Link from "next/link";

import { AnalyticsMap } from "@brain/design-system-web/integrations/maps/analytics-map";

import { getAnalytics } from "@/lib/analytics/queries";
import {
  browserFromUa,
  countryName,
  deviceFromUa,
  flag,
  fmtSeconds,
} from "@/lib/analytics/format";
import { AdminPageHeader } from "@brain/design-system-web/patterns/admin-page-header";
import { VisitorsPanel } from "./_components/visitors-panel";

export const dynamic = "force-dynamic";

const RANGOS = [
  { dias: 7, label: "7 días" },
  { dias: 30, label: "30 días" },
  { dias: 90, label: "90 días" },
];

function pretty(path: string): string {
  return path.length > 42 ? path.slice(0, 41) + "…" : path;
}

export default async function AnaliticasPage({
  searchParams,
}: {
  searchParams: Promise<{ rango?: string }>;
}) {
  const sp = await searchParams;
  const dias = RANGOS.some((r) => String(r.dias) === sp.rango)
    ? Number(sp.rango)
    : 30;
  const d = await getAnalytics(dias);

  const kpis = [
    { label: "Visitas", value: d.overview.pageViews, nota: "páginas vistas" },
    { label: "Visitantes", value: d.overview.uniques, nota: "únicos (aprox.)" },
    { label: "Sesiones", value: d.overview.sessions, nota: "en el periodo" },
    { label: "Tiempo medio", value: fmtSeconds(d.overview.avgSeconds), nota: "por página" },
  ];

  const maxSerie = Math.max(1, ...d.serie.map((p) => p.views));

  return (
    <>
      <AdminPageHeader
        title="Analíticas"
        description="Analítica propia, cookieless. Visitas, visitantes únicos, países y las páginas más abiertas por sección."
        actions={
          <div className="flex items-center gap-1 rounded-full border border-neutral-300/70 p-1">
            {RANGOS.map((r) => {
              const active = r.dias === dias;
              return (
                <Link
                  key={r.dias}
                  href={`/admin/analiticas?rango=${r.dias}`}
                  className={[
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "text-neutral-600 hover:text-foreground",
                  ].join(" ")}
                >
                  {r.label}
                </Link>
              );
            })}
          </div>
        }
      />

      {!d.hayDatos ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <p className="text-[15px] text-neutral-500">
            Sin datos de tráfico en este periodo todavía. Navega el sitio (fuera
            de <code>/admin</code>) para empezar a registrar visitas.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {/* Mapa mundial de visitas (lo principal) */}
          <section>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Mapa de visitas
            </h2>
            <AnalyticsMap points={d.geoPoints} className="h-[420px] w-full md:h-[540px]" />
            <p className="mt-3 text-sm text-neutral-500">
              Un punto por ubicación, escalado por número de visitas. Ciudad cuando
              hay geolocalización de Vercel; si no, aproximado al centro del país.
              Haz clic en un punto para ver el detalle.
            </p>
          </section>

          {/* Visitantes (clave estable — nómbralos para reconocer recurrentes) */}
          <section>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Visitantes
            </h2>
            <VisitorsPanel visitors={d.visitors} />
            <p className="mt-3 text-sm text-neutral-500">
              Mismo dispositivo y red = misma clave estable (sin almacenar la IP en
              claro). Ponles un nombre para reconocer quién vuelve.
            </p>
          </section>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="border-t border-neutral-300/70 pt-5">
                <p className="font-bold leading-none tracking-[-0.04em] text-primary text-[clamp(1.9rem,4vw,3rem)]">
                  {k.value}
                </p>
                <p className="mt-4 text-[15px] font-medium text-foreground">{k.label}</p>
                <p className="mt-1 text-sm text-neutral-400">{k.nota}</p>
              </div>
            ))}
          </div>

          {/* Serie temporal (barras CSS) */}
          <section>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Visitas por día
            </h2>
            <div className="flex h-40 items-end gap-1">
              {d.serie.map((p) => (
                <div
                  key={p.day}
                  className="group flex h-full flex-1 items-end"
                  title={`${p.day}: ${p.views} vistas · ${p.uniques} únicos`}
                >
                  <div
                    className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
                    style={{ height: `${Math.max(3, (p.views / maxSerie) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-neutral-400">
              <span>{d.serie[0]?.day ?? ""}</span>
              <span>{d.serie[d.serie.length - 1]?.day ?? ""}</span>
            </div>
          </section>

          {/* Top por sección: páginas + países */}
          <section>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Top por sección
            </h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {d.secciones.map((s) => (
                <div key={s.section} className="rounded-2xl border border-neutral-300/70 p-5">
                  <div className="mb-4 flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">{s.label}</h3>
                    <span className="text-sm text-neutral-400">{s.total} vistas</span>
                  </div>
                  <ol className="space-y-2">
                    {s.pages.map((p) => (
                      <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate text-neutral-600">{pretty(p.path)}</span>
                        <span className="shrink-0 font-medium tabular-nums">{p.views}</span>
                      </li>
                    ))}
                  </ol>
                  {s.countries.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-200 pt-3 text-sm text-neutral-500">
                      {s.countries.map((c) => (
                        <span key={c.country} title={countryName(c.country)}>
                          {flag(c.country)} {c.n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Países + Referrers */}
          <div className="grid gap-10 lg:grid-cols-2">
            <section>
              <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
                Países
              </h2>
              {d.paises.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  Sin país (se resuelve por geo-IP en Vercel; en local no llega).
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {d.paises.map((c) => (
                    <li key={c.country} className="flex items-center justify-between gap-3 text-[15px]">
                      <span className="min-w-0 truncate">
                        {flag(c.country)} {countryName(c.country)}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">{c.n}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
                Fuentes (referrers)
              </h2>
              {d.referrers.length === 0 ? (
                <p className="text-sm text-neutral-400">Sin referrers externos aún.</p>
              ) : (
                <ul className="space-y-2.5">
                  {d.referrers.map((r) => (
                    <li key={r.referrer} className="flex items-center justify-between gap-3 text-[15px]">
                      <span className="min-w-0 truncate text-neutral-600">{r.referrer}</span>
                      <span className="shrink-0 font-medium tabular-nums">{r.n}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Eventos de contacto (atribución) */}
          {d.contactos.length > 0 && (
            <section>
              <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
                Contactos — desde qué página
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-neutral-300/70">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 text-neutral-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Cuándo</th>
                      <th className="px-4 py-3 font-medium">Nombre</th>
                      <th className="px-4 py-3 font-medium">Desde</th>
                      <th className="px-4 py-3 font-medium">País</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.contactos.map((c, i) => (
                      <tr key={i} className="border-b border-neutral-100 last:border-0">
                        <td className="px-4 py-3 text-neutral-500">
                          {c.at ? new Date(c.at).toLocaleString("es") : "—"}
                        </td>
                        <td className="px-4 py-3">{c.name ?? "—"}</td>
                        <td className="px-4 py-3 text-neutral-600">{c.fromPath ?? "—"}</td>
                        <td className="px-4 py-3">{flag(c.country)} {countryName(c.country)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Sesiones recientes */}
          <section>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Sesiones recientes
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-neutral-300/70">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 text-neutral-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Inicio</th>
                    <th className="px-4 py-3 font-medium">Entró por</th>
                    <th className="px-4 py-3 font-medium">Vistas</th>
                    <th className="px-4 py-3 font-medium">Dispositivo</th>
                    <th className="px-4 py-3 font-medium">País</th>
                  </tr>
                </thead>
                <tbody>
                  {d.sesiones.map((s, i) => (
                    <tr key={i} className="border-b border-neutral-100 last:border-0">
                      <td className="px-4 py-3 text-neutral-500">
                        {s.startedAt ? new Date(s.startedAt).toLocaleString("es") : "—"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{s.entryPath ?? "—"}</td>
                      <td className="px-4 py-3 tabular-nums">{s.views}</td>
                      <td className="px-4 py-3 text-neutral-600">
                        {deviceFromUa(s.ua)} · {browserFromUa(s.ua)}
                      </td>
                      <td className="px-4 py-3">{flag(s.country)} {countryName(s.country)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
