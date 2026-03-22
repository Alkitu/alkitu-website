-- =====================================================
-- Restructure Project Categories
-- =====================================================
-- Description: Replaces the 11 old categories with 6 new ones
--   and reassigns all project-category associations.
--
-- Old categories (11):
--   Web Development, Web Apps, Web Design, Video Games,
--   Logos, Branding, SEO, SEM, Audiovisuals, Offline Designs, UX/UI
--
-- New categories (6):
--   Branding, Webs Corporativas, Marketing Digital,
--   Web App, UI/UX Prototyping, Audiovisuales
--
-- Created: 2026-03-20
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Create new categories (keep existing Branding, update its name_es)
-- =====================================================

-- Update existing "Branding" category name_es from "Marca" to "Branding"
UPDATE categories
SET name_es = 'Branding', updated_at = now()
WHERE slug = 'branding';

-- Insert new categories that don't exist yet
INSERT INTO categories (name_en, name_es, slug) VALUES
  ('Webs Corporativas', 'Webs Corporativas', 'webs-corporativas'),
  ('Marketing Digital', 'Marketing Digital', 'marketing-digital'),
  ('Web App', 'Web App', 'web-app'),
  ('UI/UX Prototyping', 'UI/UX Prototyping', 'ui-ux-prototyping'),
  ('Audiovisuales', 'Audiovisuales', 'audiovisuales')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. Remove ALL existing project-category associations
-- =====================================================

DELETE FROM project_categories;

-- =====================================================
-- 3. Create new project-category associations
-- =====================================================

INSERT INTO project_categories (project_id, category_id)
SELECT
  p.id as project_id,
  c.id as category_id
FROM (VALUES
  -- Project 1: Tangle → Web App
  ('proyect_1', 'web-app'),

  -- Project 2: Top Top → Web App
  ('proyect_2', 'web-app'),

  -- Project 3: Big Menu → Web App
  ('proyect_3', 'web-app'),

  -- Project 4: Gousty → Web App
  ('proyect_4', 'web-app'),

  -- Project 5: Desierto Sahara Trips → Webs Corporativas, Branding, Marketing Digital
  ('proyect_5', 'webs-corporativas'),
  ('proyect_5', 'branding'),
  ('proyect_5', 'marketing-digital'),

  -- Project 6: Canastilla → Webs Corporativas, Branding, Marketing Digital
  ('proyect_6', 'webs-corporativas'),
  ('proyect_6', 'branding'),
  ('proyect_6', 'marketing-digital'),

  -- Project 7: Eleale → Webs Corporativas, Branding, Marketing Digital
  ('proyect_7', 'webs-corporativas'),
  ('proyect_7', 'branding'),
  ('proyect_7', 'marketing-digital'),

  -- Project 8: Funda Manía → Webs Corporativas, Marketing Digital
  ('proyect_8', 'webs-corporativas'),
  ('proyect_8', 'marketing-digital'),

  -- Project 9: El Mejor Vidente → Webs Corporativas, Branding, Marketing Digital
  ('proyect_9', 'webs-corporativas'),
  ('proyect_9', 'branding'),
  ('proyect_9', 'marketing-digital'),

  -- Project 10: Clínica Diseño y Sonrisas → Webs Corporativas, Marketing Digital
  ('proyect_10', 'webs-corporativas'),
  ('proyect_10', 'marketing-digital'),

  -- Project 11: Tránsito Bar → Webs Corporativas, Branding, Marketing Digital, Audiovisuales
  ('proyect_11', 'webs-corporativas'),
  ('proyect_11', 'branding'),
  ('proyect_11', 'marketing-digital'),
  ('proyect_11', 'audiovisuales'),

  -- Project 12: Aircrew Aviation → Webs Corporativas, Marketing Digital
  ('proyect_12', 'webs-corporativas'),
  ('proyect_12', 'marketing-digital'),

  -- Project 13: Detailcar → Webs Corporativas, Marketing Digital
  ('proyect_13', 'webs-corporativas'),
  ('proyect_13', 'marketing-digital'),

  -- Project 14: Helayor → Webs Corporativas, Branding, Marketing Digital
  ('proyect_14', 'webs-corporativas'),
  ('proyect_14', 'branding'),
  ('proyect_14', 'marketing-digital'),

  -- Project 15: Ernesto Fuenmayor → Branding, Audiovisuales
  ('proyect_15', 'branding'),
  ('proyect_15', 'audiovisuales'),

  -- Project 16: Ciutat de las Artes y las Ciencias → UI/UX Prototyping
  ('proyect_16', 'ui-ux-prototyping')
) AS data(project_slug, category_slug)
JOIN projects p ON p.slug = data.project_slug
JOIN categories c ON c.slug = data.category_slug
ON CONFLICT (project_id, category_id) DO NOTHING;

