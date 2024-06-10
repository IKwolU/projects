<script setup>
import {router} from "@inertiajs/vue3";

const props = defineProps(['settings'])
import AdminLayout from "../../components/layouts/adminLayout.vue";
import TitlePage from "../../components/admin/news/titlePage.vue";

const sendData = () => {
  router.post('/admin/settings/update/1', props.settings);
}
</script>

<template>
  <AdminLayout>
    <TitlePage>Настройки сайта</TitlePage>
    <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">
    <div class="flex w-full">
      <div class="justify-start ">
        <div class="mb-6">
          <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Наценка на
            товары в %</label>
          <input v-model="props.settings.tax" type="number" id="default-input"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <button @click="sendData(props.settings.tax)" type="button"
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Сохранить
        </button>
      </div>
    </div>

  </AdminLayout>
</template>

<style scoped>

</style>
