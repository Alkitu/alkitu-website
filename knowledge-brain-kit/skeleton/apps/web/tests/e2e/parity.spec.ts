import { test, expect } from "@playwright/test";
import { PUBLIC_ROUTES } from "../routes";

// Baseline de paridad visual (FR-3 / NFR-1). En la primera ejecución genera las
// capturas de referencia; en las siguientes falla si el diff supera el 0,1%
// definido en playwright.config.ts. Ejecutar antes de cada historia de UI de la
// Épica 2+ para congelar el "antes" y comparar el "después".
for (const route of PUBLIC_ROUTES) {
  test(`paridad: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    // Estabilidad: recorrer toda la página para disparar imágenes lazy, volver
    // arriba, esperar fuentes y decode. Evita falsos negativos por portadas que
    // cargan a mitad del screenshot fullPage (p. ej. blog-index en móvil).
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map((img) => img.decode().catch(() => undefined)),
      );
    });
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true });
  });
}
