<script setup>
import AdminLayout from "../../../components/layouts/adminLayout.vue";
import TitlePage from "../../../components/admin/news/titlePage.vue";
import {Link, router} from "@inertiajs/vue3";

const props = defineProps(['games']);

const DellGame = id => {
  router.post(`/admin/games/delete/${id}`);
}

</script>

<template>
<AdminLayout>
  <TitlePage>Список игр</TitlePage>
  <div class="flex justify-end w-full">
    <Link href="/admin/games/create">
      <button type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Добавить игру
      </button>
    </Link>
  </div>
  <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">

  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" class="px-6 py-3">
        ID
      </th>
      <th scope="col" class="px-6 py-3">
        На русском
      </th>
      <th scope="col" class="px-6 py-3">
        На английском
      </th>
      <th scope="col" class="px-6 py-3">
        Действия
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="game in games" :key="game.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {{game.id}}
      </th>
      <td class="px-6 py-4">
        {{game.name.title_ru}}
      </td>
      <td class="px-6 py-4">
        {{game.name.title_en}}
      </td>
      <td class="px-6 py-4 flex items-center gap-2">
        <Link :href="`/admin/games/edit/${game.id}`">
          <button type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-yellow-900">Изменить</button>
        </Link>
        <button @click="DellGame(game.id)" type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Удалить</button>
      </td>
    </tr>
    </tbody>
  </table>
</AdminLayout>
</template>

<style scoped>

</style>
