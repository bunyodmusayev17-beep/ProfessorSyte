import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // In dev we proxy instead of calling the API cross-origin: same-origin requests
  // mirror production (nginx) exactly, so CORS never enters the picture.
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'https://localhost:7223';
  const proxy = {
    target: proxyTarget,
    changeOrigin: true,
    // The ASP.NET dev certificate is self-signed.
    secure: false,
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      // The backend CORS policy whitelists 5173, so never silently pick another port.
      strictPort: true,
      proxy: {
        '/api': proxy,
        // Project images are served by the backend from wwwroot/uploads.
        '/uploads': proxy,
      },
    },
    preview: {
      port: 4173,
      strictPort: true,
      proxy: {
        '/api': proxy,
        '/uploads': proxy,
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          // Keep the rarely-changing vendor code in its own long-lived chunks so
          // an app deploy doesn't invalidate them. Rolldown (Vite 8) only
          // accepts the function form here.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (
              /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/.test(id)
            ) {
              return 'react';
            }
            if (id.includes('@tanstack')) return 'query';
            return undefined;
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test/setup.js'],
      css: true,
    },
  };
});
