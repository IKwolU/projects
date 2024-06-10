<script setup>

import AdminLayout from "../../../components/layouts/adminLayout.vue";
import TitlePage from "../../../components/admin/news/titlePage.vue";
import {reactive, ref} from "vue";
import {router} from "@inertiajs/vue3";

const titles = reactive({
  title_ru: '',
  title_en: ''
});
let categoriesInput = ref('');
let categoriesInput_en = ref('');

let podCategoriesInput = ref([]);
let podCategoriesInput_en = ref([]);

let img = ref();
let imgLong = ref();
let categories = ref([]);

const addCategory = () => {
  if (categoriesInput.value !== '') {
    categories.value.push({name: [categoriesInput.value, categoriesInput_en.value], podCategories: []});
    categoriesInput.value = '';
    categoriesInput_en.value = '';
  }
}

const addPodCategory = index => {
  if (podCategoriesInput.value[index] !== '') {
    categories.value[index].podCategories.push([podCategoriesInput.value[index], podCategoriesInput_en.value[index]]);
    podCategoriesInput.value[index] = '';
    podCategoriesInput_en.value[index] = '';
  }
}

const DeleteCategory = index => {
  categories.value.splice(index, 1);
}

const DeletePodCategory = (index, lIndex) => {
  categories.value[index].podCategories.splice(lIndex, 1);
}

const sendData = () => {
  const data = {
    name: titles,
    img: img.value.files[0],
    imgLong: imgLong.value.files[0],
    categories: categories.value
  }
  router.post('/admin/games/create', data, {
    forceFormData: true,
    onSuccess: () => {
      router.visit('/admin/games');
    }
  });
};
</script>

<template>
  <AdminLayout>
    <TitlePage>Добавить игру</TitlePage>
    <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">

    <div class="w-full flex gap-4">
      <div class="flex-1">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="mainImg">Основная
          картинка</label>
        <input ref="img"
               class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
               id="mainImg" type="file">
      </div>
      <div class="flex-1">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="longImg">Широкая картинка для
          шапки</label>
        <input ref="imgLong"
               class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
               id="longImg" type="file">
      </div>
    </div>
    <p class="w-full text-left mb-2">Название игры:</p>
    <div class="flex gap-4 w-full items-center">
      <input v-model="titles.title_ru" accept="image/*" ref="refImg" name="name_ru" placeholder="На русском" type="text"
             id="default-input"
             class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <input v-model="titles.title_en" accept="image/*" ref="refImgLong" name="name_en" placeholder="На английском"
             type="text" id="default-input"
             class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <div class="flex flex-col w-full mt-4">
      <h2 class="mb-2 text-gray-900 dark:text-white">Категории для игры</h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="(category, index) in categories"
             class="flex flex-col self-start gap-2 bg-gray-700 p-4 rounded-xl border-[1px] border-gray-500 shadow-lg">
          <table>
            <thead>
            <tr class="border-b-[2px] border-gray-500">
              <th class="py-1 text-lg">{{ category.name[0] }}</th>
              <th class="py-1 text-lg">{{ category.name[1] }}</th>
              <th class="text-lg">
                <button title="Удалить категорию">
                <span @click="DeleteCategory(index)" class="material-symbols-outlined text-red-500 cursor-pointer">
                delete_forever
                </span>
                </button>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(lCategory , lIndex) in category.podCategories" class="[&:nth-child(2n)]:bg-gray-800">
              <td class="p-1">{{ lCategory[0] }}</td>
              <td class="p-1">{{ lCategory[1] }}</td>
              <td class="p-1">
              <span @click="DeletePodCategory(index, lIndex)" class="material-symbols-outlined text-red-500 cursor-pointer">
                remove
              </span>
              </td>
            </tr>
            <tr class="border-t-[2px] border-gray-500">
              <td class="p-1 pt-4">
                <input v-model="podCategoriesInput[index]" class="rounded-lg bg-gray-500" placeholder="На русском" type="text">
              </td>
              <td class="p-1 pt-4">
                <input v-model="podCategoriesInput_en[index]" class="rounded-lg bg-gray-500" placeholder="На английском" type="text">
              </td>
              <td class="p-1  pt-4">
              <span @click="addPodCategory(index)" class="material-symbols-outlined text-green-500 cursor-pointer">
                add
              </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex self-start mt-8 gap-4 items-center">
        <input v-model="categoriesInput" class="rounded-lg bg-gray-500" placeholder="На русском" type="text">
        <input v-model="categoriesInput_en" class="rounded-lg bg-gray-500" placeholder="На русском" type="text">
        <span @click="addCategory()" class="material-symbols-outlined text-green-500 cursor-pointer">
          add
        </span>
      </div>

    </div>

    <div class="w-full flex justify-end mt-4">
      <button @click="sendData()" type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Сохранить игру
      </button>
    </div>


  </AdminLayout>
</template>

<style scoped>

</style>
