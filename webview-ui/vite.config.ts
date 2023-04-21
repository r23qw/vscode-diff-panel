/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'

import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { EXTENSION_SOURCE_ROOT_PROPERTY } from '../shared/constants'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      if (hostType === 'js')
        return { runtime: `window[${EXTENSION_SOURCE_ROOT_PROPERTY}](${JSON.stringify(filename)})` }

      else
        return { relative: true }
    },
  },
})
