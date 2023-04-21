import { URL, fileURLToPath } from 'node:url'

import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('vscode-'),
        },
      },
    }),
    AutoImport({
      dts: true,
      resolvers: [ArcoResolver()],
    }) as PluginOption,
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      '@': fileURLToPath(new URL('./src', import.meta.url)) as string,
    },
  },
  build: {
    outDir: 'panel-build',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
