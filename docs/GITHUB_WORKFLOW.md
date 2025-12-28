# GitHub Workflow Guide

Complete guide for managing issues, pull requests, and project workflow using GitHub.

---

## Table of Contents

1. [Issue Templates](#issue-templates)
2. [Creating Issues](#creating-issues)
3. [Labels and Organization](#labels-and-organization)
4. [Pull Request Workflow](#pull-request-workflow)
5. [Project Board (Optional)](#project-board-optional)
6. [Best Practices](#best-practices)

---

## Issue Templates

The project includes 5 professional issue templates following PRD best practices with a mix of product vision and technical specifications.

### Available Templates

Located in `.github/ISSUE_TEMPLATE/`:

#### 1. 🚀 Feature Request (`feature.yml`)

**When to use:** Proposing new functionality or capabilities

**Includes:**
- User Story (Gherkin format: Como/Quiero/Para)
- Product Context (problem, impact, business priority)
- Acceptance Criteria (checklist)
- Technical Specifications
- Priority levels (P0-P3)
- Design/Mockups section

**Example use case:**
- Adding user authentication with 2FA
- Implementing real-time notifications
- Creating new admin dashboard section

---

#### 2. 🐛 Bug Report (`bug.yml`)

**When to use:** Reporting unexpected behavior or errors

**Includes:**
- Bug description
- Steps to reproduce
- Expected vs Actual behavior
- Environment details (browser, OS, URL)
- Logs/Screenshots
- Severity levels (Critical → Low)
- Technical context

**Example use case:**
- Error 500 when creating projects in admin panel
- Analytics not tracking page views
- i18n translations missing on specific pages

---

#### 3. ✅ Task (`task.yml`)

**When to use:** Technical or operational work

**Includes:**
- Task description and justification
- Acceptance criteria checklist
- Technical approach
- Dependencies tracking
- Task type dropdown:
  - 🔄 Refactoring
  - 📦 Dependencies Update
  - ⚡ Performance Optimization
  - 🔒 Security Fix
  - 📚 Documentation
  - 🧹 Code Cleanup
  - 🔧 Configuration
  - 🧪 Testing
- Time estimation

**Example use case:**
- Update React 19.2.0 to 19.2.3
- Refactor authentication middleware
- Configure Google Search Console
- Update documentation

---

#### 4. ❓ Question / Issue (`issue.yml`)

**When to use:** Asking questions or discussing topics

**Includes:**
- Question description
- Context and background
- Solutions attempted
- Options being considered
- Category dropdown (Architecture, Security, Performance, etc.)
- References/Links

**Example use case:**
- Best approach for implementing 2FA
- Database schema design discussion
- i18n strategy for dynamic content
- Performance optimization approaches

---

#### 5. ⚡ Enhancement (`enhancement.yml`)

**When to use:** Improving existing functionality

**Includes:**
- Current state description
- Proposed improvement
- User value/impact
- Acceptance criteria
- Technical approach
- Enhancement type:
  - 🎨 UI/UX Improvement
  - ⚡ Performance Optimization
  - ♿ Accessibility Enhancement
  - 📱 Mobile Experience
  - 🔒 Security Hardening
  - 🌐 i18n/Localization
  - 🧹 Code Quality
- Success metrics

**Example use case:**
- Improve mobile filter UX
- Optimize image loading performance
- Enhance keyboard navigation
- Improve analytics dashboard UI

---

## Creating Issues

### Using Templates via GitHub UI

1. **Navigate to Issues tab** in GitHub repository
2. **Click "New Issue"**
3. **Select template** from the options presented
4. **Fill out the form** - all required fields are marked
5. **Submit** - issue will be created with appropriate labels

### Using Pre-written Tickets

For specific implementation tickets (located in `.github/ISSUE_TEMPLATE/tickets/`):

1. **Navigate to Issues → New Issue**
2. **Select appropriate template** (Task or Feature)
3. **Copy content** from ticket markdown file
4. **Paste into issue body**
5. **Add labels** as specified in ticket header
6. **Submit**

**Available tickets:**
- `google-search-console-verification.md` - SEO verification task (P1)
- `add-blog-to-sitemap.md` - Blog sitemap feature (P2)

---

## Labels and Organization

### Priority Labels

Use these to indicate urgency and importance:

- `🔴 P0 - Critical` - System down, major functionality broken
- `🟠 P1 - High` - Important feature/fix, significant impact
- `🟡 P2 - Medium` - Desirable improvement, moderate impact
- `🟢 P3 - Low` - Nice to have, minimal impact

### Type Labels

Automatically added by templates:
- `feature` - New functionality
- `bug` - Error or unexpected behavior
- `task` - Technical/operational work
- `question` - Discussion or inquiry
- `enhancement` - Improvement to existing feature

### Domain Labels

Add manually to categorize by area:
- `seo` - Search engine optimization
- `blog` - Blog-related
- `i18n` - Internationalization
- `analytics` - Analytics tracking
- `admin` - Admin panel
- `database` - Supabase/database
- `ui/ux` - User interface/experience
- `performance` - Performance optimization
- `security` - Security-related
- `documentation` - Documentation updates

### Status Labels

Track progress manually:
- `needs-triage` - Requires review and prioritization
- `approved` - Ready for implementation
- `in-progress` - Currently being worked on
- `blocked` - Waiting on dependencies
- `review` - Code review in progress
- `testing` - In QA/testing phase

---

## Pull Request Workflow

### Creating a Pull Request

**Standard workflow:**

1. **Create feature branch**
   ```bash
   git checkout -b feature/add-blog-sitemap
   ```

2. **Make changes** following project conventions (see CLAUDE.md)

3. **Commit with co-authorship**
   ```bash
   git commit -m "feat: Add blog posts to sitemap

   - Implement getBlogPostsForSitemap()
   - Add generateBlogSitemapEntries()
   - Update app/sitemap.ts with blog routes

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

4. **Push to remote**
   ```bash
   git push -u origin feature/add-blog-sitemap
   ```

5. **Create PR on GitHub**
   - Add descriptive title
   - Reference related issues: "Closes #123"
   - Add reviewers if applicable
   - Add labels

### PR Description Template

```markdown
## Summary

Brief description of changes

## Related Issues

Closes #123
Related to #456

## Changes Made

- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

## Testing

- [ ] npm run build succeeds
- [ ] Manual testing completed
- [ ] No TypeScript errors
- [ ] Verified in dev environment

## Screenshots (if applicable)

[Add screenshots]

## Checklist

- [ ] Code follows project conventions
- [ ] i18n translations added (if applicable)
- [ ] Documentation updated
- [ ] No breaking changes OR migration guide provided
```

### Code Review Process

**As author:**
1. Ensure all tests pass
2. Self-review code before requesting review
3. Address review comments promptly
4. Update PR based on feedback

**As reviewer:**
1. Check code quality and conventions
2. Verify tests and documentation
3. Test locally if significant changes
4. Provide constructive feedback
5. Approve when satisfied

---

## Project Board (Optional)

GitHub Projects can be used to visualize workflow.

### Suggested Columns

1. **Backlog** - Approved but not started
2. **To Do** - Ready for implementation
3. **In Progress** - Currently being worked on
4. **Review** - PR submitted, awaiting review
5. **Done** - Merged and deployed

### Automation

Set up automation rules:
- Move to "In Progress" when PR is opened
- Move to "Review" when PR is marked ready for review
- Move to "Done" when PR is merged

---

## Best Practices

### Issue Management

**DO:**
- ✅ Use appropriate template for issue type
- ✅ Fill out all required fields thoroughly
- ✅ Add relevant labels for better organization
- ✅ Reference related issues with #number
- ✅ Update issue status when starting work
- ✅ Close issues when resolved (via PR or manually)
- ✅ Be specific and detailed in descriptions

**DON'T:**
- ❌ Create duplicate issues (search first)
- ❌ Use feature template for bugs
- ❌ Leave required fields empty
- ❌ Create vague or unclear descriptions
- ❌ Forget to add priority labels

### Pull Requests

**DO:**
- ✅ Reference related issues ("Closes #123")
- ✅ Use conventional commit format:
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `refactor:` - Code refactoring
  - `docs:` - Documentation changes
  - `chore:` - Maintenance tasks
  - `perf:` - Performance improvements
  - `test:` - Testing changes
- ✅ Include Claude Code attribution when applicable
- ✅ Keep PRs focused and small when possible
- ✅ Update documentation with code changes
- ✅ Ensure build passes before merging

**DON'T:**
- ❌ Mix multiple unrelated changes in one PR
- ❌ Merge without review (for significant changes)
- ❌ Leave merge conflicts unresolved
- ❌ Forget to update related documentation
- ❌ Push directly to main branch

### Git Commit Messages

**Format:**
```
<type>: <short summary>

<detailed description>

<footer with co-authorship>
```

**Example:**
```
feat: Implement Google Search Console verification

- Add sitemap submission checklist
- Include validation commands
- Document coverage monitoring process

Closes #45

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Template Selection Guide

**Quick decision tree:**

```
Is it NEW functionality?
├─ Yes → Use 🚀 Feature Request
└─ No
   ├─ Is it BROKEN/ERROR?
   │  └─ Yes → Use 🐛 Bug Report
   └─ No
      ├─ Is it IMPROVING existing feature?
      │  └─ Yes → Use ⚡ Enhancement
      └─ No
         ├─ Is it TECHNICAL work?
         │  └─ Yes → Use ✅ Task
         └─ No
            └─ Use ❓ Question/Issue
```

### Labels Guide

**How to label effectively:**

1. **Priority (required):** Pick ONE based on urgency
2. **Type (auto-added):** Template adds automatically
3. **Domain (optional):** Add 1-3 relevant domains
4. **Status (as needed):** Update as issue progresses

**Example label combination:**
```
Priority: P1 - High
Type: feature
Domain: seo, blog
Status: in-progress
```

---

## Workflow Examples

### Example 1: Reporting a Bug

1. **Discover bug** - Error 500 when creating projects
2. **Check existing issues** - Search to avoid duplicates
3. **Create issue** - Use 🐛 Bug Report template
4. **Fill details:**
   - Description: "API returns 500 error when submitting project form"
   - Steps to reproduce: Detailed list
   - Environment: Chrome 120, Production
   - Severity: High
5. **Add labels:** `bug`, `P1`, `admin`, `needs-triage`
6. **Submit and monitor** for updates

### Example 2: Proposing a Feature

1. **Identify need** - Users want dark mode
2. **Create issue** - Use 🚀 Feature Request template
3. **Fill user story:**
   - Como: usuario del sitio
   - Quiero: cambiar entre modo claro y oscuro
   - Para: mejorar legibilidad según preferencia
4. **Add acceptance criteria:**
   - [ ] Toggle en navbar
   - [ ] Persiste preferencia en cookie
   - [ ] Smooth transition
5. **Add technical specs:** Files to modify, approach
6. **Set priority:** P2 - Medium
7. **Submit** and discuss in comments

### Example 3: Submitting a Task

1. **Identify task** - Update dependencies
2. **Create issue** - Use ✅ Task template
3. **Fill description:**
   - What: Update React 19.2.0 to 19.2.3
   - Why: Security fixes and performance improvements
4. **Add criteria:**
   - [ ] package.json updated
   - [ ] Build succeeds
   - [ ] Tests pass
5. **Add approach:** Step-by-step commands
6. **Set type:** Dependencies Update
7. **Set priority:** P1 - High
8. **Submit**

### Example 4: Implementing and Closing Issue

1. **Assign yourself** to issue #123
2. **Update label** to `in-progress`
3. **Create branch:** `git checkout -b feature/issue-123`
4. **Implement** following conventions
5. **Commit** with reference: `feat: Add feature (closes #123)`
6. **Push** and create PR
7. **Reference issue** in PR description: "Closes #123"
8. **Merge PR** - Issue automatically closes
9. **Verify** issue is marked as closed

---

## Integration with Documentation

For detailed technical implementation, always cross-reference with:

- **@CLAUDE.md** - Core conventions and patterns
- **@docs/INTERNATIONALIZATION.md** - i18n implementation
- **@docs/SUPABASE.md** - Database operations
- **@docs/ANIMATIONS.md** - Animation patterns
- **@docs/DEPLOYMENT.md** - Deployment procedures

See [docs/README.md](README.md) for complete documentation index.

---

## Troubleshooting

### Template Not Appearing

**Problem:** New issue doesn't show templates

**Solution:**
- Ensure templates are in `.github/ISSUE_TEMPLATE/`
- Check YAML syntax is valid
- Refresh GitHub page
- Clear browser cache

### Labels Not Auto-Adding

**Problem:** Template labels not automatically applied

**Solution:**
- Verify `labels: ["label1", "label2"]` in template YAML
- Create labels in repository settings first
- Re-save template if modified

### PR Not Closing Issue

**Problem:** Merged PR doesn't auto-close referenced issue

**Solution:**
- Use exact keywords: "Closes #123", "Fixes #123", "Resolves #123"
- Ensure reference is in PR description or commit message
- Manually close if keyword was missed

---

## Quick Reference

### Template Selection

| Situation | Template |
|-----------|----------|
| New feature or functionality | 🚀 Feature Request |
| Something is broken | 🐛 Bug Report |
| Operational/technical work | ✅ Task |
| Question or discussion | ❓ Question/Issue |
| Improve existing feature | ⚡ Enhancement |

### Priority Levels

| Priority | Description | Example |
|----------|-------------|---------|
| P0 - Critical | System down, major functionality broken | Production database unreachable |
| P1 - High | Important feature/fix, significant impact | Admin can't create projects |
| P2 - Medium | Desirable improvement, moderate impact | Add blog to sitemap |
| P3 - Low | Nice to have, minimal impact | UI polish, minor refactoring |

### Common Labels

```
Priority: P0, P1, P2, P3
Type: feature, bug, task, question, enhancement
Domain: seo, blog, i18n, analytics, admin, database, ui/ux, performance, security
Status: needs-triage, approved, in-progress, blocked, review, testing
```

---

**Last Updated:** 2025-01-27
**Related Documentation:** [README.md](README.md) | [CLAUDE.md](../CLAUDE.md)
