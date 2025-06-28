import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import packageJSON from "./package.json" with { type: "json" };

export default defineConfig({
  base: "/tinypos",
  define: {
    APP_VERSION: `"${packageJSON.version}"`
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      injectRegister: "script-defer",
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
