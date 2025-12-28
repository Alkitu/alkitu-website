# Admin Panel Guide

Complete guide to using the admin CMS for managing projects, categories, users, and viewing analytics.

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing the Admin Panel](#accessing-the-admin-panel)
3. [Authentication](#authentication)
4. [Dashboard](#dashboard)
5. [Project Management](#project-management)
6. [Category Management](#category-management)
7. [User Management](#user-management)
8. [Database Tables](#database-tables)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### What is the Admin Panel?

The admin panel is a full-featured CMS (Content Management System) for managing all website content without touching code.

**Features:**

- **Project CRUD** - Create, read, update, delete projects
- **Localization** - Manage English and Spanish content
- **Image galleries** - Upload and organize project screenshots
- **Category management** - Create and assign project categories
- **User management** - Add/remove admin users
- **Analytics dashboard** - View traffic and engagement metrics
- **Display ordering** - Control project order on homepage

### Tech Stack

- **shadcn/ui components** - Beautiful, accessible UI
- **Supabase Auth** - Secure authentication
- **Supabase Database** - PostgreSQL with RLS
- **Zod validation** - Type-safe forms
- **Sonner** - Toast notifications

---

## Accessing the Admin Panel

### URL Structure

```
/{locale}/auth/login     - Login page
/admin                   - Redirects to /admin/dashboard
/admin/dashboard         - Analytics overview
/admin/projects          - Project management
/admin/project-categories - Category management
/admin/users             - User management
```

**Note**: Admin routes are **not localized** - always use `/admin/*`, not `/{locale}/admin/*`.

---

## Authentication

### Login Flow

1. **Navigate** to `/{locale}/auth/login` (e.g., `/es/auth/login`)
2. **Enter credentials**:
   - Email: Your admin email
   - Password: Your admin password
3. **Submit** form
4. **On success**: Redirect to `/admin/dashboard`
5. **On failure**: Error toast appears

### Session Management

- **Cookie-based**: Supabase Auth cookies
- **Auto-refresh**: Session refreshes via `withSupabaseMiddleware`
- **Timeout**: Sessions expire after inactivity (configurable in Supabase)
- **Logout**: Click logout button in admin nav

### Protection Mechanism

**Middleware**: `withAuthMiddleware` (position 2 in proxy chain)

**Flow:**

```
User requests /admin/projects
  ↓
withAuthMiddleware checks:
  - Is session cookie present?
  - Is user in admin_users table?
  ↓
✅ Yes → Allow access
❌ No  → Redirect to /{locale}/auth/login?error=unauthorized
```

### First-Time Setup

**Create admin user** via Supabase SQL Editor:

```sql
-- 1. Insert user into auth.users
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  'admin@alkitu.com',
  crypt('your-secure-password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  now(),
  now()
)
RETURNING id;

-- 2. Link to admin_users table (use ID from above)
INSERT INTO admin_users (id, email, name, role)
VALUES (
  'USER_ID_FROM_ABOVE',
  'admin@alkitu.com',
  'Admin User',
  'admin'
);
```

---

## Dashboard

**Location**: `/admin/dashboard`

### Metrics Displayed

1. **Total Sessions** - Unique visitors (last 7 days)
2. **Total Page Views** - All page loads (last 7 days)
3. **Average Session Duration** - Time spent per visit
4. **Top Pages** - Most visited URLs
5. **Traffic Sources** - Referrer breakdown
6. **Session Timeline** - Visitors over time (chart)

### Real-Time Updates

- Data updates on page load
- Manual refresh: Reload page
- Auto-refresh: Not implemented (future enhancement)

### Filtering

- **Time range**: Last 7 days, 30 days, all time
- **Page URL**: Filter by specific page
- **Date picker**: Custom date ranges

---

## Project Management

**Location**: `/admin/projects`

### Features

- **List view**: All projects with preview
- **Create**: Add new project
- **Edit**: Update existing project
- **Delete**: Remove project (with confirmation)
- **Display order**: Drag-and-drop ordering
- **Featured flag**: Mark for homepage showcase

---

### Creating a Project

**Steps:**

1. Click **"New Project"** button
2. Fill in **localized content**:

**English (en):**
   - Title
   - Description
   - Features (comma-separated list)
   - Technologies (comma-separated list)

**Spanish (es):**
   - Título
   - Descripción
   - Características (lista separada por comas)
   - Tecnologías (lista separada por comas)

3. **Upload images**:
   - Main image (required)
   - Gallery images (optional, multiple)

4. **Set metadata**:
   - Tags (e.g., "Next.js", "React", "TypeScript")
   - Display order (number, lower = higher position)
   - Featured (checkbox)

5. **Assign categories**:
   - Select one or more categories
   - Categories must exist (create via Category Management first)

6. Click **"Create Project"**

7. **Success**: Toast notification + redirect to project list

---

### Editing a Project

**Steps:**

1. Click **"Edit"** button on project card
2. **Update fields** (pre-filled with existing data)
3. **Upload new images** (optional, keeps existing if not changed)
4. **Update categories** (checkboxes)
5. Click **"Save Changes"**
6. **Success**: Toast notification + data refreshes

**Note**: Both English and Spanish content must be filled. Partial updates will fail validation.

---

### Deleting a Project

**Steps:**

1. Click **"Delete"** button on project card
2. **Confirmation dialog** appears
3. Click **"Confirm"**
4. **Database actions**:
   - Deletes from `projects` table
   - Cascade deletes from `project_categories` (junction table)
5. **Success**: Toast notification + project removed from list

**Warning**: Deletion is permanent and cannot be undone (unless you have backups).

---

### Display Ordering

**Purpose**: Control order of projects on homepage

**How it works:**

1. **Lower numbers appear first** (e.g., order 1, 2, 3)
2. **Edit** project and set `display_order` field
3. **Featured projects** respect display order
4. **Homepage query**: `ORDER BY display_order ASC, created_at DESC`

**Example:**

```
Display Order 1 → Project A (appears first)
Display Order 2 → Project B
Display Order 3 → Project C
Display Order 10 → Project D (appears last)
```

---

## Category Management

**Location**: `/admin/project-categories`

### Features

- **List view**: All categories with project counts
- **Create**: Add new category
- **Edit**: Update category names
- **Delete**: Remove category (only if no projects assigned)

---

### Creating a Category

**Steps:**

1. Click **"New Category"** button
2. Fill in **localized names**:
   - English name (e.g., "Web Development")
   - Spanish name (e.g., "Desarrollo Web")
   - Slug (auto-generated from English name, e.g., "web-development")
3. Click **"Create Category"**
4. **Success**: Toast notification + category appears in list

**Slug rules:**

- Lowercase
- Hyphens instead of spaces
- No special characters
- Unique (enforced by database)

---

### Editing a Category

**Steps:**

1. Click **"Edit"** button on category card
2. **Update names** (English and/or Spanish)
3. **Slug** cannot be changed (used in URLs)
4. Click **"Save Changes"**
5. **Success**: Toast notification + data refreshes

---

### Deleting a Category

**Steps:**

1. Click **"Delete"** button on category card
2. **Check if used**: Category with assigned projects cannot be deleted
3. **Confirmation dialog** appears
4. Click **"Confirm"**
5. **Success**: Toast notification + category removed

**Error**: If category has projects, you'll see:

> "Cannot delete category: 5 projects are still assigned"

**Solution**: Reassign projects to other categories first.

---

### Assigning Categories to Projects

**Done in Project Management:**

1. Edit project
2. **Category checkboxes** appear
3. Check desired categories
4. Save project

**Result**: Many-to-many relationship via `project_categories` junction table.

---

## User Management

**Location**: `/admin/users`

### Features

- **List view**: All admin users
- **Create**: Add new admin (requires manual database entry)
- **View**: Last login timestamp
- **Delete**: Remove admin access

### Adding a New Admin User

**Currently**: Manual process via Supabase SQL Editor

**Steps:**

1. Go to Supabase Dashboard > SQL Editor
2. Run admin user creation query (see [Authentication](#first-time-setup))
3. User can now log in via `/{locale}/auth/login`

**Future enhancement**: UI form for creating admin users.

---

### Viewing User Activity

**Last Login column** shows when user last authenticated.

**Updates automatically** on each login via:

```sql
UPDATE admin_users
SET last_login = now()
WHERE id = 'USER_ID';
```

---

### Removing Admin Access

**Steps:**

1. Click **"Remove"** button on user card
2. **Confirmation dialog** appears
3. Click **"Confirm"**
4. **Database actions**:
   - Deletes from `admin_users` table
   - Cascade deletes from `auth.users` (optional, depends on schema)
5. **Success**: User can no longer access `/admin`

---

## Database Tables

### Tables Used by Admin Panel

**1. `projects`**
- Stores project data with JSONB localized content
- See [SUPABASE.md](SUPABASE.md) for full schema

**2. `categories`**
- Bilingual category names
- Slug for URL-safe identifiers

**3. `project_categories`**
- Junction table (many-to-many)
- Links projects to categories

**4. `admin_users`**
- Extended admin user info
- Links to `auth.users` via same UUID

**5. `sessions` and `page_views`**
- Analytics data displayed on dashboard

---

### Data Integrity

**Foreign keys ensure:**

- Projects can't reference non-existent categories
- Page views can't exist without sessions
- Admin users must have corresponding auth.users

**Cascade deletes:**

- Deleting project → Deletes project_categories entries
- Deleting session → Deletes page_views entries

---

## Security

### Protection Layers

**1. Middleware** (`withAuthMiddleware`)
- Blocks unauthenticated requests
- Runs on every `/admin/*` route

**2. Row Level Security (RLS)**
- Database-level access control
- Even with valid session, must be in `admin_users` table

**3. API Validation** (Zod)
- All API routes validate inputs
- Prevents malformed data

**4. Supabase Auth**
- Secure password hashing (bcrypt)
- Session management with JWT tokens

---

### Best Practices

**1. Strong Passwords**
- Minimum 12 characters
- Mix of letters, numbers, symbols
- Use password manager

**2. Limited Admin Users**
- Only create admins who need access
- Review user list regularly
- Remove inactive users

**3. HTTPS Only**
- Vercel enforces HTTPS automatically
- Never disable in production

**4. Session Timeout**
- Configure in Supabase Dashboard
- Recommended: 24 hours max

**5. Audit Logs**
- Monitor `admin_users.last_login`
- Check Supabase Auth logs for suspicious activity

---

## Troubleshooting

### Can't Log In

**Symptom**: "Invalid credentials" error

**Solutions:**

1. **Check email** is in `admin_users` table:

```sql
SELECT * FROM admin_users WHERE email = 'your-email@example.com';
```

2. **Reset password** via Supabase Dashboard:

Auth > Users > Find user > Reset password

3. **Verify RLS policies** allow auth access:

```sql
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

---

### Redirected to Login After Successful Login

**Symptom**: Login succeeds but immediately redirects back

**Solutions:**

1. **Check cookies are enabled** in browser

2. **Verify Supabase URL** in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

3. **Clear browser cache** and cookies

4. **Check `withAuthMiddleware`** is in proxy chain:

```typescript
// proxy.ts
export async function proxy(request, event) {
  const handler = chain([
    withSupabaseMiddleware,
    withAuthMiddleware,  // ← Must be present
    // ...
  ]);
  return handler(request, event);
}
```

---

### Projects Not Appearing on Homepage

**Symptom**: Created projects don't show on website

**Solutions:**

1. **Check `featured` flag** is enabled (for featured sections)

2. **Verify `display_order`** is set:

```sql
SELECT id, title, display_order, featured FROM projects ORDER BY display_order;
```

3. **Check both locales** have content:

```sql
SELECT id, content FROM projects;
-- content should have both 'en' and 'es' keys
```

4. **Clear Next.js cache**:

```bash
rm -rf .next
npm run build
npm run dev
```

---

### Can't Delete Category

**Symptom**: "Cannot delete category" error

**Solution**: Category is still assigned to projects

**Steps to delete:**

1. **Find projects using category**:

```sql
SELECT p.id, p.title
FROM projects p
JOIN project_categories pc ON p.id = pc.project_id
WHERE pc.category_id = 'CATEGORY_ID';
```

2. **Edit each project** and unassign the category
3. **Try deleting again**

---

### Images Not Uploading

**Symptom**: Image upload fails or images don't appear

**Solutions:**

1. **Check file size** - Max 10MB (configurable)
2. **Check file format** - Only JPG, PNG, WebP allowed
3. **Verify Supabase Storage** is configured (if using Storage bucket)
4. **Check image URL** is valid in database:

```sql
SELECT id, image_url, gallery FROM projects WHERE id = 'PROJECT_ID';
```

---

## See Also

- [SUPABASE.md](SUPABASE.md) - Database schema and RLS
- [ANALYTICS.md](ANALYTICS.md) - Analytics system details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploying admin panel
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - General issues

---

**The admin panel is your control center. Keep credentials secure and review content regularly.**
