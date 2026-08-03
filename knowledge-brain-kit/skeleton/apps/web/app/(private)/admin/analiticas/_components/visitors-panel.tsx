"use client";

import { useState } from "react";

import type { VisitorRow } from "@/lib/analytics/queries";
import {
  browserFromUa,
  countryName,
  deviceFromUa,
  flag,
} from "@/lib/analytics/format";

/** ID corto legible cuando el visitante aún no tiene nombre. */
function shortId(key: string): string {
  return `#${key.slice(0, 6)}`;
}

function fmtDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString("es") : "—";
}

/** Visitantes por página (la lista puede crecer mucho). */
const PAGE_SIZE = 25;

export function VisitorsPanel({ visitors }: { visitors: VisitorRow[] }) {
  const [rows, setRows] = useState(visitors);
  const [page, setPage] = useState(1);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageActual = Math.min(page, totalPages);
  const inicio = (pageActual - 1) * PAGE_SIZE;
  const pageRows = rows.slice(inicio, inicio + PAGE_SIZE);

  function startEdit(v: VisitorRow) {
    setEditKey(v.visitorKey);
    setDraft(v.label ?? "");
    setError(null);
  }

  async function save(visitorKey: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/visitors/label", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitorKey, label: draft }),
      });
      const data = (await res.json()) as { ok: boolean; label?: string | null };
      if (!res.ok || !data.ok) throw new Error("save-failed");
      setRows((prev) =>
        prev.map((r) =>
          r.visitorKey === visitorKey ? { ...r, label: data.label ?? null } : r,
        ),
      );
      setEditKey(null);
    } catch {
      setError("No se pudo guardar. Reintenta.");
    } finally {
      setSaving(false);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-neutral-600">
        Todavía no hay visitantes en este periodo.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-300/70">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-600">
          <tr>
            <th className="px-4 py-3 font-medium">Visitante</th>
            <th className="px-4 py-3 font-medium">Sesiones</th>
            <th className="px-4 py-3 font-medium">Visitas</th>
            <th className="px-4 py-3 font-medium">Países</th>
            <th className="px-4 py-3 font-medium">Última vez</th>
            <th className="px-4 py-3 font-medium">Dispositivo</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((v) => {
            const recurrente = v.sessions > 1;
            const editing = editKey === v.visitorKey;
            return (
              <tr key={v.visitorKey} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={draft}
                        disabled={saving}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") save(v.visitorKey);
                          if (e.key === "Escape") setEditKey(null);
                        }}
                        placeholder={shortId(v.visitorKey)}
                        maxLength={80}
                        className="w-40 rounded-lg border border-neutral-300 bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                      <button
                        type="button"
                        onClick={() => save(v.visitorKey)}
                        disabled={saving}
                        className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? "…" : "Guardar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditKey(null)}
                        disabled={saving}
                        className="text-xs text-neutral-600 hover:text-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(v)}
                        title="Renombrar visitante"
                        className="group inline-flex items-center gap-1.5 text-left"
                      >
                        <span
                          className={
                            v.label
                              ? "font-medium text-foreground"
                              : "font-mono text-neutral-600"
                          }
                        >
                          {v.label ?? shortId(v.visitorKey)}
                        </span>
                        <span className="text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                          editar
                        </span>
                      </button>
                      {recurrente && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                          Recurrente
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums">{v.sessions}</td>
                <td className="px-4 py-3 tabular-nums">{v.pageViews}</td>
                <td className="px-4 py-3">
                  {v.countries.length > 0
                    ? v.countries.map((c) => (
                        <span key={c} title={countryName(c)} className="mr-1">
                          {flag(c)}
                        </span>
                      ))
                    : "—"}
                  {v.lastCity ? (
                    <span className="ml-1 text-neutral-600">{v.lastCity}</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-neutral-600">{fmtDate(v.lastSeen)}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {deviceFromUa(v.ua)} · {browserFromUa(v.ua)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {error && <p className="px-4 py-3 text-sm text-destructive">{error}</p>}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600">
          <span className="tabular-nums">
            {inicio + 1}–{Math.min(inicio + PAGE_SIZE, rows.length)} de {rows.length} visitantes
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageActual <= 1}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium transition-colors hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="tabular-nums">
              Página {pageActual} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageActual >= totalPages}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium transition-colors hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
