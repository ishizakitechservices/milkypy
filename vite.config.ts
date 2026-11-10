import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function suppressHmrWebSocketPlugin(): Plugin {
  return {
    name: 'suppress-hmr-websocket',
    transformIndexHtml: {
      order: 'pre' as const,
      handler() {
        return [
          {
            tag: 'script',
            attrs: { type: 'text/javascript' },
            children: `
(function() {
  if (typeof window !== 'undefined') {
    var RealWebSocket = window.WebSocket;
    if (RealWebSocket) {
      window.WebSocket = function(url, protocols) {
        if (
          protocols === 'vite-hmr' ||
          (typeof url === 'string' && (url.indexOf('token=') !== -1 || url.indexOf('vite') !== -1))
        ) {
          var target = new EventTarget();
          return {
            readyState: 1,
            OPEN: 1,
            CONNECTING: 0,
            CLOSING: 2,
            CLOSED: 3,
            url: url,
            protocol: 'vite-hmr',
            send: function() {},
            close: function() {},
            addEventListener: function(type, listener, options) {
              target.addEventListener(type, listener, options);
              if (type === 'open') {
                setTimeout(function() {
                  try { target.dispatchEvent(new Event('open')); } catch(e) {}
                }, 0);
              }
            },
            removeEventListener: function(type, listener, options) {
              target.removeEventListener(type, listener, options);
            },
            dispatchEvent: function(event) {
              return target.dispatchEvent(event);
            }
          };
        }
        return new RealWebSocket(url, protocols);
      };
      window.WebSocket.prototype = RealWebSocket.prototype;
      window.WebSocket.CONNECTING = RealWebSocket.CONNECTING;
      window.WebSocket.OPEN = RealWebSocket.OPEN;
      window.WebSocket.CLOSING = RealWebSocket.CLOSING;
      window.WebSocket.CLOSED = RealWebSocket.CLOSED;
    }

    var origConsoleError = console.error;
    console.error = function() {
      var str = '';
      for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        str += ' ' + (a && (a.message || a.stack || (typeof a === 'string' ? a : '')));
      }
      if (
        str.indexOf('WebSocket closed without opened') !== -1 ||
        (str.indexOf('[vite]') !== -1 && (str.indexOf('WebSocket') !== -1 || str.indexOf('websocket') !== -1))
      ) {
        return;
      }
      origConsoleError.apply(console, arguments);
    };

    window.addEventListener('error', function(e) {
      if (
        (e && e.message && (e.message.indexOf('WebSocket') !== -1 || e.message.indexOf('closed without opened') !== -1)) ||
        (e && e.filename && e.filename.indexOf('@vite/client') !== -1)
      ) {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (e.preventDefault) e.preventDefault();
        return true;
      }
    }, true);

    window.addEventListener('unhandledrejection', function(e) {
      var msg = (e && e.reason && (e.reason.message || e.reason)) || '';
      if (typeof msg === 'string' && (msg.indexOf('WebSocket') !== -1 || msg.indexOf('closed without opened') !== -1)) {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (e.preventDefault) e.preventDefault();
      }
    }, true);
  }
})();
`,
            injectTo: 'head-prepend' as const,
          },
        ];
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      suppressHmrWebSocketPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'MilkyPy - Python Learning & Playground',
          short_name: 'MilkyPy',
          description: 'Interactive Python learning platform and compiler with full offline playground support.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB to handle large chunks/wasm
          runtimeCaching: [
            {
              // Intercept and cache Pyodide core engine, wasm, and python standard packages
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'pyodide-cdn-cache-v0.25.1',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year offline availability
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        external: ['/pyodide/pyodide.mjs'],
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
