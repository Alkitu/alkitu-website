'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Loader2,
  Save,
  X as XIcon,
  AlertTriangle,
  AlertCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { GeoQAManager } from './GeoQAManager';
import { StringListInput } from './StringListInput';
import { checkContract, type ContractFinding } from '@/lib/schemas/blog';

type TabId = 'contenido' | 'seo' | 'geo' | 'taxonomia';

const TABS: Array<{ id: TabId; label: string; hint: string }> = [
  { id: 'contenido', label: 'Contenido', hint: 'Cuerpo, portada, autor' },
  { id: 'seo', label: 'SEO', hint: 'Capa 2 · título, meta, keyword' },
  { id: 'geo', label: 'GEO', hint: 'Capa 3 · respuesta corta, FAQ' },
  { id: 'taxonomia', label: 'Taxonomía', hint: 'Capa 1 y 4 · relaciones, sitemap' },
];

export interface BlogFormState {
  id?: string;
  title: string;
  slug: string;
  locale: 'en' | 'es';
  categoria: string;
  canonical: string | null;
  titulo_seo: string | null;
  metadescripcion: string | null;
  keyword_principal: string | null;
  keywords_secundarias: string[];
  tags: string[];
  intencion_busqueda: string | null;
  geo_preguntas: string[];
  geo_respuestas: string[];
  geo_respuesta_corta: string | null;
  geo_entidades: string[];
  schema_tipo: string;
  prioridad: number;
  frecuencia_cambio: string;
  body_mdx: string;
  extracto: string | null;
  portada: string | null;
  portada_alt: string | null;
  portada_credito: string | null;
  lectura: string | null;
  autor: string | null;
  autor_rol: string | null;
  author_username: string | null;
  aliases: string[];
  campo_semantico: string[];
  relacionado: string[];
  featured: boolean;
  estado: 'borrador' | 'revisar' | 'completo';
  published: boolean;
  categoria_slug?: string;
}

