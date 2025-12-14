/**
 * API Client Usage Examples
 *
 * This file demonstrates practical examples of using the standardized API client
 * with Sonner toast notifications in real-world scenarios.
 */

'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ============================================================================
// Example 1: Simple Form Submission
// ============================================================================

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      await api.post('/api/contact', data, {
        successMessage: 'Message sent successfully! We\'ll get back to you soon.',
      });

      // Reset form on success
      e.currentTarget.reset();
    } catch (error) {
      // Error toast is automatically shown
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 2: Data Fetching with Loading State
// ============================================================================

interface Post {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
}

export function BlogPostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await api.get<Post[]>('/api/posts', {
          showToasts: false, // Don't show toast for successful data fetch
        });
        setPosts(data);
      } catch (error) {
        // Error toast will be shown automatically
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="mt-2 text-gray-600">{post.content}</p>
          <time className="mt-2 text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </article>
      ))}
    </div>
  );
}

// ============================================================================
// Example 3: Delete with Confirmation Toast
// ============================================================================

interface DeleteButtonProps {
  postId: string;
  postTitle: string;
  onDeleted?: () => void;
}

export function DeletePostButton({ postId, postTitle, onDeleted }: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  function handleDelete() {
    toast(`Delete "${postTitle}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: async () => {
          setDeleting(true);

          try {
            await api.delete(`/api/posts/${postId}`, {
              successMessage: 'Post deleted successfully',
            });

            // Callback or navigation after delete
            if (onDeleted) {
              onDeleted();
            } else {
              router.push('/posts');
              router.refresh();
            }
          } catch (error) {
            console.error('Failed to delete post:', error);
          } finally {
            setDeleting(false);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete Post'}
    </button>
  );
}

// ============================================================================
// Example 4: Optimistic Updates (Like Button)
// ============================================================================

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    // Prevent multiple clicks
    if (loading) return;

    setLoading(true);

    // Optimistic update
    const previousLikes = likes;
    const previousLiked = liked;

    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);

    try {
      await api.post(
        `/api/posts/${postId}/like`,
        { liked: !previousLiked },
        { showToasts: false } // Silent operation
      );
    } catch (error) {
      // Revert on error
      setLikes(previousLikes);
      setLiked(previousLiked);
      toast.error('Failed to update like');
      console.error('Failed to like post:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        liked
          ? 'bg-primary text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
    </button>
  );
}

// ============================================================================
// Example 5: Promise-based Loading Toast
// ============================================================================

interface ImportData {
  imported: number;
  skipped: number;
  errors: number;
}

export function ImportButton() {
  async function handleImport() {
    const promise = api.post<ImportData>('/api/import', {}, {
      showToasts: false, // We'll handle toasts manually
    });

    toast.promise(promise, {
      loading: 'Importing data...',
      success: (data) => `Imported ${data.imported} items successfully`,
      error: 'Failed to import data',
    });

    try {
      const result = await promise;

      // Show additional info if there were errors or skipped items
      if (result.skipped > 0 || result.errors > 0) {
        toast.info(
          `Skipped: ${result.skipped}, Errors: ${result.errors}`,
          { description: 'Check the logs for details' }
        );
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
  }

  return (
    <button
      onClick={handleImport}
      className="px-4 py-2 bg-primary text-white rounded-md"
    >
      Import Data
    </button>
  );
}

// ============================================================================
// Example 6: Multi-step Form with Progress
// ============================================================================

interface StepData {
  step1?: { name: string; email: string };
  step2?: { address: string; city: string };
  step3?: { payment: string };
}

export function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>({});
  const [loading, setLoading] = useState(false);

  async function handleStepSubmit(stepNumber: number, stepData: Record<string, string>) {
    setData((prev) => ({
      ...prev,
      [`step${stepNumber}`]: stepData,
    }));

    if (stepNumber < 3) {
      // Move to next step
      setStep(stepNumber + 1);
      toast.success(`Step ${stepNumber} completed`);
    } else {
      // Final submission
      setLoading(true);
      const toastId = toast.loading('Creating your account...');

      try {
        const result = await api.post(
          '/api/register',
          {
            ...data.step1,
            ...data.step2,
            ...stepData,
          },
          { showToasts: false }
        );

        toast.success('Account created successfully! 🎉', { id: toastId });
        router.push('/dashboard');
      } catch (error) {
        toast.error('Failed to create account', { id: toastId });
        console.error('Registration failed:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded ${
                s <= step ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Step {step} of 3
        </p>
      </div>

      {/* Step content would go here */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const stepData = Object.fromEntries(formData.entries()) as Record<string, string>;
        handleStepSubmit(step, stepData);
      }}>
        {/* Step-specific fields */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-white rounded-md"
        >
          {step < 3 ? 'Next' : loading ? 'Creating Account...' : 'Complete'}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// Example 7: Error Handling with Custom Messages
// ============================================================================

import { ApiClientError } from '@/lib/api/client';

export function AdvancedErrorHandling() {
  const router = useRouter();

  async function handleOperation() {
    try {
      await api.post('/api/complex-operation', { data: 'test' });
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Handle specific error codes
        switch (error.code) {
          case 'VALIDATION_ERROR':
            // Validation errors are already shown as toasts
            console.log('Validation failed:', error.details);
            break;

          case 'RATE_LIMIT_EXCEEDED':
            toast.error('Too many requests. Please try again later.', {
              description: 'You can retry in 1 minute',
            });
            break;

          case 'UNAUTHORIZED':
            toast.error('Please log in to continue');
            // Redirect to login
            router.push('/login');
            break;

          case 'FORBIDDEN':
            toast.error('You don\'t have permission to perform this action');
            break;

          default:
            toast.error(error.message);
        }

        // Log for debugging
        console.error('API Error:', {
          code: error.code,
          status: error.status,
          message: error.message,
          details: error.details,
        });
      } else {
        // Network error or other unexpected error
        toast.error('An unexpected error occurred');
        console.error('Unexpected error:', error);
      }
    }
  }

  return (
    <button onClick={handleOperation}>
      Trigger Operation
    </button>
  );
}

// ============================================================================
// Example 8: Pagination with Meta Information
// ============================================================================

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export function PaginatedList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await api.get<PaginatedResponse<Post>>(
        `/api/posts?page=${page}&limit=10`,
        { showToasts: false }
      );

      setPosts((prev) => [...prev, ...response.data]);
      setHasMore(response.meta.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to load more posts');
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
