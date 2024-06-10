<template>
    <AdminLayout>
        <TitlePage>Новостные категории</TitlePage>
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">
        <div class="relative overflow-x-auto w-full">
            <p class="text-sm my-2 text-gray-900 dark:text-white">
                Чтобы изменить название категории нажмите на <span class="text-blue-500">текст</span>, отредактируйте, после чего нажмите <span class="text-yellow-400">изменить</span>
            </p>
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
                <template v-for="category in categories">
                    <categories-line :category="category" />
                </template>
                </tbody>
            </table>
                <div class="mt-5 flex gap-4 items-center">
                    <div class="w-1/3">
                        <input v-model="title_ru" name="title_ru" placeholder="На русском" type="text" id="default-input"
                               class="ml-1 mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                    <div class="w-1/3">
                        <input v-model="title_en" name="title_en" placeholder="На английском" type="text" id="default-input"
                               class="ml-1 mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                    <button @click="post" type="submit"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Создать
                    </button>
                </div>
        </div>


    </AdminLayout>
</template>

<script>
import {defineComponent} from 'vue'
import AdminLayout from "@/components/layouts/adminLayout.vue";
import TitlePage from "@/components/admin/news/titlePage.vue";
import {router} from '@inertiajs/vue3'
import CategoriesLine from "@/components/admin/news/categoriesLine.vue";

export default defineComponent({
    name: "NewsCaregories",
    components: {CategoriesLine, TitlePage, AdminLayout},
    props:['categories'],
    data() {
        return {
            title_ru: '',
            title_en: '',
        }
    },
    methods: {
        post() {
            const data = {
                'title_ru': this.title_ru,
                'title_en': this.title_en
            }
            router.post('/admin/news/categories/create', data);
            this.title_ru = '';
            this.title_en = '';
        },
    }
})
</script>

<style scoped>

</style>
