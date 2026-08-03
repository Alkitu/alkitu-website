import { AlertTriangle, Check, Circle } from "lucide-react";

import { seoAudit, type Check as SeoCheck, type CheckStatus } from "@/lib/seo/audit";
import { AdminPageHeader } from "@brain/design-system-web/patterns/admin-page-header";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<CheckStatus, { box: string; icon: React.ReactNode; row: string }> = {
  ok: {
    box: "border-emerald-500 bg-emerald-500 text-white",
    icon: <Check className="h-3.5 w-3.5" strokeWidth={3} />,
    row: "",
  },
  warn: {
    box: "border-amber-500 bg-amber-500 text-white",
    icon: <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />,
    row: "",
  },
  fail: {
    box: "border-neutral-300 text-transparent",
    icon: <Circle className="h-3 w-3" />,
    row: "opacity-90",
  },
};

function ScoreTile({ label, score, sub }: { label: string; score: number; sub: string }) {
  const tone =
    score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-primary";
  return (
    <div className="rounded-2xl border border-neutral-300/70 p-6">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={`mt-2 font-bold leading-none tracking-[-0.04em] ${tone} text-[clamp(2.4rem,6vw,3.6rem)]`}>
        {score}
        <span className="text-[0.5em] text-neutral-400">%</span>
      </p>
      <p className="mt-2 text-sm text-neutral-400">{sub}</p>
    </div>
  );
}

function CheckRow({ c }: { c: SeoCheck }) {
  const s = STATUS_STYLE[c.status];
  return (
    <li className={`flex items-start gap-3 border-t border-neutral-200 py-4 ${s.row}`}>
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${s.box}`}
        aria-hidden
      >
        {s.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium leading-snug text-foreground">{c.label}</p>
        {c.hint ? <p className="mt-1 text-sm text-neutral-400">{c.hint}</p> : null}
      </div>
      <span className="mt-0.5 shrink-0 text-sm font-medium tabular-nums text-neutral-500">
        {c.value}
      </span>
    </li>
  );
}

export default async function AdminSeoPage() {
  const { checks, seoScore, geoScore } = await seoAudit();
  const seo = checks.filter((c) => c.group === "SEO");
  const geo = checks.filter((c) => c.group === "GEO");
  const okCount = checks.filter((c) => c.status === "ok").length;

  return (
    <>
      <AdminPageHeader
        title="SEO · GEO"
        description="KPIs de posicionamiento (buscadores) y de citabilidad por IA. Cada casilla se calcula contra el sitio real."
      />

      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <ScoreTile label="SEO" score={seoScore} sub={`${seo.filter((c) => c.status === "ok").length}/${seo.length} KPIs`} />
        <ScoreTile label="GEO" score={geoScore} sub={`${geo.filter((c) => c.status === "ok").length}/${geo.length} KPIs`} />
      </div>

      <p className="mt-6 text-sm text-neutral-400">
        {okCount}/{checks.length} KPIs cumplidos · verde = OK · ámbar = parcial · vacío = pendiente
      </p>

      <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-1 text-lg font-semibold tracking-tight">SEO</h2>
          <p className="mb-2 text-sm text-neutral-400">Que Google te encuentre y te indexe bien.</p>
          <ul>
            {seo.map((c) => (
              <CheckRow key={c.id} c={c} />
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold tracking-tight">GEO</h2>
          <p className="mb-2 text-sm text-neutral-400">Que ChatGPT, Perplexity y AI Overviews te citen.</p>
          <ul>
            {geo.map((c) => (
              <CheckRow key={c.id} c={c} />
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
