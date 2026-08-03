"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { setHomeBlogSlugs, setHomeCasosSlugs } from "@/lib/home/config";

export type EstadoInicio = { ok: boolean; error?: string };

const ERROR_DB = "No se pudo guardar. Revisa la conexión con la base de datos.";

/**
 * Guarda el orden/selección de casos de la home. Protegida: exige sesión (el
 * layout /admin ya la garantiza, pero un server action es un endpoint propio y
 * se valida aparte). Revalida la portada ES y EN para que el cambio se vea.
 */
export async function guardarCasosHome(slugs: string[]): Promise<EstadoInicio> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado." };

  if (!Array.isArray(slugs)) return { ok: false, error: "Datos inválidos." };

  try {
    await setHomeCasosSlugs(slugs);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: ERROR_DB };
  }
}

/** Guarda el orden/selección de artículos del blog en la home. */
export async function guardarBlogHome(slugs: string[]): Promise<EstadoInicio> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado." };
  if (!Array.isArray(slugs)) return { ok: false, error: "Datos inválidos." };

  try {
    await setHomeBlogSlugs(slugs);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: ERROR_DB };
  }
}
