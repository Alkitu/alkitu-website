import { UsersList } from '@/app/components/admin';

export default function UsersPage() {
  return (
    <>
      <section id="users" className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Gestión de Usuarios
          </h2>
          <UsersList />
        </div>
      </section>
    </>
  );
}
