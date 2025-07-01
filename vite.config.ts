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
      injectRegister: null,
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: [
        "**/*",
      ],
      manifest: {
        theme_color: "#efa0ff",
        "background_color": "#ffffff",
        "display": "standalone",
        "name": "tinyPOS",
        "short_name": "tinyPOS",
        "description": "小さなPOSシステム。",
        "scope": "/tinypos",
        "start_url": "/tinypos",
        "icons": [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
  ],
});
