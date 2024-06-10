<template>
    <aside id="default-sidebar"
           class="relative min-h-screen z-40 min-w-[250px] transition-all"
           aria-label="Sidebar">
        <div
            class="h-full px-3 py-4 overflow-y-auto max-w-[250px] bg-gradient-to-b from-black to-gray-900 fixed w-full shadow-lg border-r-2 dark:border-gray-800 border-gray-200">
            <Link href="/" class="flex items-center mb-4">
                <img src="../../../image/logo.svg" class="w-[80%]" alt="Flowbite Logo"/>
            </Link>
            <hr/>
            <ul class="space-y-2 font-medium mt-3">
              <li>
                <Link href="/admin"
                      class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span class="material-symbols-outlined">home</span>
                  <span class="ml-3">Главная</span>
                </Link>
              </li>
              <li>
                <button type="button"
                        class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                  <span class="material-symbols-outlined">newsmode</span>
                  <span class="flex-1 ml-3 text-left whitespace-nowrap">Новости</span>
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
                <ul id="dropdown-example" class="hidden py-2 space-y-2">
                  <li>
                    <Link href="/admin/news"
                          class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Все новости
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/news/create"
                          class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Создать новость
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/news/categories"
                          class="flex whitespace-nowrap items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Категории новостей
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/news/editpostions"
                          class="flex whitespace-nowrap items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Позиция на главной
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <button type="button"
                        class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        aria-controls="game-list" data-collapse-toggle="game-list">
                  <span class="material-symbols-outlined">stadia_controller</span>
                  <span class="flex-1 ml-3 text-left whitespace-nowrap">Игры</span>
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
                <ul id="game-list" class="hidden py-2 space-y-2">
                  <li>
                    <Link href="/admin/games"
                          class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Все игры
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/games/create"
                          class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Добавить игру
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/admin/settings"
                      class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span class="material-symbols-outlined">settings</span>
                  <span class="ml-3">Настройки</span>
                </Link>
              </li>
            </ul>
        </div>
    </aside>
</template>

<script>
import {defineComponent} from 'vue'
import {Link} from "@inertiajs/vue3";

export default defineComponent({
    name: "SideBar",
    components: {Link}
})
</script>

<style scoped>

</style>
