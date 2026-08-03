import { defineConfig } from "vitest/config";

// Config de tests unitarios en Node (lógica pura, sin browser ni Storybook).
// Separada de vitest.config.ts (storybookTest/browser) para poder correr en CI/gate.
export default defineConfig({
  test: {
    environment: "node",
    include: ["components/**/*.test.ts"],
  },
});
