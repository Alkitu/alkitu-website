import { UserDetail } from '@/app/components/admin';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  return (
    <section id="user-detail" className="space-y-8">
      <UserDetail userId={id} />
    </section>
  );
}
