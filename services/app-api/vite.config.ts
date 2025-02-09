import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "utils/testing/setupTests.ts",
    exclude: [...configDefaults.exclude, ".build/**"],
  },
});
