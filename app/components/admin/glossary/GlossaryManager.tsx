'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Loader2, Search, Save, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { StringListInput } from '@/app/components/admin/blog/StringListInput';
import { checkGlossaryContract } from '@/lib/schemas/glossary';

interface TermRef {
  nombre: string;
  slug: string;
}

interface Term {
  id?: string;
  slug: string;
  titulo_es: string;
  titulo_en: string | null;
  definicion_es: string;
  definicion_en: string | null;
  dominio: string | null;
  pilar: string | null;
  aliases: string[];
  campo_semantico: string[];
  hiperonimos: TermRef[];
  hiponimos: TermRef[];
  relacionados: TermRef[];
  geo_respuesta_corta: string | null;
  estado: 'borrador' | 'revisar' | 'completo';
  published: boolean;
}

const EMPTY: Term = {
  slug: '',
  titulo_es: '',
  titulo_en: null,
  definicion_es: '',
  definicion_en: null,
  dominio: null,
  pilar: null,
  aliases: [],
  campo_semantico: [],
  hiperonimos: [],
  hiponimos: [],
  relacionados: [],
  geo_respuesta_corta: null,
  estado: 'borrador',
  published: false,
};

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Editor for a taxonomy relation list ({nombre, slug} pairs). */
function RelationInput({
  label,
  hint,
  values,
  options,
  onChange,
}: {
  label: string;
  hint: string;
  values: TermRef[];
  options: Term[];
  onChange: (v: TermRef[]) => void;
}) {
  const available = options.filter((o) => !values.some((v) => v.slug === o.slug));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        <span className="ml-2 text-xs text-muted-foreground">({values.length})</span>
      </label>
      <p className="text-xs text-muted-foreground">{hint}</p>

      <div className="flex flex-wrap gap-2">
        {values.map((ref) => (
          <span
            key={ref.slug}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
          >
            {ref.nombre}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v.slug !== ref.slug))}
              aria-label={`Quitar ${ref.nombre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <select
        value=""
        onChange={(e) => {
          const match = options.find((o) => o.slug === e.target.value);
          if (match) onChange([...values, { nombre: match.titulo_es, slug: match.slug }]);
        }}
        className={inputClass}
        disabled={!available.length}
      >
        <option value="">
          {available.length ? 'Añadir término…' : 'No hay más términos disponibles'}
        </option>
        {available.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.titulo_es}
          </option>
        ))}
      </select>
    </div>
  );
}

export function GlossaryManager() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Term | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/admin/glossary?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Error');
      setTerms(json.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error loading terms');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const findings = editing ? checkGlossaryContract(editing) : [];
  const errors = findings.filter((f) => f.level === 'error');

  const save = async (publish?: boolean) => {
    if (!editing) return;
    const payload = { ...editing, published: publish ?? editing.published };

    if (payload.published && errors.length) {
      toast.error('No se puede publicar con errores pendientes.');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(
        isNew ? '/api/admin/glossary' : `/api/admin/glossary/${editing.id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        const details = json.error?.details;
        toast.error(
          Array.isArray(details) && details.length
            ? details.map((d: { message: string }) => d.message).join(' · ')
            : json.error?.message || 'Error al guardar'
        );
        return;
      }

      toast.success(isNew ? 'Término creado' : 'Término actualizado');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (term: Term) => {
    try {
      const res = await fetch(`/api/admin/glossary/${term.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !term.published }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        const details = json.error?.details;
        toast.error(
          Array.isArray(details) && details.length
            ? details.map((d: { message: string }) => d.message).join(' · ')
            : json.error?.message || 'Error'
        );
        return;
      }
      toast.success(term.published ? 'Término despublicado' : 'Término publicado');
      load();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const remove = async (term: Term) => {
    if (!confirm(`¿Eliminar "${term.titulo_es}"?`)) return;
    try {
      const res = await fetch(`/api/admin/glossary/${term.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Error');
      toast.success('Término eliminado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  if (editing) {
    const isNew = !editing.id;
    const set = <K extends keyof Term>(k: K, v: Term[K]) =>
      setEditing((prev) => (prev ? { ...prev, [k]: v } : prev));

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {isNew ? 'Nuevo término' : editing.titulo_es}
          </h1>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            Volver
          </button>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            Publicar un término hace que su título y sus alias se enlacen automáticamente en
            la primera mención dentro de cada artículo del blog. Alias demasiado genéricos
            afectan a todo el sitio.
          </p>
        </div>

        {errors.length > 0 && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <ul className="space-y-1 text-xs text-muted-foreground">
              {errors.map((f, i) => (
                <li key={i}>
                  <span className="font-medium text-foreground">{f.field}</span>: {f.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Título (ES) *</label>
            <input
              type="text"
              value={editing.titulo_es}
              onChange={(e) => {
                set('titulo_es', e.target.value);
                if (isNew && !editing.slug) set('slug', slugify(e.target.value));
              }}
              className={inputClass}
              placeholder="Certificado SSL"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Título (EN)</label>
            <input
              type="text"
              value={editing.titulo_en ?? ''}
              onChange={(e) => set('titulo_en', e.target.value || null)}
              className={inputClass}
              placeholder="SSL Certificate"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Slug *</label>
            <input
              type="text"
              value={editing.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Dominio</label>
            <input
              type="text"
              value={editing.dominio ?? ''}
              onChange={(e) => set('dominio', e.target.value || null)}
              className={inputClass}
              placeholder="Desarrollo Web"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Definición (ES) *</label>
            <textarea
              value={editing.definicion_es}
              onChange={(e) => set('definicion_es', e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Definición autocontenida y citable."
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Definición (EN)</label>
            <textarea
              value={editing.definicion_en ?? ''}
              onChange={(e) => set('definicion_en', e.target.value || null)}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <StringListInput
          label="Alias"
          hint="Otras formas de nombrarlo. También se enlazan automáticamente (mínimo 3 caracteres)."
          values={editing.aliases}
          onChange={(v) => set('aliases', v)}
          placeholder="certificado TLS"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <RelationInput
            label="Hiperónimos"
            hint="Conceptos más amplios que este."
            values={editing.hiperonimos}
            options={terms.filter((t) => t.slug !== editing.slug)}
            onChange={(v) => set('hiperonimos', v)}
          />
          <RelationInput
            label="Hipónimos"
            hint="Conceptos más específicos."
            values={editing.hiponimos}
            options={terms.filter((t) => t.slug !== editing.slug)}
            onChange={(v) => set('hiponimos', v)}
          />
          <RelationInput
            label="Relacionados"
            hint="Términos vinculados sin jerarquía."
            values={editing.relacionados}
            options={terms.filter((t) => t.slug !== editing.slug)}
            onChange={(v) => set('relacionados', v)}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Respuesta corta (GEO)</label>
            <textarea
              value={editing.geo_respuesta_corta ?? ''}
              onChange={(e) => set('geo_respuesta_corta', e.target.value || null)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving || errors.length > 0}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            Publicar
          </button>
        </div>
      </form>
    );
  }

  const published = terms.filter((t) => t.published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Glosario</h1>
          <p className="mt-2 text-muted-foreground">
            {terms.length} términos · {published} publicados
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo término
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar término…"
          className={`${inputClass} pl-9`}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : terms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Aún no hay términos. Al publicar el primero, sus menciones en el blog se
            enlazarán automáticamente.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {terms.map((term) => (
            <div key={term.id} className="flex items-center gap-4 p-4 hover:bg-secondary/40">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-foreground">{term.titulo_es}</h3>
                  {term.dominio && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                      {term.dominio}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      term.published
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {term.published ? 'Publicado' : term.estado}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  /wiki/{term.slug} · {term.definicion_es}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {term.published && (
                  <a
                    href={`/es/wiki/${term.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => togglePublished(term)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {term.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(term)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(term)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
