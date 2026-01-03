/**
 * Profile Not Found Page
 *
 * Shown when a profile username doesn't exist
 * or the profile is not publicly accessible.
 */

import Link from 'next/link';
import { UserX } from 'lucide-react';

export default function ProfileNotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <div className="text-center">
        <UserX className="mx-auto h-24 w-24 text-muted-foreground" />

        <h1 className="mt-6 text-4xl font-bold text-foreground">
          Perfil no encontrado
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Este perfil no existe o no está disponible públicamente.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
