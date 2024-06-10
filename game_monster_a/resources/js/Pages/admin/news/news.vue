<template>
    <AdminLayout>
        <TitlePage>Создание и редактирование новостей</TitlePage>
        <div class="w-full">
            <div class="w-full flex justify-end mt-[50px]">
                <Link href="/admin/news/create">
                    <button type="button"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Создать новость
                    </button>
                </Link>
            </div>
            <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">
            <ul class="flex flex-wrap gap-4">
                <template v-for="n in news" :key="n.id">
                    <NewsCard
                        :news="n"
                    />
                </template>
            </ul>
        </div>
    </AdminLayout>
</template>

<script>
import {defineComponent} from 'vue'
import AdminLayout from "@/components/layouts/adminLayout.vue";
import TitlePage from "@/components/admin/news/titlePage.vue";
import {Link} from "@inertiajs/vue3";
import NewsCard from "../../../components/admin/news/newsCard.vue";

export default defineComponent({
    name: "news",
    components: {NewsCard, TitlePage, AdminLayout, Link},
    props: ['news']
})
</script>

<style scoped>

</style>
