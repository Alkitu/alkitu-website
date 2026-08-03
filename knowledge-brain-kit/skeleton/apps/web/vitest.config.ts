import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Vitest = solo tests unitarios (capa de contenido, esquemas, parsers).
// Los specs e2e (Playwright, tests/e2e) corren aparte con `pnpm test:e2e`.
export default defineConfig({
  // Alias `@/` → raíz de apps/web (igual que tsconfig paths), para que los
  // módulos importados vía `@/lib/...` resuelvan también dentro de los tests.
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    environment: "node",
  },
});