export const EMPTY_POST: BlogFormState = {
  title: '',
  slug: '',
  locale: 'es',
  categoria: '',
  canonical: null,
  titulo_seo: null,
  metadescripcion: null,
  keyword_principal: null,
  keywords_secundarias: [],
  tags: [],
  intencion_busqueda: 'informacional',
  geo_preguntas: [],
  geo_respuestas: [],
  geo_respuesta_corta: null,
  geo_entidades: [],
  schema_tipo: 'Article',
  prioridad: 0.7,
  frecuencia_cambio: 'yearly',
  body_mdx: '',
  extracto: null,
  portada: null,
  portada_alt: null,
  portada_credito: null,
  lectura: null,
  autor: null,
  autor_rol: null,
  author_username: null,
  aliases: [],
  campo_semantico: [],
  relacionado: [],
  featured: false,
  estado: 'borrador',
  published: false,
};

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/** Character counter that turns amber outside the contract's range. */
function CharCount({ value, min, max }: { value: string; min?: number; max: number }) {
  const n = value.length;
  const off = n > max || (min !== undefined && n > 0 && n < min);
  return (
    <span className={`text-xs ${off ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
      {n}
      {min !== undefined ? ` (ideal ${min}–${max})` : ` / ${max}`}
    </span>
  );
}

interface BlogEditorProps {
  initial?: BlogFormState;
}

export function BlogEditor({ initial }: BlogEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const adminLocale = pathname.split('/')[1] || 'es';

  const [form, setForm] = useState<BlogFormState>(initial ?? EMPTY_POST);
  const [activeTab, setActiveTab] = useState<TabId>('contenido');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<{ html: string | null; error?: string } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isNew = !form.id;

  const set = <K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Contract findings recomputed locally with the same module the API and the
  // CLI gate use, so the editor never disagrees with what the server will do.
  const findings: ContractFinding[] = useMemo(() => checkContract(form), [form]);
  const errors = findings.filter((f) => f.level === 'error');
  const warnings = findings.filter((f) => f.level === 'warning');

  const loadPreview = useCallback(async () => {
    if (!form.body_mdx.trim()) {
      setPreview({ html: '', error: undefined });
      return;
    }
    setPreviewing(true);
    try {
      const res = await fetch('/api/admin/blog/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: form.body_mdx }),
      });
      const json = await res.json();
      if (json.success) setPreview(json.data);
    } catch {
      setPreview({ html: null, error: 'No se pudo generar la vista previa.' });
    } finally {
      setPreviewing(false);
    }
  }, [form.body_mdx]);

  useEffect(() => {
    if (!showPreview) return;
    const t = setTimeout(loadPreview, 600);
    return () => clearTimeout(t);
  }, [showPreview, loadPreview]);

  const save = async (publish?: boolean) => {
    const payload = { ...form, published: publish ?? form.published };

    if (payload.published && errors.length) {
      toast.error('No se puede publicar con errores del contrato pendientes.');
      setActiveTab(errors[0].field.startsWith('geo') ? 'geo' : 'seo');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(isNew ? '/api/admin/blog' : `/api/admin/blog/${form.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        const details = json.error?.details;
        if (Array.isArray(details) && details.length) {
          toast.error(details.map((d: { message: string }) => d.message).join(' · '));
        } else {
          toast.error(json.error?.message || 'Error al guardar');
        }
        return;
      }

      toast.success(isNew ? 'Post creado' : 'Cambios guardados');
      if (isNew) {
        router.push(`/${adminLocale}/admin/blog/${json.data.id}`);
      } else {
        setForm((prev) => ({ ...prev, published: json.data.published }));
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">
            {isNew ? 'Nuevo post' : form.title || 'Editar post'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {form.locale.toUpperCase()} · /{form.locale}/blog/
            {form.categoria_slug ?? slugify(form.categoria || 'categoria')}/{form.slug || 'slug'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && form.published && (
            <a
              href={`/${form.locale}/blog/${form.categoria_slug}/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
            >
              <ExternalLink className="h-4 w-4" />
              Ver
            </a>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              form.published
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {form.published ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>

      {/* Contract status */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div
          className={`rounded-lg border p-4 ${
            errors.length ? 'border-destructive/40 bg-destructive/5' : 'border-amber-500/40 bg-amber-500/5'
          }`}
        >
          <div className="flex items-center gap-2">
            {errors.length ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
            <span className="text-sm font-medium text-foreground">
              {errors.length
                ? `${errors.length} error(es) impiden publicar`
                : `${warnings.length} recomendación(es) del contrato`}
            </span>
          </div>
          <ul className="mt-2 space-y-1 pl-6 text-xs text-muted-foreground">
            {[...errors, ...warnings].slice(0, 6).map((f, i) => (
              <li key={i} className="list-disc">
                <span className="font-medium text-foreground">{f.field}</span>: {f.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex flex-wrap gap-6" aria-label="Secciones del contrato">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              }`}
              title={tab.hint}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* CONTENIDO */}
      {activeTab === 'contenido' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-foreground">Título *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  set('title', e.target.value);
                  if (isNew && !form.slug) set('slug', slugify(e.target.value));
                }}
                className={inputClass}
                placeholder="El problema que resuelve el artículo"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                className={inputClass}
                placeholder="mi-articulo"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Idioma *</label>
              <select
                value={form.locale}
                onChange={(e) => set('locale', e.target.value as 'en' | 'es')}
                className={inputClass}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Categoría *</label>
              <input
                type="text"
                value={form.categoria}
                onChange={(e) => set('categoria', e.target.value)}
                className={inputClass}
                placeholder="Desarrollo Web"
                list="blog-categorias"
              />
              <datalist id="blog-categorias">
                {['Desarrollo Web', 'Marketing Digital', 'Diseño UX/UI', 'Emprendimiento', 'Negocio'].map(
                  (c) => (
                    <option key={c} value={c} />
                  )
                )}
              </datalist>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Tiempo de lectura</label>
              <input
                type="text"
                value={form.lectura ?? ''}
                onChange={(e) => set('lectura', e.target.value || null)}
                className={inputClass}
                placeholder="8 min"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">Extracto</label>
                <CharCount value={form.extracto ?? ''} max={300} />
              </div>
              <textarea
                value={form.extracto ?? ''}
                onChange={(e) => set('extracto', e.target.value || null)}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Resumen que aparece en el listado y al compartir."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Autor</label>
              <input
                type="text"
                value={form.autor ?? ''}
                onChange={(e) => set('autor', e.target.value || null)}
                className={inputClass}
                placeholder="Luis Urdaneta"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Usuario del autor
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (para la foto de perfil)
                </span>
              </label>
              <input
                type="text"
                value={form.author_username ?? ''}
                onChange={(e) => set('author_username', e.target.value || null)}
                className={inputClass}
                placeholder="luiseum"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-foreground">Portada (URL)</label>
              <input
                type="text"
                value={form.portada ?? ''}
                onChange={(e) => set('portada', e.target.value || null)}
                className={inputClass}
                placeholder="/blog/mi-articulo/portada.webp"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Texto alternativo</label>
              <input
                type="text"
                value={form.portada_alt ?? ''}
                onChange={(e) => set('portada_alt', e.target.value || null)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Crédito de imagen</label>
              <input
                type="text"
                value={form.portada_credito ?? ''}
                onChange={(e) => set('portada_credito', e.target.value || null)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Body + preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">Cuerpo (MDX) *</label>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
              >
                <Eye className="h-3 w-3" />
                {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
              </button>
            </div>

            <div className={showPreview ? 'grid gap-4 lg:grid-cols-2' : ''}>
              <textarea
                value={form.body_mdx}
                onChange={(e) => set('body_mdx', e.target.value)}
                rows={24}
                spellCheck={false}
                className={`${inputClass} font-mono text-xs leading-relaxed`}
                placeholder={'## Sección {#seccion}\n\nTexto en **MDX**.'}
              />

              {showPreview && (
                <div className="max-h-[36rem] overflow-auto rounded-md border border-border bg-background p-4">
                  {previewing && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Compilando…
                    </div>
                  )}
                  {preview?.error && (
                    <p className="text-xs text-destructive">{preview.error}</p>
                  )}
                  {preview?.html && (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: preview.html }}
                    />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Soporta <code>{'{#id-personalizado}'}</code> en encabezados y el componente{' '}
              <code>&lt;MediaCarousel /&gt;</code>.
            </p>
          </div>
        </div>
      )}

      {/* SEO */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">Título SEO</label>
              <CharCount value={form.titulo_seo ?? form.title} max={60} />
            </div>
            <input
              type="text"
              value={form.titulo_seo ?? ''}
              onChange={(e) => set('titulo_seo', e.target.value || null)}
              className={inputClass}
              placeholder={form.title || 'Título optimizado, ≤60 caracteres'}
            />
            <p className="text-xs text-muted-foreground">
              Si se deja vacío se usa el título. Debe contener la keyword principal.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">Meta descripción</label>
              <CharCount value={form.metadescripcion ?? ''} min={120} max={155} />
            </div>
            <textarea
              value={form.metadescripcion ?? ''}
              onChange={(e) => set('metadescripcion', e.target.value || null)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Keyword principal</label>
              <input
                type="text"
                value={form.keyword_principal ?? ''}
                onChange={(e) => set('keyword_principal', e.target.value || null)}
                className={inputClass}
                placeholder="certificado ssl"
              />
              <p className="text-xs text-muted-foreground">Una sola, para no canibalizar.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Intención de búsqueda
              </label>
              <select
                value={form.intencion_busqueda ?? ''}
                onChange={(e) => set('intencion_busqueda', e.target.value || null)}
                className={inputClass}
              >
                <option value="">—</option>
                <option value="informacional">Informacional</option>
                <option value="navegacional">Navegacional</option>
                <option value="comercial">Comercial</option>
                <option value="transaccional">Transaccional</option>
              </select>
            </div>
          </div>

          <StringListInput
            label="Keywords secundarias"
            values={form.keywords_secundarias}
            onChange={(v) => set('keywords_secundarias', v)}
            placeholder="Escribe y pulsa Enter"
          />

          <StringListInput
            label="Tags"
            values={form.tags}
            onChange={(v) => set('tags', v)}
            placeholder="Escribe y pulsa Enter"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Canonical</label>
            <input
              type="text"
              value={form.canonical ?? ''}
              onChange={(e) => set('canonical', e.target.value || null)}
              className={inputClass}
              placeholder="https://alkitu.com/es/blog/categoria/slug"
            />
          </div>
        </div>
      )}

      {/* GEO */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              La capa GEO es lo que hace el contenido citable por modelos de lenguaje. La
              respuesta corta alimenta <code>llms.txt</code>; las preguntas y respuestas generan
              el schema <code>FAQPage</code>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">Respuesta corta</label>
              <CharCount value={form.geo_respuesta_corta ?? ''} max={600} />
            </div>
            <textarea
              value={form.geo_respuesta_corta ?? ''}
              onChange={(e) => set('geo_respuesta_corta', e.target.value || null)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="1–3 frases autocontenidas que respondan la pregunta principal. Debería ser también el primer párrafo del artículo."
            />
          </div>

          <GeoQAManager
            preguntas={form.geo_preguntas}
            respuestas={form.geo_respuestas}
            onChange={(preguntas, respuestas) =>
              setForm((prev) => ({ ...prev, geo_preguntas: preguntas, geo_respuestas: respuestas }))
            }
          />

          <StringListInput
            label="Entidades"
            hint="Personas, marcas, tecnologías o conceptos nombrados en el artículo."
            values={form.geo_entidades}
            onChange={(v) => set('geo_entidades', v)}
            placeholder="Google, HTTPS, Let's Encrypt…"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Tipo de schema</label>
            <select
              value={form.schema_tipo}
              onChange={(e) => set('schema_tipo', e.target.value)}
              className={inputClass}
            >
              {['Article', 'BlogPosting', 'HowTo', 'FAQPage', 'Review'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* TAXONOMÍA */}
      {activeTab === 'taxonomia' && (
        <div className="space-y-6">
          <StringListInput
            label="Alias"
            hint="Otras formas de nombrar el tema de este artículo."
            values={form.aliases}
            onChange={(v) => set('aliases', v)}
          />
          <StringListInput
            label="Campo semántico"
            hint="Conceptos del mismo dominio."
            values={form.campo_semantico}
            onChange={(v) => set('campo_semantico', v)}
          />
          <StringListInput
            label="Relacionado"
            hint="Slugs de artículos o términos con los que enlazar."
            values={form.relacionado}
            onChange={(v) => set('relacionado', v)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Prioridad en sitemap
              </label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={form.prioridad}
                onChange={(e) => set('prioridad', Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Frecuencia de cambio
              </label>
              <select
                value={form.frecuencia_cambio}
                onChange={(e) => set('frecuencia_cambio', e.target.value)}
                className={inputClass}
              >
                {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="rounded border-border"
              />
              Destacado
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm text-foreground">Estado editorial</label>
              <select
                value={form.estado}
                onChange={(e) => set('estado', e.target.value as BlogFormState['estado'])}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
              >
                <option value="borrador">Borrador</option>
                <option value="revisar">Revisar</option>
                <option value="completo">Completo</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.push(`/${adminLocale}/admin/blog`)}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
        >
          <XIcon className="h-4 w-4" />
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar borrador
        </button>

        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving || errors.length > 0}
          title={errors.length ? 'Corrige los errores del contrato para publicar' : undefined}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          {form.published ? 'Actualizar publicado' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
