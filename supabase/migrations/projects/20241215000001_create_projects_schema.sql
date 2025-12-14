-- =====================================================
-- Projects Management Schema
-- =====================================================
-- Description: Creates tables for managing portfolio projects with categories
-- Created: 2024-12-15
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: categories
-- Description: Project categories with localized names
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en text NOT NULL UNIQUE,
  name_es text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for categories table
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS categories_name_en_idx ON categories(name_en);
CREATE INDEX IF NOT EXISTS categories_name_es_idx ON categories(name_es);

-- =====================================================
-- Table: projects
-- Description: Portfolio projects with localized content
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  legacy_id integer UNIQUE,
  slug text NOT NULL UNIQUE,

  -- Localized content
  title_en text NOT NULL,
  title_es text NOT NULL,
  description_en text NOT NULL,
  description_es text NOT NULL,
  about_en text,
  about_es text,

  -- Media (external URLs)
  image text NOT NULL,
  gallery jsonb DEFAULT '[]'::jsonb,

  -- Metadata
  tags jsonb DEFAULT '[]'::jsonb,
  urls jsonb DEFAULT '[]'::jsonb,

  -- Status and ordering
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT check_gallery_is_array CHECK (jsonb_typeof(gallery) = 'array'),
  CONSTRAINT check_tags_is_array CHECK (jsonb_typeof(tags) = 'array'),
  CONSTRAINT check_urls_is_array CHECK (jsonb_typeof(urls) = 'array')
);

-- Indexes for projects table
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
CREATE INDEX IF NOT EXISTS projects_is_active_idx ON projects(is_active);
CREATE INDEX IF NOT EXISTS projects_display_order_idx ON projects(display_order);
CREATE INDEX IF NOT EXISTS projects_legacy_id_idx ON projects(legacy_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS projects_title_en_idx ON projects(title_en);
CREATE INDEX IF NOT EXISTS projects_title_es_idx ON projects(title_es);

-- GIN indexes for JSONB columns (for efficient searching)
CREATE INDEX IF NOT EXISTS projects_tags_gin_idx ON projects USING gin(tags);
CREATE INDEX IF NOT EXISTS projects_urls_gin_idx ON projects USING gin(urls);
CREATE INDEX IF NOT EXISTS projects_gallery_gin_idx ON projects USING gin(gallery);

-- =====================================================
-- Table: project_categories (Junction Table)
-- Description: Many-to-many relationship between projects and categories
-- =====================================================
CREATE TABLE IF NOT EXISTS project_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  -- Ensure unique project-category pairs
  CONSTRAINT unique_project_category UNIQUE(project_id, category_id)
);

-- Indexes for project_categories table
CREATE INDEX IF NOT EXISTS project_categories_project_id_idx ON project_categories(project_id);
CREATE INDEX IF NOT EXISTS project_categories_category_id_idx ON project_categories(category_id);

-- =====================================================
-- Trigger Function: Update updated_at timestamp
-- =====================================================
-- Reuse existing function or create if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies: Public read access to active projects
-- =====================================================

-- Categories: Public read access
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT
  USING (true);

-- Projects: Public can only see active projects
CREATE POLICY "public_read_active_projects" ON projects
  FOR SELECT
  USING (is_active = true);

-- Project Categories: Public read access
CREATE POLICY "public_read_project_categories" ON project_categories
  FOR SELECT
  USING (true);

-- =====================================================
-- RLS Policies: Admin full access
-- =====================================================
-- Note: These policies check if user exists in admin_users table

-- Categories: Admin full access
CREATE POLICY "admin_all_categories" ON categories
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

-- Projects: Admin full access
CREATE POLICY "admin_all_projects" ON projects
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

-- Project Categories: Admin full access
CREATE POLICY "admin_all_project_categories" ON project_categories
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
-- Helper Functions
-- =====================================================

-- Function to get project with categories
CREATE OR REPLACE FUNCTION get_project_with_categories(project_uuid uuid)
RETURNS TABLE (
  id uuid,
  legacy_id integer,
  slug text,
  title_en text,
  title_es text,
  description_en text,
  description_es text,
  about_en text,
  about_es text,
  image text,
  gallery jsonb,
  tags jsonb,
  urls jsonb,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz,
  categories jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.*,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'name_en', c.name_en,
          'name_es', c.name_es,
          'slug', c.slug
        )
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'::jsonb
    ) as categories
  FROM projects p
  LEFT JOIN project_categories pc ON p.id = pc.project_id
  LEFT JOIN categories c ON pc.category_id = c.id
  WHERE p.id = project_uuid
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON TABLE categories IS 'Project categories with English and Spanish translations';
COMMENT ON TABLE projects IS 'Portfolio projects with localized content and metadata';
COMMENT ON TABLE project_categories IS 'Junction table for many-to-many relationship between projects and categories';

COMMENT ON COLUMN projects.legacy_id IS 'Original ID from seed.json for backward compatibility';
COMMENT ON COLUMN projects.gallery IS 'Array of image URLs for project gallery';
COMMENT ON COLUMN projects.tags IS 'Array of technology tag strings (e.g., ["NextJS", "React"])';
COMMENT ON COLUMN projects.urls IS 'Array of project link objects {name, url, active, fallback}';
COMMENT ON COLUMN projects.is_active IS 'Whether project is visible on public site';
COMMENT ON COLUMN projects.display_order IS 'Order for displaying projects (lower = first)';
