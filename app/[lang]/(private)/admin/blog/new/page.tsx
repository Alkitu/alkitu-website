import { Metadata } from 'next';
import { BlogEditor } from '@/app/components/admin/blog/BlogEditor';

export const metadata: Metadata = {
  title: 'Nuevo post - Admin',
};

export default function NewBlogPostPage() {
  return <BlogEditor />;
}
