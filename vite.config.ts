import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

const TRIP_DATA_FILES = ['trip.json', 'day-guide.json'] as const

function tripDataAssets(): Plugin {
  return {
    name: 'trip-data-assets',
    buildStart() {
      for (const file of TRIP_DATA_FILES) {
        this.emitFile({
          type: 'asset',
          fileName: `data/${file}`,
          source: readFileSync(new URL(`./data/${file}`, import.meta.url)),
        })
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tripDataAssets(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'AI Vacation Planner Demo',
        short_name: 'Trip Demo',
        description: 'A synthetic family vacation planning showcase',
        theme_color: '#1a1a1a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
    }),
  ],
})
