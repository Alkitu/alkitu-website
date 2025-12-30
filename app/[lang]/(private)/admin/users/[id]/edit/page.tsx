import { UserEdit } from '@/app/components/admin';

interface UserEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { id } = await params;

  return (
    <section id="user-edit" className="space-y-8">
      <UserEdit userId={id} />
    </section>
  );
}
