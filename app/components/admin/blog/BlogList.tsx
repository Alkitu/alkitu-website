'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  locale: 'en' | 'es';
  categoria: string;
  categoria_slug: string;
  published: boolean;
  estado: string;
  featured: boolean;
  published_at: string | null;
  updated_at: string;
  translation_group_id: string;
  autor: string | null;
}

export function BlogList() {
  const router = useRouter();
  const pathname = usePathname();
  const adminLocale = pathname.split('/')[1] || 'es';

  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [localeFilter, setLocaleFilter] = useState<'all' | 'en' | 'es'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (localeFilter !== 'all') params.set('locale', localeFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/blog?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Error loading posts');
      setPosts(json.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error loading posts');
    } finally {
      setLoading(false);
    }
  }, [localeFilter, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const togglePublished = async (post: PostSummary) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        // The API refuses to publish a post with contract errors; show which.
        const details = json.error?.details;
        if (Array.isArray(details) && details.length) {
          toast.error(
            `No se puede publicar: ${details.map((d: { message: string }) => d.message).join(' · ')}`
          );
        } else {
          toast.error(json.error?.message || 'Error updating post');
        }
        return;
      }

      toast.success(post.published ? 'Post despublicado' : 'Post publicado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating post');
    }
  };

  const remove = async (post: PostSummary) => {
    if (!confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(post.id);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Error deleting post');
      toast.success('Post eliminado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting post');
    } finally {
      setDeleting(null);
    }
  };

  const published = posts.filter((p) => p.published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            {posts.length} posts · {published} publicados · {posts.length - published} borradores
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/${adminLocale}/admin/blog/new`)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título…"
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-border p-1">
          {(['all', 'es', 'en'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLocaleFilter(value)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                localeFilter === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {value === 'all' ? 'Todos' : value.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No hay posts que coincidan.</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-secondary/40">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                    {post.locale}
                  </span>
                  <h3 className="truncate font-medium text-foreground">{post.title}</h3>
                  {post.featured && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      Destacado
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      post.published
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {post.published ? 'Publicado' : post.estado}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  /{post.locale}/blog/{post.categoria_slug}/{post.slug}
                  {post.autor ? ` · ${post.autor}` : ''}
                  {post.published_at
                    ? ` · ${new Date(post.published_at).toLocaleDateString('es-ES')}`
                    : ''}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {post.published && (
                  <Link
                    href={`/${post.locale}/blog/${post.categoria_slug}/${post.slug}`}
                    target="_blank"
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    title="Ver publicado"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => togglePublished(post)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title={post.published ? 'Despublicar' : 'Publicar'}
                >
                  {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/${adminLocale}/admin/blog/${post.id}`)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(post)}
                  disabled={deleting === post.id}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
