import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'icon-192x192.png',
        'icon-512x512.png'
      ],
      manifest: {
        name: '1Cable Network - WiFi & OTT Management',
        short_name: '1Cable Network',
        description: 'Professional WiFi and OTT plan management system for cable network operators',
        theme_color: '#1f2937',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: mode === 'development'
      }
    }),
    // Bundle analyzer can be added later with proper plugin
  ],

  // Build optimizations
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
      mangle: {
        safari10: true,
      },
    },

    // Advanced chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks based on package names
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            if (id.includes('formik') || id.includes('yup')) {
              return 'form-vendor';
            }
            if (id.includes('axios')) {
              return 'utils-vendor';
            }
            // Other vendor packages
            return 'vendor';
          }

          // Feature-based chunks based on directory structure
          if (id.includes('/User/')) {
            return 'user-management';
          }
          if (id.includes('/Wifi_plan/') || id.includes('/Ott_plan/')) {
            return 'plan-management';
          }
          if (id.includes('/component/')) {
            return 'components';
          }
          if (id.includes('/utils/')) {
            return 'utils';
          }
        },

        // Optimize chunk file names with better organization
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.(jsx?|tsx?)$/, '')
            : 'unknown';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },

      // External dependencies configuration
      external: [],

      // Global configuration
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
    },

    // Enable source maps for production debugging
    sourcemap: mode === 'development',

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,

    // Enable compression
    reportCompressedSize: true,

    // Target modern browsers for better optimization
    target: 'esnext',

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Assets inline threshold
    assetsInlineLimit: 4096,

    // Enable module preloading
    modulePreload: {
      polyfill: false,
    },
  },

  // Development server optimizations
  server: {
    // Enable HMR
    hmr: true,

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux',
        'axios',
        'formik',
        'yup',
      ],
    },

    // Watch options for better performance
    watch: {
      usePolling: true,
      interval: 100,
    },
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'formik',
      'yup',
    ],
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },

  // CSS optimizations
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },

  // Image optimization
  assetsInclude: ['**/*.webp', '**/*.avif'],

  // Public directory assets handling
  publicDir: 'public',

  // Preview server optimizations
  preview: {
    port: 4173,
    host: true,
  },
}));
