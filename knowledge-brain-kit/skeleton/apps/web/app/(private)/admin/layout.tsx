import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { AdminMobileNav, AdminSidebar } from "./_components/admin-nav";

// Gate real del panel: corre en server (Node), valida la sesión contra Mongo.
// Como el callback signIn ya filtra por la colección `admins`, cualquier
// sesión válida que llegue aquí es la de un administrador.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?redirectTo=/admin");
  }
  return (
    <div className="pt-16">
      {/* Móvil: barra superior con hamburguesa + drawer (ancho completo, arriba). */}
      <AdminMobileNav />
      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* Desktop: barra lateral. En móvil no ocupa espacio (hidden). */}
        <AdminSidebar />
        <main className="w-full min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
