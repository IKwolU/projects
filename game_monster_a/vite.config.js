import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import alias from '@rollup/plugin-alias'
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
import {fileURLToPath} from 'node:url'

export default defineConfig({
  plugins: [
    vue({}),
    ckeditor5({theme: require.resolve('@ckeditor/ckeditor5-theme-lark')}),
    laravel({
      input: [
        'resources/css/app.css',
        'resources/css/style.css',
        'resources/js/app.js',
        'resources/css/main.css',
        'resources/css/media.css',
        'resources/css/mediaOriginal.css',
      ],
      refresh: true,
    }),
    alias({
      entries: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('/resources/', import.meta.url))
        },
      ]
    }),
  ],
  server: {
    hmr: {
      host: 'localhost'
    }
  },
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', {eager: true})
    return pages[`./Pages/${name}.vue`]
  },
});

