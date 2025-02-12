/* This magic comment extends vite's TS definitions to include vitest's too. */
/// <reference types="vitest/config"/>
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true,
    port: 3000,
  },
  define: {
    global: "globalThis",
  },
  build: {
    outDir: "./build",
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  test: {
    root: "src",
    setupFiles: "utils/testing/setupTests.tsx",
    environment: "jsdom",
    /*
     * See https://vitest.dev/guide/features.html#environment-variables
     * and https://vite.dev/guide/api-javascript.html#loadenv
     * and https://vite.dev/guide/env-and-mode#modes
     */
    env: loadEnv(
      mode, // Load from .env, or .env.{mode}, as appropriate
      process.cwd(), // Find the .env file in services/ui-src/src
      '' // Load all variables, regardless of prefix (by default, only 'VITE_')
    ),
    coverage: {
      /*
       * The default coverage directory is "<root>/coverage",
       * but we want to output to ui-src/coverage instead.
       */
      reportsDirectory: "../coverage",
    },
  },
}));
