-- =====================================================
-- Blog Posts Schema (knowledge-brain-kit contract)
-- =====================================================
-- Description: DB-backed blog replacing the Contentlayer/MDX-file pipeline.
--              Column layout follows the kit's 5-layer frontmatter contract
--              (Context/00-Index/📐 Context — Contrato.md), minus Layer 5
--              (implementation) which applies to Context blueprint nodes, not
--              to content.
--
-- Key modelling decisions:
--   * ONE ROW PER (post, locale). EN and ES are distinct documents (own body,
--     own date, sometimes own slug) — same as the kit's `slug.es.mdx` /
--     `slug.en.mdx` split. They are paired via `translation_group_id`, which
--     is what makes hreflang work for posts whose slugs diverge across locales
--     (e.g. effective-research-techniques / tecnicas-investigacion-efectivas).
--   * `categoria_slug` is STORED, not derived at render time. The old pipeline
--     had two different slugify implementations, which is why the sitemap
--     emitted `/blog/diseno-ux/ui` (literal slash) while canonical emitted
--     `/blog/diseno-ux-ui`. One stored value = one URL, by construction.
--
-- Created: 2026-08-03
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Pairs the locale variants of the same article for hreflang.
  -- Defaults to a fresh uuid so a single-locale post is trivially valid.
  translation_group_id uuid NOT NULL DEFAULT uuid_generate_v4(),

  -- ---------------------------------------------------
  -- Layer 1 · Semantic identity
  -- ---------------------------------------------------
  title text NOT NULL,
  aliases jsonb DEFAULT '[]'::jsonb,
  campo_semantico jsonb DEFAULT '[]'::jsonb,
  relacionado jsonb DEFAULT '[]'::jsonb,

  -- ---------------------------------------------------
  -- Layer 2 · SEO + URL
  -- ---------------------------------------------------
  locale text NOT NULL,
  slug text NOT NULL,
  categoria text NOT NULL,
  categoria_slug text NOT NULL,
  canonical text,
  titulo_seo text,
  metadescripcion text,
  keyword_principal text,
  keywords_secundarias jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  intencion_busqueda text,
  og_image text,

  -- ---------------------------------------------------
  -- Layer 3 · GEO (generative engine optimization)
  -- `geo_preguntas` and `geo_respuestas` are INDEX-ALIGNED: FAQPage JSON-LD is
  -- only emitted when both arrays are non-empty and the same length.
  -- ---------------------------------------------------
  geo_preguntas jsonb DEFAULT '[]'::jsonb,
  geo_respuestas jsonb DEFAULT '[]'::jsonb,
  geo_respuesta_corta text,
  geo_entidades jsonb DEFAULT '[]'::jsonb,
  geo_datos_citables jsonb DEFAULT '[]'::jsonb,
  geo_formato jsonb DEFAULT '[]'::jsonb,
  schema_tipo text DEFAULT 'Article',

  -- ---------------------------------------------------
  -- Layer 4 · Technical sitemap
  -- ---------------------------------------------------
  prioridad numeric(2,1) DEFAULT 0.7,
  frecuencia_cambio text DEFAULT 'yearly',

  -- ---------------------------------------------------
  -- Content
  -- ---------------------------------------------------
  body_mdx text NOT NULL DEFAULT '',
  extracto text,
  portada text,
  portada_alt text,
  portada_credito text,
  lectura text,
  autor text,
  autor_rol text,
  author_username text,          -- soft ref to user_profiles.username (author photo)
  secciones jsonb DEFAULT '[]'::jsonb,  -- table of contents: [{id, label}]
  featured boolean DEFAULT false,

  -- ---------------------------------------------------
  -- Editorial state
  -- ---------------------------------------------------
  estado text DEFAULT 'borrador',
  published boolean DEFAULT false,
  published_at timestamptz,
  content_updated_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT blog_posts_unique_locale_slug UNIQUE (locale, slug),
  CONSTRAINT blog_posts_check_locale CHECK (locale IN ('en', 'es')),
  CONSTRAINT blog_posts_check_estado CHECK (estado IN ('borrador', 'revisar', 'completo')),
  CONSTRAINT blog_posts_check_intencion CHECK (
    intencion_busqueda IS NULL
    OR intencion_busqueda IN ('informacional', 'navegacional', 'comercial', 'transaccional')
  ),
  CONSTRAINT blog_posts_check_frecuencia CHECK (
    frecuencia_cambio IS NULL
    OR frecuencia_cambio IN ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')
  ),
  CONSTRAINT blog_posts_check_prioridad CHECK (prioridad IS NULL OR (prioridad >= 0.0 AND prioridad <= 1.0)),
  CONSTRAINT blog_posts_check_aliases_is_array CHECK (jsonb_typeof(aliases) = 'array'),
  CONSTRAINT blog_posts_check_campo_semantico_is_array CHECK (jsonb_typeof(campo_semantico) = 'array'),
  CONSTRAINT blog_posts_check_relacionado_is_array CHECK (jsonb_typeof(relacionado) = 'array'),
  CONSTRAINT blog_posts_check_keywords_sec_is_array CHECK (jsonb_typeof(keywords_secundarias) = 'array'),
  CONSTRAINT blog_posts_check_tags_is_array CHECK (jsonb_typeof(tags) = 'array'),
  CONSTRAINT blog_posts_check_geo_preguntas_is_array CHECK (jsonb_typeof(geo_preguntas) = 'array'),
  CONSTRAINT blog_posts_check_geo_respuestas_is_array CHECK (jsonb_typeof(geo_respuestas) = 'array'),
  CONSTRAINT blog_posts_check_geo_entidades_is_array CHECK (jsonb_typeof(geo_entidades) = 'array'),
  CONSTRAINT blog_posts_check_geo_datos_is_array CHECK (jsonb_typeof(geo_datos_citables) = 'array'),
  CONSTRAINT blog_posts_check_geo_formato_is_array CHECK (jsonb_typeof(geo_formato) = 'array'),
  CONSTRAINT blog_posts_check_secciones_is_array CHECK (jsonb_typeof(secciones) = 'array')
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS blog_posts_locale_idx ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_categoria_slug_idx ON blog_posts(categoria_slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_translation_group_idx ON blog_posts(translation_group_id);
CREATE INDEX IF NOT EXISTS blog_posts_featured_idx ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS blog_posts_tags_gin_idx ON blog_posts USING gin(tags);

-- =====================================================
-- Trigger: auto-update updated_at (function already exists from earlier schemas)
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security
-- Mirrors the projects schema: anonymous reads only published rows,
-- admins get full access.
-- =====================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_blog_posts" ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "admin_all_blog_posts" ON blog_posts
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
COMMENT ON TABLE blog_posts IS 'Blog articles, one row per (post, locale). Column layout follows the knowledge-brain-kit 5-layer frontmatter contract.';
COMMENT ON COLUMN blog_posts.translation_group_id IS 'Shared by the locale variants of the same article; drives hreflang pairing even when slugs differ across locales.';
COMMENT ON COLUMN blog_posts.categoria_slug IS 'Stored URL segment for the category. Single source of truth for the post URL — avoids the divergent slugify implementations of the previous pipeline.';
COMMENT ON COLUMN blog_posts.geo_preguntas IS 'GEO layer: natural-language questions this article answers. Index-aligned with geo_respuestas; FAQPage JSON-LD is emitted only when both are non-empty and equal length.';
COMMENT ON COLUMN blog_posts.geo_respuesta_corta IS 'GEO layer: 1-3 extractable sentences answering the main question, intended for citation by generative engines.';
COMMENT ON COLUMN blog_posts.body_mdx IS 'MDX source, compiled at render time via next-mdx-remote/rsc.';
COMMENT ON COLUMN blog_posts.secciones IS 'Table of contents entries: [{id, label}].';
COMMENT ON COLUMN blog_posts.author_username IS 'Soft reference to user_profiles.username, used to resolve the author photo.';

-- Rollback:
-- DROP TABLE IF EXISTS blog_posts CASCADE;
