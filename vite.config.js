import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // ── Allow preview server to be accessed from phone on local network ─────────
  // `npm run preview -- --host` exposes it on 0.0.0.0 so your phone can connect
  // You can also hardcode: server: { host: true }
  preview: {
    host: true,   // exposes on 0.0.0.0 → accessible at http://<your-pc-ip>:4173
    port: 4173,
  },

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // ── Workbox: cache everything the app needs to run offline ────────────────
      workbox: {
        // Pre-cache all built assets (JS bundles, CSS, HTML, images, fonts)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Runtime caching: network-first for navigation, cache-first for assets
        runtimeCaching: [
          {
            // Cache Google Fonts if ever added
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      includeAssets: ['icon-192.png', 'icon-512.png'],

      manifest: {
        name: "Priyal's Fitness",
        short_name: "Fitness",
        description: "Personal fitness dashboard — workouts, diet, progress tracking",
        theme_color: "#0e0f11",
        background_color: "#0e0f11",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",

        // ── FIX: Split "any maskable" into two separate icon entries ────────────
        // Combining "any maskable" in one entry breaks Chrome install prompt
        // on some Android versions. Separate entries are the correct spec.
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"           // used for favicon, tab icon
          },
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"      // used for Android adaptive icons
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ]
})