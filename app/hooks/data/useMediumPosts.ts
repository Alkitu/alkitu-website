'use client';
import { useState, useEffect } from 'react';

/**
 * Interface representing a Medium post from RSS feed
 */
export interface MediumPost {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
}

/**
 * Return type for useMediumPosts hook
 */
export interface UseMediumPostsReturn {
  posts: MediumPost[] | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook that fetches Medium posts from RSS feed via rss2json API.
 * Provides loading state and error handling.
 *
 * @returns Object with posts array, loading state, and error
 *
 * @example
 * ```tsx
 * const { posts, isLoading, error } = useMediumPosts();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {posts?.map(post => (
 *       <article key={post.guid}>{post.title}</article>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useMediumPosts(): UseMediumPostsReturn {
  const [posts, setPosts] = useState<MediumPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40leonelkrea'
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.items);
        setError(null);
      } catch (err) {
        console.error('Error fetching Medium posts:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { posts, isLoading, error };
}
