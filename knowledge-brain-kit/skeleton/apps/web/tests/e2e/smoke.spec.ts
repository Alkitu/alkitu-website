import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PUBLIC_ROUTES } from "../routes";

// Smoke e2e (Historia 1-4): cada plantilla responde 200, tiene <title> y
// registra su baseline de accesibilidad (NFR-4). El chequeo axe se reporta pero
// NO bloquea todavía: fija la línea base de violaciones que la remediación no
// puede empeorar. La validación de JSON-LD por plantilla se añade en la Épica 4.
for (const route of PUBLIC_ROUTES) {
  test(`smoke: ${route.name} responde 200 con título`, async ({ page }) => {
    const res = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `status de ${route.path}`).toBe(200);
    await expect(page).toHaveTitle(/.+/);
  });

  test(`a11y baseline: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    // Baseline informativo: adjunta las violaciones sin fallar el suite.
    // La Épica 2+ debe mantener este número igual o menor.
    test.info().annotations.push({
      type: "a11y-violations",
      description: `${route.name}: ${results.violations.length}`,
    });
  });
}

// 404 reales (Historia 3-3, FR-16 / NFR-3): un slug inexistente en cualquier
// ruta dinámica devuelve HTTP 404, no un placeholder 200.
const RUTAS_404 = [
  "/casos-de-estudio/slug-inventado-xyz",
  "/blog/slug-inventado-xyz",
  "/wiki/termino-inventado-xyz",
  "/reviews/slug-inventado-xyz",
];
for (const path of RUTAS_404) {
  test(`404 real: ${path}`, async ({ page }) => {
    const res = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `status de ${path}`).toBe(404);
  });
}

// RSS del blog (Historia 4-5 / FR-23): feed válido con los posts.
test("RSS: /blog/rss.xml es un feed válido con posts", async ({ page }) => {
  const res = await page.goto("/blog/rss.xml", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  const xml = await res!.text();
  expect(xml).toContain("<rss");
  expect(xml).toContain("<channel>");
  expect((xml.match(/<item>/g) ?? []).length).toBeGreaterThanOrEqual(1);
});

// JSON-LD por plantilla (Historia 4-3 / FR-20, FR-34): cada plantilla emite
// datos estructurados válidos con el @type correcto + BreadcrumbList.
const JSONLD: { path: string; tipo: string }[] = [
  { path: "/blog/plantilla-articulo", tipo: "Article" },
  { path: "/wiki/termino-ejemplo", tipo: "DefinedTerm" },
  { path: "/sobre-mi", tipo: "Person" },
  { path: "/reviews/plantilla-review", tipo: "Review" },
];
for (const { path, tipo } of JSONLD) {
  test(`JSON-LD ${tipo}: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(bloques.length, `${path} sin JSON-LD`).toBeGreaterThan(0);
    const tipos = bloques.flatMap((b) => {
      const parsed = JSON.parse(b); // lanza si el JSON no es válido
      return (Array.isArray(parsed) ? parsed : [parsed]).map((x) => x["@type"]);
    });
    expect(tipos, `${path} sin @type=${tipo}`).toContain(tipo);
    expect(tipos, `${path} sin BreadcrumbList`).toContain("BreadcrumbList");
  });
}

// Bilingüe (Épica 7). Rutas EN del piloto: responden 200 con chrome/plantilla EN
// (FR-41, FR-43) y hreflang recíproco ES↔EN + x-default (FR-44). Las páginas sin
// par EN no emiten hreflang roto y su detalle EN es 404 real.
const RUTAS_EN: { path: string; esPath: string; name: string }[] = [
  { path: "/en", esPath: "/", name: "en-landing" },
  { path: "/en/about", esPath: "/sobre-mi", name: "en-about" },
  { path: "/en/blog", esPath: "/blog", name: "en-blog" },
  { path: "/en/wiki", esPath: "/wiki", name: "en-wiki" },
  { path: "/en/reviews", esPath: "/reviews", name: "en-reviews" },
  { path: "/en/case-studies", esPath: "/casos-de-estudio", name: "en-casos" },
  { path: "/en/contact", esPath: "/contacto", name: "en-contacto" },
];

async function hreflangDe(page: import("@playwright/test").Page) {
  return page.$$eval('link[rel="alternate"][hreflang]', (links) =>
    Object.fromEntries(
      links.map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")]),
    ),
  );
}

for (const ruta of RUTAS_EN) {
  test(`smoke EN: ${ruta.name} responde 200 con <html lang="en">`, async ({ page }) => {
    const res = await page.goto(ruta.path, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `status de ${ruta.path}`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(/.+/);
  });

  test(`hreflang recíproco: ${ruta.esPath} ↔ ${ruta.path}`, async ({ page }) => {
    // Lado ES: declara su par EN y x-default.
    await page.goto(ruta.esPath, { waitUntil: "domcontentloaded" });
    const es = await hreflangDe(page);
    expect(es["en"], `${ruta.esPath} sin hreflang en`).toContain(ruta.path);
    expect(es["es"], `${ruta.esPath} sin hreflang es`).toContain(ruta.esPath);
    expect(es["x-default"], `${ruta.esPath} sin x-default`).toBeTruthy();

    // Lado EN: declara exactamente el mismo par (reciprocidad).
    await page.goto(ruta.path, { waitUntil: "domcontentloaded" });
    const en = await hreflangDe(page);
    expect(en["es"], `${ruta.path} sin hreflang es`).toContain(ruta.esPath);
    expect(en["en"], `${ruta.path} sin hreflang en`).toContain(ruta.path);
  });
}

test("un detalle de blog inexistente no emite hreflang", async ({ page }) => {
  await page.goto("/blog/slug-inventado-xyz", { waitUntil: "domcontentloaded" });
  const alternates = await hreflangDe(page);
  expect(Object.keys(alternates), "un detalle sin par EN no debe emitir hreflang").toHaveLength(0);
});

test("detalle de blog inexistente bajo /en/ es 404 real", async ({ page }) => {
  const res = await page.goto("/en/blog/slug-inventado-xyz", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(404);
});

test("URLs EN no canónicas redirigen a la pública (/en/sobre-mi → /en/about)", async ({ page }) => {
  const res = await page.goto("/en/sobre-mi", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  expect(page.url()).toContain("/en/about");
});

test("el prefijo interno /es/* redirige a la URL sin prefijo", async ({ page }) => {
  await page.goto("/es/blog", { waitUntil: "domcontentloaded" });
  expect(new URL(page.url()).pathname).toBe("/blog");
});
