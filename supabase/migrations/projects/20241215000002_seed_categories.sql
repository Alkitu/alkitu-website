-- =====================================================
-- Seed Categories Data
-- =====================================================
-- Description: Inserts project categories with English and Spanish translations
-- Created: 2024-12-15
-- =====================================================

-- Insert categories
-- Note: Using explicit slug format matching seed.json convention
INSERT INTO categories (name_en, name_es, slug) VALUES
  ('Web Development', 'Desarrollo Web', 'web_development'),
  ('Web Apps', 'Aplicaciones Web', 'web_apps'),
  ('Web Design', 'Diseño Web', 'web_design'),
  ('Video Games', 'Videojuegos', 'video_games'),
  ('Logos', 'Logotipos', 'logos'),
  ('Branding', 'Marca', 'branding'),
  ('SEO', 'SEO', 'seo'),
  ('SEM', 'SEM', 'sem'),
  ('Audiovisuals', 'Audiovisuales', 'audiovisuals'),
  ('Offline Designs', 'Diseños Offline', 'offline_designs'),
  ('UX/UI', 'UX/UI', 'ux_ui')
ON CONFLICT (slug) DO NOTHING;

-- Verify insertion
DO $$
DECLARE
  category_count integer;
BEGIN
  SELECT COUNT(*) INTO category_count FROM categories;
  RAISE NOTICE 'Total categories inserted: %', category_count;
END $$;
