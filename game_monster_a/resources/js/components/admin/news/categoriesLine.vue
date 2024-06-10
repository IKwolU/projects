<template>
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ category.id }}
        </th>
        <td class="px-6 py-4">
            <input v-model="title_ru" class="bg-gray-800 p-0 rounded-xl" type="text">
        </td>
        <td class="px-6 py-4">
            <input v-model="title_en" class="bg-gray-800 p-0 rounded-xl" type="text">
        </td>
        <td class="px-6 py-4">
            <button @click="update" type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:focus:ring-yellow-900">
                Изменить
            </button>
            <button @click="destroy" type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Удалить
            </button>
        </td>
    </tr>
</template>

<script>
import {defineComponent} from 'vue'
import {router} from "@inertiajs/vue3";

export default defineComponent({
    name: "categoriesLine",
    props: ["category"],
    data(){
        return{
            title_ru : this.category.title_ru,
            title_en : this.category.title_en,
        }
    },
    methods:{
        destroy() {
            router.post('/admin/news/categories/delete/' + this.category.id);
        },
        update(){
            const data = {
                'title_ru' : this.title_ru,
                'title_en' : this.title_en,
            };
            router.post('/admin/news/categories/update/' + this.category.id, data);
        }
    }
})
</script>

<style scoped>

</style>
