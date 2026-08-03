import { defineConfig, devices } from "@playwright/test";

// Harness de la Historia 1-4: smoke e2e + baseline de paridad visual (NFR-1).
// 3 viewports (móvil 390 · tablet 768 · desktop 1440). Umbral de paridad ≤0,1%
// de píxeles distintos (maxDiffPixelRatio: 0.001), tolerancia de antialiasing.
const PORT = 4321;
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Reintentos para suites de screenshot: rescatan flakes de timing (decode de
  // imágenes bajo carga paralela); una regresión visual real falla todos los
  // reintentos y se sigue detectando.
  retries: 2,
  reporter: process.env.CI ? "github" : "list",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
      animations: "disabled",
    },
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
