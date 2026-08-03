-- =====================================================
-- Glossary / Wiki Terms Schema (knowledge-brain-kit contract)
-- =====================================================
-- Description: Canonical concept definitions that power (a) the /wiki section
--              and (b) automatic interlinking — the first mention of each term
--              inside a blog post is auto-linked to /wiki/<slug> by the
--              `remarkGlosarioLinks` remark plugin ported from the kit.
--
-- Shape follows the kit's `content/wiki/glosario.json` term schema
-- (apps/web/lib/glosario.tsx): Spanish is the primary language, English is an
-- optional overlay (`titulo_en` / `definicion_en`) that falls back to ES —
-- matching the kit's `tituloDe` / `definicionDe` helpers.
--
-- Taxonomy (hiperonimos/hiponimos/relacionados) is stored as jsonb arrays of
-- {nombre, slug} objects, which is what the kit's graph/interlinking reads.
--
-- Created: 2026-08-03
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS glossary_terms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  slug text NOT NULL UNIQUE,

  -- Spanish primary + English overlay
  titulo_es text NOT NULL,
  titulo_en text,
  definicion_es text NOT NULL,
  definicion_en text,

  -- Classification
  dominio text,
  pilar text,

  -- Linkable surface forms. Used verbatim to build the interlinking regex, so
  -- entries shorter than 3 chars or containing "(" are ignored at render time.
  aliases jsonb DEFAULT '[]'::jsonb,
  campo_semantico jsonb DEFAULT '[]'::jsonb,

  -- Taxonomy: arrays of {nombre, slug}
  hiperonimos jsonb DEFAULT '[]'::jsonb,
  hiponimos jsonb DEFAULT '[]'::jsonb,
  relacionados jsonb DEFAULT '[]'::jsonb,

  -- GEO layer (a term node is a DefinedTerm; it can still carry Q&A)
  geo_preguntas jsonb DEFAULT '[]'::jsonb,
  geo_respuestas jsonb DEFAULT '[]'::jsonb,
  geo_respuesta_corta text,

  -- Editorial state
  estado text DEFAULT 'borrador',
  published boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT glossary_terms_check_estado CHECK (estado IN ('borrador', 'revisar', 'completo')),
  CONSTRAINT glossary_terms_check_aliases_is_array CHECK (jsonb_typeof(aliases) = 'array'),
  CONSTRAINT glossary_terms_check_campo_semantico_is_array CHECK (jsonb_typeof(campo_semantico) = 'array'),
  CONSTRAINT glossary_terms_check_hiperonimos_is_array CHECK (jsonb_typeof(hiperonimos) = 'array'),
  CONSTRAINT glossary_terms_check_hiponimos_is_array CHECK (jsonb_typeof(hiponimos) = 'array'),
  CONSTRAINT glossary_terms_check_relacionados_is_array CHECK (jsonb_typeof(relacionados) = 'array'),
  CONSTRAINT glossary_terms_check_geo_preguntas_is_array CHECK (jsonb_typeof(geo_preguntas) = 'array'),
  CONSTRAINT glossary_terms_check_geo_respuestas_is_array CHECK (jsonb_typeof(geo_respuestas) = 'array')
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS glossary_terms_slug_idx ON glossary_terms(slug);
CREATE INDEX IF NOT EXISTS glossary_terms_dominio_idx ON glossary_terms(dominio);
CREATE INDEX IF NOT EXISTS glossary_terms_published_idx ON glossary_terms(published);
CREATE INDEX IF NOT EXISTS glossary_terms_titulo_es_idx ON glossary_terms(titulo_es);
CREATE INDEX IF NOT EXISTS glossary_terms_aliases_gin_idx ON glossary_terms USING gin(aliases);

-- =====================================================
-- Trigger
-- =====================================================
CREATE TRIGGER update_glossary_terms_updated_at
  BEFORE UPDATE ON glossary_terms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security
-- =====================================================
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_glossary_terms" ON glossary_terms
  FOR SELECT
  USING (published = true);

CREATE POLICY "admin_all_glossary_terms" ON glossary_terms
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- =====================================================
-- Documentation
-- =====================================================
COMMENT ON TABLE glossary_terms IS 'Canonical concept definitions. Powers the /wiki section and automatic first-mention interlinking inside blog posts.';
COMMENT ON COLUMN glossary_terms.titulo_en IS 'Optional English overlay; falls back to titulo_es when absent (kit convention).';
COMMENT ON COLUMN glossary_terms.aliases IS 'Alternative surface forms that should also auto-link. Entries under 3 chars or containing "(" are skipped by the interlinker.';
COMMENT ON COLUMN glossary_terms.hiperonimos IS 'Broader terms: [{nombre, slug}]. Drives the taxonomy graph and related-term suggestions.';

-- Rollback:
-- DROP TABLE IF EXISTS glossary_terms CASCADE;
