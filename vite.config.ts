import {VitePWA} from 'vite-plugin-pwa';
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';
import fs from 'fs';
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  ...(process.env.NODE_ENV === 'production' ? {} : {
    server: {
      https: {
        key: fs.readFileSync('localhost-key.pem'),
        cert: fs.readFileSync('localhost.pem'),
      },
      host: true
    },
  }),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    tailwindcss(),
    svgLoader(),
    vue(),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/locales/**')]
    }),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      manifestFilename: 'manifest.json',

      // Manifest for PWA
      manifest: {
        name: 'Nunua - Hassle-free shareable Grocery lists',
        short_name: 'Nunua',
        description: 'Your favourite offline first split bill & expense tracker',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        id: '/',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'pwa-maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-favicon.ico',
            sizes: 'any',
            type: 'image/x-icon'
          },
        ],
        // screenshots: [
        //   {
        //     src: 'screenshots/screenshot1.png',
        //     sizes: '640x1136',
        //     type: 'image/png',
        //     form_factor: 'narrow',
        //     label: 'Home Screen',
        //   },
        //   {
        //     src: 'screenshots/screenshot2.png',
        //     sizes: '750x1334',
        //     type: 'image/png',
        //     form_factor: 'narrow',
        //     label: 'Expense Details',
        //   },
        //   {
        //     src: 'screenshots/screenshot3.png',
        //     sizes: '1242x2688',
        //     type: 'image/png',
        //     label: 'Group Management',
        //   },
        // ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,woff}'],
        maximumFileSizeToCacheInBytes: 3000000, // 3MB limit
      },

      devOptions: {
        enabled: true,
        type: 'module',
      }
    })
  ],
  // Ensure proper build for PWA
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ui-vendor': ['lucide-vue-next'],
        }
      }
    }
  }
})