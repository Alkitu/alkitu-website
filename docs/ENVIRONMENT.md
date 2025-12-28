# Environment Variables Reference

Complete reference for all environment variables used in the Alkitu portfolio website.

---

## Table of Contents

1. [Overview](#overview)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [Environment-Specific Configuration](#environment-specific-configuration)
5. [Security Best Practices](#security-best-practices)
6. [Vercel Configuration](#vercel-configuration)

---

## Overview

### File Structure

```
.env.local          # Local development (gitignored)
.env.example        # Template with dummy values (committed)
.env.production     # Production overrides (Vercel only)
```

### Variable Types

**Public variables** (`NEXT_PUBLIC_*`):
- Exposed to browser
- Safe for client-side code
- Used for API endpoints, public keys

**Private variables** (no prefix):
- Server-side only
- Never sent to browser
- Used for secrets, service keys

---

## Required Variables

### Supabase Configuration

#### NEXT_PUBLIC_SUPABASE_URL

**Purpose**: Supabase project URL

**Type**: Public

**Example**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

**How to get**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project
3. Project Settings > API > Project URL

**Required for**: Database connections, auth, all Supabase features

---

#### NEXT_PUBLIC_SUPABASE_ANON_KEY

**Purpose**: Supabase anonymous/public API key

**Type**: Public

**Example**:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjUwMjQwMCwiZXhwIjoxOTU4MDc4NDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get**:
1. Supabase Dashboard > Project Settings > API
2. Copy "anon" key under "Project API keys"

**Security**: Safe to expose (protected by Row Level Security)

**Required for**: All Supabase client operations

---

## Optional Variables

### Supabase Service Role Key

#### SUPABASE_SERVICE_ROLE_KEY

**Purpose**: Admin key bypassing RLS (use with caution!)

**Type**: Private (server-side only)

**Example**:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQyNTAyNDAwLCJleHAiOjE5NTgwNzg0MDB9.yyyyyyyyyyyyyyyyyyyyyyyyy
```

**Use cases**:
- Admin operations bypassing RLS
- Bulk data imports
- Server-side migrations

**⚠️ Security Warning**:
- **NEVER expose in client code**
- **NEVER commit to Git**
- Only use in API routes or server components

---

### Analytics

#### NEXT_PUBLIC_VERCEL_ANALYTICS_ID

**Purpose**: Vercel Analytics tracking ID

**Type**: Public

**Example**:
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=prj_xxxxxxxxxxxxx
```

**Required**: Only if using Vercel Analytics (optional)

**How to get**:
1. Vercel Dashboard > Project > Analytics
2. Enable Analytics
3. Copy tracking ID

---

### Feature Flags

#### NEXT_PUBLIC_ENABLE_ANALYTICS

**Purpose**: Toggle analytics tracking on/off

**Type**: Public

**Example**:
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Values**: `true` or `false`

**Default**: `true`

**Use case**: Disable analytics in development

---

#### NEXT_PUBLIC_ENABLE_ANIMATIONS

**Purpose**: Toggle Framer Motion animations

**Type**: Public

**Example**:
```env
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

**Values**: `true` or `false`

**Use case**: Disable for accessibility or performance testing

---

## Environment-Specific Configuration

### Local Development (`.env.local`)

**Full example**:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://localhost.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Optional: Service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

**Tips**:
- Use local Supabase instance for development (via `supabase start`)
- Disable analytics to avoid polluting production data
- Enable animations to test UX

---

### Production (Vercel)

**Set in Vercel Dashboard**:

1. Project Settings > Environment Variables
2. Add each variable with:
   - **Key**: Variable name
   - **Value**: Actual value
   - **Environments**: Production, Preview, Development

**Production values**:

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://production.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...production-key...

# Analytics enabled
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

### Preview Deployments

**Use same as production** or create separate Supabase project:

```env
# Supabase Staging
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...staging-key...
```

**Benefits**:
- Test database changes without affecting production
- Separate analytics data

---

## Security Best Practices

### 1. Never Commit Secrets

**✅ Do**:
```bash
# .gitignore
.env.local
.env*.local
```

**❌ Don't**:
```bash
git add .env.local  # NEVER DO THIS
```

---

### 2. Use Different Keys Per Environment

**✅ Do**:
- Development: `dev-supabase-project`
- Staging: `staging-supabase-project`
- Production: `prod-supabase-project`

**❌ Don't**:
- Use same Supabase project for all environments

---

### 3. Rotate Keys Regularly

**When to rotate**:
- Every 90 days (recommended)
- After team member leaves
- If key exposed in logs/code

**How to rotate**:
1. Generate new key in Supabase Dashboard
2. Update in Vercel
3. Redeploy
4. Revoke old key

---

### 4. Validate Environment Variables

**Add runtime validation** (`lib/env.ts`):

```typescript
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
```

**Call in layout**:

```typescript
// app/layout.tsx
import { validateEnv } from '@/lib/env';

validateEnv();  // Fails fast if missing variables
```

---

### 5. Use Type-Safe Environment Variables

**Define types** (`env.d.ts`):

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    NEXT_PUBLIC_ENABLE_ANALYTICS?: 'true' | 'false';
  }
}
```

**Access with autocomplete**:

```typescript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;  // Type: string
```

---

## Vercel Configuration

### Adding Variables

**Via Dashboard**:

1. Go to project settings
2. Click "Environment Variables"
3. Add variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://...`
   - **Environments**: Select all (Production, Preview, Development)
4. Click "Save"

---

### Environment Scoping

**Production only**:
- Only available in production deployments
- Use for production API keys

**Preview only**:
- Only in preview deployments (PRs)
- Use for staging API keys

**Development only**:
- Only in `vercel dev`
- Rarely used (prefer `.env.local`)

---

### Updating Variables

**After updating**:

1. Variables don't auto-apply to existing deployments
2. Must redeploy:
   - Deployments > ⋯ > Redeploy
   - Or push new commit

---

### Vercel CLI

**List variables**:

```bash
vercel env ls
```

**Add variable**:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Follow prompts
```

**Pull production variables to local**:

```bash
vercel env pull .env.local
```

---

## Troubleshooting

### Variable Not Defined in Browser

**Symptom**: `process.env.NEXT_PUBLIC_X` is `undefined` in client code

**Solutions**:

1. **Check prefix**: Must start with `NEXT_PUBLIC_`

```env
# ✅ Works in browser
NEXT_PUBLIC_SUPABASE_URL=...

# ❌ Only works server-side
SUPABASE_URL=...
```

2. **Restart dev server** after adding variable

3. **Check Vercel deployment** has variable set

---

### Variable Not Updating

**Symptom**: Changed variable but old value still used

**Solutions**:

1. **Delete `.next` cache**:

```bash
rm -rf .next
npm run dev
```

2. **Redeploy on Vercel**:

Deployments > ⋯ > Redeploy

---

### Service Role Key Exposed

**If `SUPABASE_SERVICE_ROLE_KEY` accidentally committed:**

1. **Revoke immediately** in Supabase Dashboard
2. **Generate new key**
3. **Update in Vercel**
4. **Remove from Git history**:

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all
```

5. **Force push** (if necessary)

---

## See Also

- [SETUP.md](SETUP.md) - Initial environment setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production configuration
- [SUPABASE.md](SUPABASE.md) - Supabase credentials
- [SECURITY.md](SECURITY.md) - Security best practices

---

**Environment variables are the keys to your kingdom. Protect them like passwords.**
