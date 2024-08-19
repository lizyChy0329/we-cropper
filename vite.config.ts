import { resolve } from 'node:path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import libCss from '@bimdata/vite-plugin-libcss'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const userConfig: UserConfig = {
    base: 'we-cropper',
  }

  const defaultPlugins = [
    vue(),
    UnoCSS({
      mode: 'per-module',
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
      ],
    }),
    Icons(),
  ]

  if (mode === 'lib') {
    userConfig.build = {
      target: ['es2019', 'chrome69', 'safari12'],
      cssTarget: ['chrome61'],
      lib: {
        entry: resolve(__dirname, 'packages/index.ts'),
        name: 'weCropper',
        fileName: 'index',
      },
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: false,
      rollupOptions: {
        external: ['vue'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      },
    }
    userConfig.plugins = [
      ...defaultPlugins,
      libCss({
        include: 'packages/**/*',
      }),
      dts({ rollupTypes: true, tsconfigPath: './tsconfig.build.json' }),
    ]
  }

  if (mode === 'docs') {
    const excludesChunks = [
      'shiki',
    ]

    userConfig.build = {
      outDir: 'docs',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 检查当前模块是否在排除列表中
            if (excludesChunks.some(chunk => id.includes(chunk))) {
              return 'large'
            }
            // 将 node_modules 中的依赖合并到一个 chunk 中
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            // 其他业务逻辑可以按需合并
            return 'common' // 默认合并到 'common' chunk
          },
        },
      },
    }
  }

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './packages'),
        '~': resolve(__dirname, './src'),
      },
    },
    plugins: [...defaultPlugins],
    ...userConfig,
  }
})
