import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['logo.jpg'],
      manifest: {
        name: 'Champions HQ',
        short_name: 'Champions HQ',
        description: 'Seu quartel-general definitivo para Marvel Champions LCG.',
        theme_color: '#060913',
        background_color: '#060913',
        display: 'standalone',
        icons: [
          {
            src: 'logo.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,jsonl,json}']
      }
    })
  ],
})
