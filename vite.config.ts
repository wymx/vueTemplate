import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; //这个path用到了上面安装的@types/node
import legacy from '@vitejs/plugin-legacy'; //传统浏览器 or 兼容性差的浏览器版本
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// ui库解析器，也可以自定义，需要安装相关UI库，unplugin-vue-components/resolvers
// 提供了以下集中解析器，使用的时候，需要安装对应的UI库
// 注释的是包含的其他一些常用组件库
// import {
//   ElementPlusResolver,
// AntDesignVueResolver,
// VantResolver,
// HeadlessUiResolver,
// ElementUiResolver
// } from 'unplugin-vue-components/resolvers';//自动导入组件库
// import viteCompression from 'vite-plugin-compression';//打包.gz

// https://vitejs.dev/config/
export default ({ mode }) => {
  const baseUrl = loadEnv(mode, process.cwd()).VITE_BASE_URL;
  const dropConsole = Boolean(loadEnv(mode, process.cwd()).VITE_DROP_CONSOLE);

  return defineConfig({
    base: './',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          // ElementPlusResolver(),
          // AntDesignVueResolver(),
          // HeadlessUiResolver(),
          // ElementUiResolver()
        ],
      }),
      Components({
        resolvers: [
          // ElementPlusResolver(),
        ],
      }),
      // {
      //   ...viteCompression(),
      //   apply: 'build',
      // },
      legacy({
        // targets: ['defaults', 'not IE 11'],
        targets: ['chrome < 60', 'edge < 15'],
        renderLegacyChunks: true,
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 9000,
      open: true,
      https: false,
      proxy: {
        '/api': {
          target: baseUrl,
          changeOrigin: true,
          ws: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
    //这里进行配置别名
    resolve: {
      alias: {
        '@': path.resolve('./src'), // @代替src
        '#': path.resolve('./types'), // #代替types
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router'],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除console.log()
          drop_console: dropConsole,
          drop_debugger: dropConsole,
        },
      },
    },
  });
};
