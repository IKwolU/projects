// Свайпер
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './bootstrap';
import {createApp, h} from "vue/dist/vue.esm-bundler";
import {createInertiaApp} from '@inertiajs/vue3';
import 'flowbite';
import CKEditor from '@ckeditor/ckeditor5-vue';
const el = document.getElementById("app");


const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination]
});

createInertiaApp({
  title: title => `GameMonster | ${title}`,
  progress: {
    // The delay after which the progress bar will appear, in milliseconds...
    delay: 50,

    // The color of the progress bar...
    color: '#ff5353',

    // Whether to include the default NProgress styles...
    includeCSS: true,

    // Whether the NProgress spinner will be shown...
    showSpinner: false,
  },
  resolve:
    name => {
      const pages = import.meta.glob('./Pages/**/*.vue', {eager: true})
      return pages[`./Pages/${name}.vue`]
    },
  setup({el, App, props, plugin}) {
    createApp({render: () => h(App, props)})
      .use(plugin)
      .use(CKEditor)
      .mount(el)
  },
}).then()
