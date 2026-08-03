import { Metadata } from 'next';
import { BlogList } from '@/app/components/admin/blog/BlogList';

export const metadata: Metadata = {
  title: 'Blog - Admin',
  description: 'Gestiona los artículos del blog',
};

export default function AdminBlogPage() {
  return <BlogList />;
}
