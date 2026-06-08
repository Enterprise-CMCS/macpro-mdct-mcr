import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: "watch-env-config",
      configureServer(server) {
        const envFile = "services/ui-src/public/env-config.js";
        server.watcher.add(envFile);
        server.watcher.on("change", (file) => {
          if (file.endsWith(envFile)) {
            console.log("[vite] page reload public/env-config.js");
            server.ws.send({
              type: "full-reload",
            });
          }
        });
      },
    },
  ],
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
});