-- =====================================================
-- 4. Delete old categories that are no longer used
-- =====================================================

DELETE FROM categories WHERE slug IN (
  'web_development',
  'web_apps',
  'web_design',
  'video_games',
  'logos',
  'seo',
  'sem',
  'audiovisuals',
  'offline_designs',
  'ux_ui'
);

-- =====================================================
-- 5. Update project tags (stored as JSONB in projects table)
-- =====================================================

-- Project 1: Tangle
UPDATE projects SET tags = '["GitHub", "Next.js", "Node.js", "Express", "Tailwind CSS", "Framer Motion", "ESLint"]'::jsonb WHERE slug = 'proyect_1';

-- Project 2: Top Top
UPDATE projects SET tags = '["GitHub", "MongoDB", "Express", "React", "Node.js", "Bootstrap", "Framer Motion"]'::jsonb WHERE slug = 'proyect_2';

-- Project 3: Big Menu
UPDATE projects SET tags = '["GitHub", "MongoDB", "Express", "Node.js", "Bootstrap"]'::jsonb WHERE slug = 'proyect_3';

-- Project 4: Gousty
UPDATE projects SET tags = '["Illustrator", "GitHub", "HTML", "CSS", "JavaScript"]'::jsonb WHERE slug = 'proyect_4';

-- Project 5: Desierto Sahara Trips
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator"]'::jsonb WHERE slug = 'proyect_5';

-- Project 6: Canastilla
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator"]'::jsonb WHERE slug = 'proyect_6';

-- Project 7: Eleale
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator"]'::jsonb WHERE slug = 'proyect_7';

-- Project 8: Funda Manía
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator"]'::jsonb WHERE slug = 'proyect_8';

-- Project 9: El Mejor Vidente
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator"]'::jsonb WHERE slug = 'proyect_9';

-- Project 10: Clínica Diseño y Sonrisas
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor"]'::jsonb WHERE slug = 'proyect_10';

-- Project 11: Tránsito Bar
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator", "InDesign", "Photoshop"]'::jsonb WHERE slug = 'proyect_11';

-- Project 12: Aircrew Aviation
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator"]'::jsonb WHERE slug = 'proyect_12';

-- Project 13: Detailcar
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor"]'::jsonb WHERE slug = 'proyect_13';

-- Project 14: Helayor
UPDATE projects SET tags = '["HTML", "CSS", "JavaScript", "WordPress", "Elementor", "Illustrator", "InDesign", "Photoshop"]'::jsonb WHERE slug = 'proyect_14';

-- Project 15: Ernesto Fuenmayor
UPDATE projects SET tags = '["Illustrator", "After Effects"]'::jsonb WHERE slug = 'proyect_15';

-- Project 16: Ciutat de las Artes y las Ciencias
UPDATE projects SET tags = '["Figma", "Premiere"]'::jsonb WHERE slug = 'proyect_16';

-- =====================================================
-- 6. Verify results
-- =====================================================

DO $$
DECLARE
  cat_count integer;
  assoc_count integer;
  cat_names text;
BEGIN
  SELECT COUNT(*) INTO cat_count FROM categories;
  SELECT COUNT(*) INTO assoc_count FROM project_categories;
  SELECT string_agg(name_en || ' (' || slug || ')', ', ' ORDER BY name_en)
    INTO cat_names FROM categories;

  RAISE NOTICE '✅ Total categories: %', cat_count;
  RAISE NOTICE '✅ Total project-category associations: %', assoc_count;
  RAISE NOTICE '✅ Categories: %', cat_names;
END $$;

COMMIT;
