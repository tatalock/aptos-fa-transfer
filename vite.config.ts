import vue from '@vitejs/plugin-vue';
import unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import mkcert from 'vite-plugin-mkcert';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';

import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages(),
    svgLoader(),
    mkcert({
      hosts: ['locahost', '127.0.0.1'],
    }),
    unocss(),
    Layouts(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      deep: true,
      resolvers: [
        AntDesignVueResolver({
          importStyle: 'less',
        }),
      ],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
  },
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  build: {
    target: ['es2020'],
    rollupOptions: {
      output: {
        manualChunks: {
          pinia: ['pinia'],
          vue: ['vue', 'vue-router'],
          '@vueuse': ['@vueuse/core'],
          'lodash-es': ['lodash-es'],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
});

