import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resuelve rutas de assets de conocimiento sin depender del cwd exacto:
 * el runtime puede arrancar desde `apps/web` (Next/eve) o desde la raíz del
 * monorepo. Devuelve la primera ruta existente o null (los consumidores
 * DEGRADAN con un mensaje honesto, nunca lanzan).
 */
export function resolveAsset(...relativeCandidates: string[]): string | null {
  const bases = [process.cwd(), join(process.cwd(), "apps/web"), join(process.cwd(), "../..")];
  for (const rel of relativeCandidates) {
    for (const base of bases) {
      const p = join(base, rel);
      if (existsSync(p)) return p;
    }
  }
  return null;
}
