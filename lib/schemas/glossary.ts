/**
 * Glossary term validation.
 *
 * Terms are the anchor of the whole interlinking system: a published term makes
 * its title (and aliases) auto-link across every blog post. That makes precision
 * here worth more than convenience — a sloppy alias silently rewrites content
 * site-wide.
 */

import { z } from 'zod';

const termRefSchema = z.object({
  nombre: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
});

export const GlossaryTermInputSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),

  titulo_es: z.string().min(1, 'Spanish title is required').max(160),
  titulo_en: z.string().max(160).optional().nullable(),
  definicion_es: z.string().min(1, 'Spanish definition is required'),
  definicion_en: z.string().optional().nullable(),

  dominio: z.string().max(80).optional().nullable(),
  pilar: z.string().max(80).optional().nullable(),

  // Anything listed here becomes a link target across the whole blog, so short
  // or ambiguous surface forms are rejected rather than quietly ignored.
  aliases: z
    .array(
      z
        .string()
        .min(3, 'Aliases must be at least 3 characters — shorter ones match too much text')
    )
    .default([]),
  campo_semantico: z.array(z.string()).default([]),

  hiperonimos: z.array(termRefSchema).default([]),
  hiponimos: z.array(termRefSchema).default([]),
  relacionados: z.array(termRefSchema).default([]),

  geo_preguntas: z.array(z.string()).default([]),
  geo_respuestas: z.array(z.string()).default([]),
  geo_respuesta_corta: z.string().max(600).optional().nullable(),

  estado: z.enum(['borrador', 'revisar', 'completo']).default('borrador'),
  published: z.boolean().default(false),
});

export const GlossaryTermUpdateSchema = GlossaryTermInputSchema.partial();

export type GlossaryTermInput = z.infer<typeof GlossaryTermInputSchema>;

export interface GlossaryFinding {
  level: 'error' | 'warning';
  field: string;
  message: string;
}

export function checkGlossaryContract(term: {
  titulo_es?: string | null;
  definicion_es?: string | null;
  definicion_en?: string | null;
  titulo_en?: string | null;
  aliases?: string[];
  geo_preguntas?: string[];
  geo_respuestas?: string[];
}): GlossaryFinding[] {
  const findings: GlossaryFinding[] = [];
  const add = (level: 'error' | 'warning', field: string, message: string) =>
    findings.push({ level, field, message });

  if (!term.titulo_es?.trim()) add('error', 'titulo_es', 'A Spanish title is required.');
  if (!term.definicion_es?.trim()) add('error', 'definicion_es', 'A Spanish definition is required.');

  // The definition is what gets quoted — one sentence is rarely enough context.
  const def = term.definicion_es?.trim() ?? '';
  if (def && def.length < 40) {
    add('warning', 'definicion_es', 'The definition is very short to be quotable on its own.');
  }

  if (!term.titulo_en?.trim()) {
    add('warning', 'titulo_en', 'No English title: the term will not auto-link in English posts.');
  }
  if (!term.definicion_en?.trim()) {
    add('warning', 'definicion_en', 'No English definition; the Spanish one will be shown.');
  }

  const q = term.geo_preguntas ?? [];
  const a = term.geo_respuestas ?? [];
  if (q.length !== a.length) {
    add('error', 'geo_respuestas', `${q.length} question(s) but ${a.length} answer(s); they must match 1:1.`);
  }

  return findings;
}

export function canPublishTerm(term: Parameters<typeof checkGlossaryContract>[0]): boolean {
  return !checkGlossaryContract(term).some((f) => f.level === 'error');
}
