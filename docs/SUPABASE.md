# Supabase Database Guide

Complete guide to working with the Supabase PostgreSQL database, including schema, migrations, Row Level Security, and client usage.

---

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Database Schema](#database-schema)
4. [Migrations](#migrations)
5. [Row Level Security (RLS)](#row-level-security-rls)
6. [Client Usage](#client-usage)
7. [Common Queries](#common-queries)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Resources](#resources)

---

## Overview

### What is Supabase?

Supabase is an open-source Firebase alternative built on PostgreSQL. It provides:

- **PostgreSQL Database**: Full-featured relational database
- **Authentication**: Built-in user management and JWT tokens
- **Row Level Security**: Database-level access control
- **Realtime**: Subscribe to database changes (not used in this project)
- **Storage**: File uploads (not used in this project)
- **RESTful API**: Auto-generated API from database schema

### This Project's Usage

We use Supabase for:

1. **Project Data**: Categories, projects, and project-category relationships
2. **Analytics**: Session tracking and page view metrics
3. **Authentication**: Admin user login and session management

**Database**: PostgreSQL 15
**Region**: User-selected (recommend closest to users)
**Connection Pooling**: PgBouncer (port 6543)

---

## Initial Setup

### Step 1: Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Organization**: Select or create
   - **Name**: `alkitu-portfolio`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: `us-east-1` (or closest to users)
   - **Pricing Plan**: Free or Pro

4. Wait 2-3 minutes for project provisioning

### Step 2: Install Supabase CLI

**macOS (Homebrew):**
```bash
brew install supabase/tap/supabase
```

**npm (All platforms):**
```bash
npm install -g supabase
```

**Verify installation:**
```bash
supabase --version
```

### Step 3: Link Local Project

Navigate to your project directory:

```bash
cd alkitu-website

# Login to Supabase
supabase login

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF
```

**Find your project ref:**
- Supabase Dashboard > Project Settings > General > Reference ID
- Format: `abcdefghijklmnop` (16 characters)

### Step 4: Get API Credentials

Navigate to: **Project Settings** > **API**

Copy these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note**: The `anon` key is safe to expose client-side. Row Level Security (RLS) protects your data.

---

## Database Schema

### Entity-Relationship Diagram

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│   categories    │◄──────┤ project_categories   ├──────►│    projects     │
│                 │  many │   (junction table)   │ many  │                 │
├─────────────────┤       ├──────────────────────┤       ├─────────────────┤
│ id (uuid) PK    │       │ id (uuid) PK         │       │ id (uuid) PK    │
│ name_en         │       │ project_id (uuid) FK │       │ title           │
│ name_es         │       │ category_id (uuid) FK│       │ description     │
│ slug            │       │ created_at           │       │ content (jsonb) │
│ created_at      │       └──────────────────────┘       │ image_url       │
│ updated_at      │                                      │ gallery (jsonb) │
└─────────────────┘                                      │ tags (text[])   │
                                                         │ display_order   │
                                                         │ featured        │
                                                         │ created_at      │
                                                         │ updated_at      │
                                                         └─────────────────┘

┌─────────────┐        ┌────────────────┐
│  sessions   │◄───────┤   page_views   │
│             │  1:many│                │
├─────────────┤        ├────────────────┤
│ id (uuid) PK│        │ id (uuid) PK   │
│ fingerprint │        │ session_id FK  │
│ ip_address  │        │ page_url       │
│ user_agent  │        │ entry_time     │
│ country     │        │ exit_time      │
│ region      │        │ duration       │
│ city        │        │ created_at     │
│ created_at  │        └────────────────┘
│ updated_at  │
└─────────────┘

┌─────────────────┐       ┌──────────────┐
│  auth.users     │◄──────┤ admin_users  │
│  (Supabase)     │  1:1  │              │
├─────────────────┤       ├──────────────┤
│ id (uuid) PK    │       │ id (uuid) FK │
│ email           │       │ email        │
│ encrypted_pass  │       │ name         │
│ created_at      │       │ role         │
└─────────────────┘       │ last_login   │
                          │ created_at   │
                          │ updated_at   │
                          └──────────────┘
```

---

### Table Schemas

#### 1. `categories`

Stores project categories with bilingual names.

```sql
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en text NOT NULL UNIQUE,
  name_es text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX categories_slug_idx ON categories(slug);
CREATE INDEX categories_name_en_idx ON categories(name_en);
CREATE INDEX categories_name_es_idx ON categories(name_es);
```

**Example Row:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name_en": "Web Development",
  "name_es": "Desarrollo Web",
  "slug": "web-development",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

#### 2. `projects`

Stores projects with JSONB localized content.

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  content jsonb NOT NULL DEFAULT '{"en": {}, "es": {}}'::jsonb,
  image_url text,
  gallery jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT ARRAY[]::text[],
  display_order integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for queries
CREATE INDEX projects_featured_idx ON projects(featured) WHERE featured = true;
CREATE INDEX projects_display_order_idx ON projects(display_order);
CREATE INDEX projects_tags_idx ON projects USING gin(tags);
CREATE INDEX projects_content_idx ON projects USING gin(content);
```

**JSONB Structure:**

```json
{
  "content": {
    "en": {
      "title": "E-Commerce Platform",
      "description": "Full-stack shopping platform",
      "features": ["Cart", "Checkout", "Admin Panel"],
      "technologies": ["Next.js", "Supabase", "Stripe"]
    },
    "es": {
      "title": "Plataforma de E-Commerce",
      "description": "Plataforma de compras full-stack",
      "features": ["Carrito", "Pago", "Panel Admin"],
      "technologies": ["Next.js", "Supabase", "Stripe"]
    }
  },
  "gallery": [
    {
      "url": "https://example.com/screenshot1.jpg",
      "alt": "Homepage screenshot"
    },
    {
      "url": "https://example.com/screenshot2.jpg",
      "alt": "Admin panel"
    }
  ]
}
```

---

#### 3. `project_categories`

Junction table for many-to-many relationship.

```sql
CREATE TABLE project_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, category_id)
);

-- Indexes for join queries
CREATE INDEX project_categories_project_id_idx ON project_categories(project_id);
CREATE INDEX project_categories_category_id_idx ON project_categories(category_id);
```

**Constraints:**
- `UNIQUE(project_id, category_id)` - Prevents duplicate assignments
- `ON DELETE CASCADE` - Auto-deletes when project/category is deleted

---

#### 4. `sessions`

Analytics session tracking with fingerprinting.

```sql
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_fingerprint text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  country text,
  region text,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fingerprint lookups
CREATE INDEX sessions_fingerprint_idx ON sessions(session_fingerprint);
CREATE INDEX sessions_created_at_idx ON sessions(created_at DESC);
```

**Session Fingerprint**: Generated by `withTrackingMiddleware` from IP + User Agent + timestamp.

---

#### 5. `page_views`

Individual page view tracking.

```sql
CREATE TABLE page_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  page_url text NOT NULL,
  referrer text,
  entry_time timestamptz DEFAULT now(),
  exit_time timestamptz,
  duration integer GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (exit_time - entry_time))::integer
  ) STORED,
  created_at timestamptz DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX page_views_session_id_idx ON page_views(session_id);
CREATE INDEX page_views_page_url_idx ON page_views(page_url);
CREATE INDEX page_views_entry_time_idx ON page_views(entry_time DESC);
```

**Generated Column**: `duration` auto-calculates from `entry_time` and `exit_time`.

---

#### 6. `admin_users`

Extended admin user information.

```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for email lookups
CREATE INDEX admin_users_email_idx ON admin_users(email);
```

**Links to `auth.users`**: Uses same UUID for seamless integration with Supabase Auth.

---

## Migrations

### Migration Structure

Migrations are organized in `supabase/migrations/`:

```
supabase/migrations/
├── 20240101000000_create_categories.sql
├── 20240101000001_create_projects.sql
├── 20240101000002_create_project_categories.sql
├── 20240101000003_create_sessions.sql
├── 20240101000004_create_page_views.sql
└── 20240101000005_create_admin_users.sql
```

**Naming Convention**: `YYYYMMDDHHmmss_description.sql`

### Running Migrations

**Apply all pending migrations:**
```bash
supabase db push
```

**Check migration status:**
```bash
supabase migration list
```

**View differences:**
```bash
supabase db diff
```

### Creating New Migrations

**Generate migration from schema changes:**

1. Make changes in Supabase dashboard or SQL editor
2. Pull changes locally:

```bash
supabase db pull
```

**Create migration manually:**

```bash
supabase migration new add_project_status_column
```

Edit generated file:

```sql
-- supabase/migrations/20250127120000_add_project_status_column.sql
ALTER TABLE projects
ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));

CREATE INDEX projects_status_idx ON projects(status);
```

Apply migration:

```bash
supabase db push
```

### Migration Best Practices

1. **One migration per logical change**
   - Don't bundle unrelated schema changes
   - Easier to debug and rollback

2. **Always include rollback**
   - Comment rollback SQL at bottom of migration:
   ```sql
   -- Rollback:
   -- ALTER TABLE projects DROP COLUMN status;
   ```

3. **Test locally first**
   ```bash
   supabase db reset  # Resets local DB and applies all migrations
   ```

4. **Use transactions implicitly**
   - Supabase wraps each migration in a transaction
   - All changes succeed or all fail

5. **Avoid data migrations with hardcoded IDs**
   - UUIDs are different across environments
   - Use lookups instead:
   ```sql
   -- ❌ Bad
   INSERT INTO project_categories (project_id, category_id)
   VALUES ('550e8400-e29b-41d4-a716-446655440000', '...');

   -- ✅ Good
   INSERT INTO project_categories (project_id, category_id)
   SELECT p.id, c.id
   FROM projects p, categories c
   WHERE p.title = 'E-Commerce Platform'
   AND c.slug = 'web-development';
   ```

---

## Row Level Security (RLS)

### Why Use RLS?

Row Level Security provides **database-level authorization**:

- **Defense in depth**: Even if application code has bugs, database is protected
- **Granular control**: Different users see different rows
- **Performance**: PostgreSQL handles filtering efficiently
- **Simplicity**: No complex middleware logic needed

### Enabling RLS

**Enable RLS on all tables:**

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

**Verify RLS is enabled:**

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### RLS Policy Examples

#### Public Read Access

Allow anyone to read categories:

```sql
CREATE POLICY "public_read_categories"
ON categories
FOR SELECT
TO anon, authenticated
USING (true);
```

#### Authenticated Write Access

Only authenticated users can create projects:

```sql
CREATE POLICY "authenticated_insert_projects"
ON projects
FOR INSERT
TO authenticated
WITH CHECK (true);
```

#### Admin-Only Full Access

Only admins can update/delete:

```sql
CREATE POLICY "admin_full_access_projects"
ON projects
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);
```

#### Session-Specific Access

Users can only update their own page views:

```sql
CREATE POLICY "user_update_own_page_views"
ON page_views
FOR UPDATE
TO anon
USING (
  session_id IN (
    SELECT id FROM sessions
    WHERE session_fingerprint = current_setting('request.headers')::json->>'session_fingerprint'
  )
);
```

### Testing RLS Policies

**Test as anon role:**

```sql
SET ROLE anon;
SELECT * FROM categories;  -- Should work
INSERT INTO admin_users (email, name) VALUES ('test@example.com', 'Test');  -- Should fail
RESET ROLE;
```

**Test as authenticated user:**

```sql
-- Simulate authenticated user
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM projects;  -- Should work based on policy
```

### Common RLS Patterns

**Pattern 1: Public Read, Admin Write**

```sql
-- Read for everyone
CREATE POLICY "public_read" ON table_name FOR SELECT TO anon, authenticated USING (true);

-- Write for admins only
CREATE POLICY "admin_write" ON table_name FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "admin_update" ON table_name FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "admin_delete" ON table_name FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
```

**Pattern 2: Owner-Based Access**

```sql
-- Users can only access their own data
CREATE POLICY "owner_access" ON user_data FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

---

## Client Usage

### Three Supabase Clients

#### 1. Server Client (`lib/supabase/server.ts`)

**When to use:**
- Server components
- API routes
- Admin operations
- Authenticated requests

**Features:**
- Manages auth cookies with SSR
- Refreshes sessions automatically
- Access to service_role (with caution)

**Usage:**

```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*');

  return Response.json(data);
}
```

#### 2. Analytics Client (`lib/supabase/analytics.ts`)

**When to use:**
- Analytics API endpoints only
- Session tracking
- Page view tracking

**Features:**
- Always uses `anon` role
- No session management
- Lightweight for tracking

**Usage:**

```typescript
import { createAnalyticsClient } from '@/lib/supabase/analytics';

export async function POST(request: Request) {
  const supabase = createAnalyticsClient();

  const { data, error } = await supabase
    .from('sessions')
    .insert({ session_fingerprint: 'abc123' })
    .select()
    .single();

  return Response.json(data);
}
```

#### 3. Browser Client (`lib/supabase/client.ts`)

**When to use:**
- Client components
- Browser-only operations
- Real-time subscriptions (if used)

**Features:**
- Manages auth state in browser
- Persists session in localStorage
- Automatically refreshes tokens

**Usage:**

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*');
      setProjects(data || []);
    }
    fetchProjects();
  }, []);

  return <div>{/* Render projects */}</div>;
}
```

### Client Selection Matrix

| Use Case | Client Type | Reason |
|----------|------------|--------|
| Fetch projects in page | Server | SSR, better performance |
| Admin login | Server | Cookie management |
| Analytics tracking | Analytics | No auth needed |
| Client-side filtering | Browser | Interactive UI |
| Public data fetching | Any with RLS | RLS protects data |

---

## Common Queries

### Fetch Projects with Categories

```sql
SELECT
  p.id,
  p.title,
  p.content,
  p.image_url,
  ARRAY_AGG(DISTINCT c.name_en) AS categories_en,
  ARRAY_AGG(DISTINCT c.name_es) AS categories_es
FROM projects p
LEFT JOIN project_categories pc ON p.id = pc.project_id
LEFT JOIN categories c ON pc.category_id = c.id
GROUP BY p.id, p.title, p.content, p.image_url
ORDER BY p.display_order ASC, p.created_at DESC;
```

**TypeScript equivalent:**

```typescript
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    project_categories (
      categories (
        name_en,
        name_es
      )
    )
  `)
  .order('display_order', { ascending: true });
```

### Fetch Featured Projects

```sql
SELECT * FROM projects
WHERE featured = true
ORDER BY display_order ASC
LIMIT 6;
```

**TypeScript:**

```typescript
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('featured', true)
  .order('display_order', { ascending: true })
  .limit(6);
```

### Analytics: Page Views by URL

```sql
SELECT
  page_url,
  COUNT(*) AS total_views,
  AVG(duration) AS avg_duration_seconds,
  COUNT(DISTINCT session_id) AS unique_sessions
FROM page_views
WHERE entry_time > now() - interval '7 days'
GROUP BY page_url
ORDER BY total_views DESC;
```

**TypeScript (using SQL function):**

```typescript
const { data } = await supabase
  .rpc('get_page_stats', {
    days: 7
  });
```

### Find Projects by Tag

```sql
SELECT * FROM projects
WHERE tags @> ARRAY['Next.js']::text[]
ORDER BY created_at DESC;
```

**TypeScript:**

```typescript
const { data } = await supabase
  .from('projects')
  .select('*')
  .contains('tags', ['Next.js'])
  .order('created_at', { ascending: false });
```

### Search Localized Content (JSONB)

```sql
SELECT * FROM projects
WHERE
  content->'en'->>'title' ILIKE '%ecommerce%'
  OR content->'es'->>'title' ILIKE '%comercio%';
```

**TypeScript (use Postgres full-text search for production):**

```typescript
const { data } = await supabase
  .from('projects')
  .select('*')
  .or(`content->>en.title.ilike.%${searchTerm}%,content->>es.title.ilike.%${searchTerm}%`);
```

---

## Troubleshooting

### RLS Blocking Queries

**Symptom**: Queries return empty results or "permission denied"

**Solution**: Check RLS policies

```sql
-- View all policies
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Temporarily disable RLS for testing (NEVER in production)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- Test query
-- Re-enable
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

**Fix**: Add appropriate policy:

```sql
CREATE POLICY "allow_anon_select" ON projects
FOR SELECT TO anon USING (true);
```

### Migration Conflicts

**Symptom**: `supabase db push` fails with "already exists" error

**Solution**: Check migration history

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

**Fix**: Either:
1. Delete conflicting migration file
2. Or manually mark migration as applied:

```sql
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES ('20240127120000');
```

### Slow Queries

**Symptom**: Queries take >1 second

**Solution**: Check query plan

```sql
EXPLAIN ANALYZE
SELECT * FROM projects
WHERE content->'en'->>'title' ILIKE '%search%';
```

**Fix**: Add appropriate index

```sql
-- For JSONB queries
CREATE INDEX projects_en_title_idx ON projects ((content->'en'->>'title'));

-- For full-text search
CREATE INDEX projects_en_title_fts_idx ON projects USING gin(to_tsvector('english', content->'en'->>'title'));
```

### Connection Pool Exhausted

**Symptom**: "remaining connection slots reserved" error

**Solution**: Use connection pooling

**Fix**: Update connection string to use PgBouncer (port 6543):

```env
# ❌ Direct connection (port 5432)
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# ✅ Pooled connection (port 6543)
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:6543/postgres
```

---

## Best Practices

### 1. Always Enable RLS

```sql
-- Enable on table creation
CREATE TABLE new_table (...);
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add policies immediately
CREATE POLICY "public_read" ON new_table FOR SELECT TO anon USING (true);
```

### 2. Use Transactions for Related Changes

```typescript
const { data, error } = await supabase.rpc('create_project_with_categories', {
  p_title: 'New Project',
  p_category_ids: ['uuid1', 'uuid2']
});
```

**SQL function:**

```sql
CREATE OR REPLACE FUNCTION create_project_with_categories(
  p_title text,
  p_category_ids uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_project_id uuid;
  v_category_id uuid;
BEGIN
  -- Insert project
  INSERT INTO projects (title) VALUES (p_title)
  RETURNING id INTO v_project_id;

  -- Insert category relationships
  FOREACH v_category_id IN ARRAY p_category_ids
  LOOP
    INSERT INTO project_categories (project_id, category_id)
    VALUES (v_project_id, v_category_id);
  END LOOP;

  RETURN v_project_id;
END;
$$;
```

### 3. Add Indexes for Frequent Queries

```sql
-- Before adding index, check query performance
EXPLAIN ANALYZE SELECT * FROM projects WHERE featured = true;

-- Add index if query is slow
CREATE INDEX projects_featured_idx ON projects(featured) WHERE featured = true;

-- Verify improvement
EXPLAIN ANALYZE SELECT * FROM projects WHERE featured = true;
```

### 4. Use `RETURNING` for Insert/Update

```typescript
// ✅ Good - returns inserted data
const { data } = await supabase
  .from('projects')
  .insert({ title: 'New Project' })
  .select()
  .single();

// ❌ Bad - requires second query
const { data: inserted } = await supabase
  .from('projects')
  .insert({ title: 'New Project' });

const { data: project } = await supabase
  .from('projects')
  .select()
  .eq('id', inserted.id)
  .single();
```

### 5. Handle JSONB Carefully

```typescript
// ✅ Good - preserves structure
const { data } = await supabase
  .from('projects')
  .update({
    content: {
      en: { title: 'New Title', description: 'New Desc' },
      es: { title: 'Nuevo Título', description: 'Nueva Desc' }
    }
  })
  .eq('id', projectId);

// ❌ Bad - overwrites entire JSONB
const { data } = await supabase
  .from('projects')
  .update({
    content: { en: { title: 'New Title' } }  // Loses es content!
  })
  .eq('id', projectId);
```

### 6. Use TypeScript Types

Generate types from database:

```bash
supabase gen types typescript --project-id YOUR_PROJECT_REF > lib/database.types.ts
```

Use in code:

```typescript
import { Database } from '@/lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
```

### 7. Backup Before Major Changes

```bash
# Export database
supabase db dump -f backup.sql

# Later, restore if needed
supabase db reset --db-url YOUR_DB_URL
psql -h db.xxx.supabase.co -U postgres -d postgres -f backup.sql
```

---

## Resources

### Official Documentation

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

### Learning Resources

- [Supabase YouTube Channel](https://www.youtube.com/c/Supabase)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [JSONB Guide](https://www.postgresql.org/docs/current/datatype-json.html)

### Tools

- [Supabase Dashboard](https://app.supabase.com)
- [pgAdmin](https://www.pgadmin.org/) - GUI for PostgreSQL
- [Postman](https://www.postman.com/) - API testing

---

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploying to production
- [ADMIN_PANEL.md](ADMIN_PANEL.md) - Using the admin CMS
- [ANALYTICS.md](ANALYTICS.md) - Analytics system details
- [API_BEST_PRACTICES.md](API_BEST_PRACTICES.md) - API design patterns

---

**Need Help?**

- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)
