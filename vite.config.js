import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'remove-cros',
      transformIndexHtml(html) {
        return html.replace(/crossorigin/g, '');
      }
    }
  ],
  server: {
    watch: {
      usePolling: true,
    }
  },
  base: './',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
