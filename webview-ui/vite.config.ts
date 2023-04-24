/// <reference types="node" />

import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'

import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

const filePath = fileURLToPath(import.meta.url)
const __dirname: string = dirname(filePath)
type _T1 = typeof filePath

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
      '@': path.join(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      input: {
        'activity-bar': path.join(__dirname, 'index.html'),
        'panel': path.join(__dirname, 'index.panel.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
