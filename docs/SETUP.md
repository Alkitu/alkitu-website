# Setup Guide

Complete step-by-step guide for setting up the Alkitu portfolio website on your local machine.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [IDE Configuration](#ide-configuration)
6. [Verification](#verification)
7. [Common Pitfalls](#common-pitfalls)
8. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

Install these before starting:

**1. Node.js (v18 or higher)**

```bash
# Check version
node --version  # Should be v18.0.0 or higher

# Install via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**2. npm (comes with Node.js)**

```bash
# Check version
npm --version  # Should be 9.0.0 or higher
```

**3. Git**

```bash
# Check version
git --version

# Install (macOS)
brew install git

# Install (Ubuntu)
sudo apt-get install git
```

**4. Code Editor (recommended: VSCode)**

- Download from [code.visualstudio.com](https://code.visualstudio.com/)

---

### Recommended Tools

**Supabase CLI** (for database migrations):

```bash
# macOS
brew install supabase/tap/supabase

# npm (all platforms)
npm install -g supabase
```

**Vercel CLI** (optional, for deployment):

```bash
npm install -g vercel
```

---

## Installation

### Step 1: Clone Repository

```bash
# Clone via HTTPS
git clone https://github.com/alkitu/alkitu-website.git

# Or clone via SSH
git clone git@github.com:alkitu/alkitu-website.git

# Navigate to project
cd alkitu-website
```

---

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# This will take 2-5 minutes
```

**Expected output:**

```
added 847 packages, and audited 848 packages in 2m
```

**If you see peer dependency warnings:**

```
npm WARN ERESOLVE overriding peer dependency
```

This is **normal** due to React 19 compatibility. The `.npmrc` file handles this with `legacy-peer-deps=true`.

---

### Step 3: Verify Installation

```bash
# Check for node_modules
ls node_modules  # Should show many packages

# Check package.json scripts
npm run  # Shows available commands
```

---

## Environment Configuration

### Step 1: Create Environment File

```bash
# Copy example file
cp .env.example .env.local

# Or create manually
touch .env.local
```

---

### Step 2: Add Supabase Credentials

Open `.env.local` and add:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get these values:**

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project (or create new one)
3. Navigate to **Project Settings** > **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Don't have a Supabase project yet?** See [Database Setup](#database-setup) below.

---

### Step 3: Verify Environment Variables

```bash
# Check file exists
cat .env.local

# Should show your Supabase credentials
```

**Important**: `.env.local` is in `.gitignore` - never commit this file!

---

## Database Setup

### Option 1: Use Existing Supabase Project

If you already have a Supabase project:

**1. Link to project:**

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**2. Pull remote schema:**

```bash
supabase db pull
```

**3. Apply local migrations:**

```bash
supabase db push
```

---

### Option 2: Create New Supabase Project

**1. Create project:**

- Go to [app.supabase.com](https://app.supabase.com)
- Click **"New Project"**
- Fill in:
  - **Name**: `alkitu-portfolio`
  - **Database Password**: Generate strong password (save it!)
  - **Region**: Select closest to you
- Wait 2-3 minutes for provisioning

**2. Get credentials** (see [Environment Configuration](#step-2-add-supabase-credentials))

**3. Apply migrations:**

```bash
# Link to project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations
supabase db push
```

**4. Verify tables created:**

```bash
supabase db diff
# Should show no differences (all migrations applied)
```

**Expected tables:**
- `categories`
- `projects`
- `project_categories`
- `sessions`
- `page_views`
- `admin_users`

---

### Create First Admin User

Run this in Supabase SQL Editor:

```sql
-- Insert admin user
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
  'admin@example.com',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  now(),
  now()
)
RETURNING id;

-- Link to admin_users (use ID from above)
INSERT INTO admin_users (id, email, name, role)
VALUES (
  'PASTE_ID_HERE',
  'admin@example.com',
  'Admin User',
  'admin'
);
```

---

## IDE Configuration

### VSCode Extensions (Recommended)

Install these extensions for best experience:

1. **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
2. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
3. **ESLint** - `dbaeumer.vscode-eslint`
4. **Prettier** - `esbenp.prettier-vscode`
5. **TypeScript Vue Plugin (Volar)** - `Vue.volar`

**Install via command palette:**

```
Cmd+Shift+P > Extensions: Install Extensions > Search for extension
```

---

### VSCode Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

### TypeScript Configuration

Verify `tsconfig.json` has correct settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Restart TypeScript server** after changes:

```
Cmd+Shift+P > TypeScript: Restart TS Server
```

---

## Verification

### Step 1: Start Development Server

```bash
npm run dev
```

**Expected output:**

```
   ▲ Next.js 16.0.10
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.x:3000

 ✓ Ready in 3.2s
```

---

### Step 2: Open in Browser

Navigate to `http://localhost:3000`

**Expected behavior:**
- Automatically redirects to `/es` (default locale)
- Homepage loads with hero section
- No errors in browser console

---

### Step 3: Test Locale Switching

**Manual test:**

1. Visit `http://localhost:3000/en` (English)
2. Visit `http://localhost:3000/es` (Spanish)
3. Content should change based on locale
4. Cookie `NEXT_LOCALE` should be set (check DevTools > Application > Cookies)

---

### Step 4: Test Admin Access

1. Navigate to `http://localhost:3000/es/auth/login`
2. Enter admin credentials (from database setup)
3. Should redirect to `/admin/dashboard`
4. Dashboard shows analytics (may be empty if no traffic yet)

**If redirected back to login:**
- Check Supabase credentials in `.env.local`
- Verify admin user exists in `admin_users` table

---

### Step 5: Run Build

```bash
# Build for production
npm run build
```

**Expected output:**

```
Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /[lang]                              ...      ...
└ ○ /[lang]/about                        ...      ...

○  (Static)  prerendered as static HTML
```

**If build fails:**
- Check for TypeScript errors: `npx tsc --noEmit`
- Check for ESLint errors: `npm run lint`

---

## Common Pitfalls

### Issue 1: Port 3000 Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID_NUMBER

# Or use different port
npm run dev -- -p 3001
```

---

### Issue 2: Module Not Found Errors

**Error:**

```
Module not found: Can't resolve '@/components/...'
```

**Solutions:**

1. **Delete `.next` cache:**

```bash
rm -rf .next
npm run dev
```

2. **Reinstall dependencies:**

```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Check `tsconfig.json` paths** (see [TypeScript Configuration](#typescript-configuration))

---

### Issue 3: Supabase Connection Failed

**Error in browser console:**

```
Failed to fetch from Supabase
```

**Solutions:**

1. **Check `.env.local` exists** and has correct values

2. **Restart dev server** after changing env vars

3. **Verify Supabase project is active:**
   - Go to Supabase dashboard
   - Check project status (should be "Active", not "Paused")

4. **Test connection:**

```bash
curl https://YOUR_PROJECT_REF.supabase.co/rest/v1/
```

Should return Supabase API info (not 404).

---

### Issue 4: TypeScript Errors in IDE

**Symptom**: VSCode shows red squiggles but code runs fine

**Solutions:**

1. **Restart TS server:**

```
Cmd+Shift+P > TypeScript: Restart TS Server
```

2. **Use workspace TypeScript:**

```
Click TypeScript version in bottom-right > Use Workspace Version
```

3. **Check node_modules:**

```bash
# Ensure TypeScript is installed
ls node_modules/typescript
```

---

### Issue 5: Tailwind Classes Not Working

**Symptom**: Tailwind classes in code don't generate styles

**Solutions:**

1. **Check `globals.css` has Tailwind imports:**

```css
@import "tailwindcss";

@theme {
  --color-primary: #00BB31;
}
```

2. **Delete `.next` cache:**

```bash
rm -rf .next
npm run dev
```

3. **Verify PostCSS config** (`postcss.config.js`):

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
```

---

## Next Steps

### 1. Explore Documentation

Now that you're set up, read:

- [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - How i18n works
- [ANIMATIONS.md](ANIMATIONS.md) - Framer Motion and Rive patterns
- [ADMIN_PANEL.md](ADMIN_PANEL.md) - Using the CMS
- [SUPABASE.md](SUPABASE.md) - Database details

---

### 2. Add Sample Data

**Create categories:**

1. Go to `/admin/project-categories`
2. Add categories like:
   - Web Development / Desarrollo Web
   - Mobile Apps / Aplicaciones Móviles
   - UI/UX Design / Diseño UI/UX

**Create projects:**

1. Go to `/admin/projects`
2. Add sample project with localized content
3. Assign categories
4. Upload images

---

### 3. Customize Content

**Update translations:**

Edit `app/dictionaries/en.json` and `app/dictionaries/es.json`

**Update theme colors:**

Edit `app/globals.css`:

```css
@theme {
  --color-primary: #YOUR_COLOR;
  --color-secondary: #YOUR_COLOR;
}
```

---

### 4. Learn the Codebase

**Key files to understand:**

- `app/[lang]/layout.tsx` - Root layout with providers
- `app/[lang]/page.tsx` - Homepage
- `proxy.ts` - Middleware chain
- `lib/supabase/` - Database clients

**Component structure:**

```
app/components/
├── atoms/       - Smallest components
├── molecules/   - Composed components
├── organisms/   - Complex sections
└── templates/   - Page layouts
```

---

### 5. Start Development

**Make your first change:**

1. Edit `app/dictionaries/en.json`:
   ```json
   {
     "home": {
       "hero": {
         "title": "Your Custom Title"
       }
     }
   }
   ```

2. See change at `http://localhost:3000/en`

3. Commit your change:
   ```bash
   git add app/dictionaries/en.json
   git commit -m "feat: update homepage title"
   ```

---

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CLAUDE.md](CLAUDE.md) - AI assistant instructions

---

**Welcome to the team! If you encounter any issues, check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open a GitHub issue.**
