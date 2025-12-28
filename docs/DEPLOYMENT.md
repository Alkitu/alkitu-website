# Deployment Guide

Complete guide for deploying the Alkitu portfolio website to production using Vercel and Supabase.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Part 1: Supabase Setup](#part-1-supabase-setup)
4. [Part 2: Vercel Deployment](#part-2-vercel-deployment)
5. [Part 3: Post-Deployment](#part-3-post-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Continuous Deployment](#continuous-deployment)
8. [Rollback Procedure](#rollback-procedure)
9. [Monitoring & Logs](#monitoring--logs)
10. [Performance Optimization](#performance-optimization)
11. [Security Checklist](#security-checklist)
12. [Cost Considerations](#cost-considerations)

---

## Overview

### Deployment Architecture

This application uses a **JAMstack** architecture with separate hosting for frontend and backend:

- **Frontend**: Vercel (Next.js 16 App Router)
  - Serverless functions for API routes
  - Edge network CDN for static assets
  - Automatic HTTPS and custom domains

- **Backend**: Supabase (PostgreSQL + Auth)
  - Managed PostgreSQL database
  - Built-in authentication
  - Row Level Security (RLS)
  - RESTful API endpoints

**Data Flow:**
```
User Request
    ↓
Vercel Edge Network (CDN)
    ↓
Next.js App (SSR/SSG)
    ↓
API Routes (Serverless Functions)
    ↓
Supabase (PostgreSQL + Auth)
```

---

## Prerequisites

### Required Accounts

1. **GitHub Account**
   - Repository must be pushed to GitHub
   - Vercel will connect to your repository

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Free tier available (recommended for starting)

3. **Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Free tier includes 500MB database + 2GB bandwidth

### Required Tools

Install these CLI tools for deployment management:

```bash
# Vercel CLI (optional, for command-line deployments)
npm install -g vercel

# Supabase CLI (required for migrations)
brew install supabase/tap/supabase
# or
npm install -g supabase
```

### Repository Preparation

Ensure your repository is ready:

```bash
# Verify clean build locally
npm run build

# Commit all changes
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

---

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `alkitu-portfolio` (or your preference)
   - **Database Password**: Generate strong password (save securely!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan**: Free (or Pro if needed)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 2: Run Database Migrations

Navigate to your project directory and link to Supabase:

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Find your project ref at: Project Settings > General > Reference ID
```

Run all migrations to set up database schema:

```bash
# Apply all migrations
supabase db push

# Verify migrations applied
supabase db diff
```

**Expected tables created:**
- `categories` - Project categories with localized names
- `projects` - Projects with JSONB localized content
- `project_categories` - Many-to-many junction table
- `sessions` - Analytics session tracking
- `page_views` - Analytics page view tracking
- `admin_users` - Admin user accounts

### Step 3: Get API Keys

1. Go to **Project Settings** > **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL**: `https://YOUR_PROJECT_REF.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

**Security Note**: The `anon` key is safe to expose in frontend code - Row Level Security (RLS) policies protect your data.

### Step 4: Create Admin User

Create your first admin user via Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query:

```sql
-- Insert admin user (replace with your email)
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
  'your-email@example.com',
  crypt('your-secure-password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Your Name"}',
  now(),
  now()
)
RETURNING id;

-- Link to admin_users table (use ID from above)
INSERT INTO admin_users (id, email, name, role)
VALUES (
  'USER_ID_FROM_ABOVE',
  'your-email@example.com',
  'Your Name',
  'admin'
);
```

### Step 5: Verify RLS Policies

Ensure Row Level Security is enabled on all tables:

```sql
-- Check RLS is enabled (should return all tables)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;
```

**Expected output**: All 6 tables with `rowsecurity = true`

---

## Part 2: Vercel Deployment

### Step 1: Import Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **alkitu-website** repository
4. Click **"Import"**

### Step 2: Configure Build Settings

Vercel should auto-detect Next.js settings. Verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**Node.js Version**: Ensure Node.js 18+ is selected
- Go to **Settings** > **General** > **Node.js Version**
- Select `18.x` or higher

### Step 3: Add Environment Variables

Click **"Environment Variables"** section and add:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Analytics (if using Vercel Analytics)
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

**Important**:
- Use the exact variable names (case-sensitive)
- `NEXT_PUBLIC_` prefix makes variables available in browser
- No quotes needed around values in Vercel UI

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. Vercel will show build logs in real-time

**Success Indicators:**
- Build completes without errors
- Deployment URL appears (e.g., `alkitu-website.vercel.app`)
- Preview deployment is accessible

---

## Part 3: Post-Deployment

### Step 1: Verification Checklist

Visit your deployment URL and verify:

- [ ] **Homepage loads** (`/es` or `/en`)
- [ ] **Locale switching works** (navbar language toggle)
- [ ] **Theme switching works** (light/dark mode)
- [ ] **Projects page loads** with data from Supabase
- [ ] **Admin login accessible** (`/{locale}/auth/login`)
- [ ] **Admin login works** with created credentials
- [ ] **Analytics tracking** (check Supabase `sessions` table after visit)

### Step 2: Custom Domain (Optional)

Add your custom domain:

1. Go to **Project Settings** > **Domains**
2. Add domain (e.g., `alkitu.com`)
3. Configure DNS records:

**For root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (5-60 minutes)
5. Vercel auto-provisions SSL certificate

### Step 3: Production Environment Variables

Ensure environment variables are set for **Production** environment:

1. Go to **Settings** > **Environment Variables**
2. Verify variables have **Production** checkbox enabled
3. Redeploy if needed: **Deployments** > **⋯** > **Redeploy**

---

## Troubleshooting

### Build Fails with Dependency Errors

**Symptom**: `npm install` fails with peer dependency conflicts

**Solution**: Ensure `.npmrc` is committed to repository

```bash
# Create .npmrc if missing
echo "legacy-peer-deps=true" > .npmrc
git add .npmrc
git commit -m "fix: add .npmrc for React 19 compatibility"
git push
```

**Why**: React 19 + `@rive-app/react-canvas` have peer dependency conflicts resolved by `legacy-peer-deps`.

### Build Fails with "Module not found"

**Symptom**: TypeScript or module resolution errors

**Solution**: Check import paths use correct aliases

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';

// ❌ Wrong
import { Button } from '../../components/ui/button';
```

### Database Connection Fails

**Symptom**: API routes return 500 errors, logs show "Failed to connect to Supabase"

**Solution**: Verify environment variables

1. Check **Settings** > **Environment Variables**
2. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
3. Redeploy after fixing variables

### Analytics Not Tracking

**Symptom**: No sessions/page views in Supabase `sessions` table

**Solution**: Check RLS policies

```sql
-- Verify anon role has INSERT access
SELECT * FROM pg_policies
WHERE tablename IN ('sessions', 'page_views');
```

Should show policies allowing `anon` role to INSERT.

### 404 on Localized Routes

**Symptom**: `/es` or `/en` routes return 404

**Solution**: Check middleware configuration

```typescript
// proxy.ts - ensure withI18nMiddleware is in chain
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const handler = chain([
    withSupabaseMiddleware,
    withAuthMiddleware,
    withI18nMiddleware,  // ← Must be present
    withTrackingMiddleware,
  ]);
  return handler(request, event);
}
```

---

## Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys when you push to connected branch:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main  # Triggers deployment
```

**Deployment Flow:**
1. Push to GitHub
2. Vercel webhook triggers build
3. Build runs (2-5 minutes)
4. Deployment goes live automatically

**Branch Previews:**

Create preview deployments for feature branches:

```bash
git checkout -b feature/new-section
git push origin feature/new-section
```

Vercel creates preview URL: `alkitu-website-git-feature-new-section.vercel.app`

### Manual Deployment via CLI

Deploy from local machine:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Rollback Procedure

### Rollback to Previous Deployment

If new deployment has issues:

1. Go to **Deployments** tab
2. Find last working deployment
3. Click **⋯** > **Promote to Production**
4. Deployment is instantly rolled back

### Rollback Database Migrations

If migration causes issues:

```bash
# Check migration history
supabase db remote changes

# Reset to specific migration (replace with migration name)
supabase db reset --db-url YOUR_DB_URL --migrations-dir supabase/migrations

# Caution: This drops all data! Only use in development or with backups.
```

**Production Rollback**: Contact Supabase support for production database rollbacks.

---

## Monitoring & Logs

### Vercel Logs

**Real-time Function Logs:**
1. Go to **Deployments** > Select deployment
2. Click **Functions** tab
3. View logs for API routes

**Search Logs:**
```bash
vercel logs [deployment-url]
```

### Supabase Logs

**Database Logs:**
1. Go to **Logs** > **Database**
2. Filter by severity (Info, Warning, Error)
3. Search for specific queries

**API Logs:**
1. Go to **Logs** > **API**
2. View all requests to Supabase
3. Filter by status code

**Query Performance:**
1. Go to **Reports** > **Query Performance**
2. Identify slow queries
3. Add indexes if needed

---

## Performance Optimization

### Edge Functions

Next.js API routes run on Vercel's Edge Network:

```typescript
// app/api/projects/route.ts
export const runtime = 'edge'; // ← Enable edge runtime

export async function GET() {
  // Runs on edge, closer to users
}
```

**When to Use Edge:**
- Simple API routes
- No Node.js-specific APIs
- Require global low latency

**When to Use Node.js:**
- Complex operations
- Need Node.js libraries
- Database connections

### Incremental Static Regeneration (ISR)

Cache pages with revalidation:

```typescript
// app/[lang]/projects/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function ProjectsPage() {
  // Page is statically generated, revalidated every hour
}
```

### Image Optimization

Ensure Next.js Image component is used:

```tsx
import Image from 'next/image';

<Image
  src="/assets/project.jpg"
  alt="Project"
  width={800}
  height={600}
  priority  // For above-the-fold images
/>
```

Vercel automatically optimizes images via Edge Network.

### Database Connection Pooling

Supabase uses PgBouncer for connection pooling:

- **Direct connection**: `postgresql://postgres.xxx:5432/postgres`
- **Pooled connection**: `postgresql://postgres.xxx:6543/postgres` ← Use this

Update connection string if using direct connections.

---

## Security Checklist

### Environment Variables

- [ ] **No secrets in code** - All secrets in environment variables
- [ ] **`.env.local` in `.gitignore`** - Never commit local env files
- [ ] **Production-only secrets** - Use Vercel's environment scoping

### Supabase Security

- [ ] **RLS enabled** on all tables
- [ ] **anon key** has read-only access (via RLS)
- [ ] **service_role key** NEVER exposed in frontend
- [ ] **Strong admin passwords** (12+ characters, mixed case, symbols)

### HTTPS

- [ ] **Vercel auto-HTTPS** enabled (default)
- [ ] **Custom domain** has SSL certificate
- [ ] **HSTS headers** enabled (Vercel default)

### API Routes

- [ ] **Zod validation** on all API inputs
- [ ] **Rate limiting** (consider Vercel Pro for built-in protection)
- [ ] **Error messages** don't leak sensitive info

---

## Cost Considerations

### Vercel Free Tier Limits

- **Bandwidth**: 100GB/month
- **Serverless Function Executions**: 100GB-hours/month
- **Build Time**: 6,000 minutes/month
- **Domains**: Unlimited

**When to Upgrade to Pro ($20/month):**
- Exceed free tier limits
- Need advanced analytics
- Require team collaboration
- Want DDoS protection

### Supabase Free Tier Limits

- **Database**: 500MB storage
- **Bandwidth**: 2GB/month
- **File Storage**: 1GB
- **Monthly Active Users**: 50,000

**When to Upgrade to Pro ($25/month):**
- Exceed database storage
- Need daily backups
- Require 8GB+ RAM
- Want 7-day log retention

### Estimated Monthly Costs

**Personal Portfolio (Low Traffic)**:
- Vercel: Free
- Supabase: Free
- **Total**: $0/month

**Professional Portfolio (Medium Traffic)**:
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- **Total**: $45/month

---

## Next Steps

After deployment:

1. **Add Content**: Log in to `/admin` and add projects, categories
2. **Analytics**: Monitor traffic in admin dashboard
3. **SEO**: Add meta tags and sitemap (see [PERFORMANCE.md](PERFORMANCE.md))
4. **Monitoring**: Set up alerts for errors (Vercel + Supabase)
5. **Backups**: Enable Supabase automated backups (Pro plan)

---

## See Also

- [SUPABASE.md](SUPABASE.md) - Database setup and migrations
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [ENVIRONMENT.md](ENVIRONMENT.md) - Environment variable reference
- [PERFORMANCE.md](PERFORMANCE.md) - Optimization strategies

---

**Need Help?**

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Project Issues: [GitHub Issues](https://github.com/alkitu/alkitu-website/issues)
