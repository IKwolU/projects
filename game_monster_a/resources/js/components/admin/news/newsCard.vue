<template>
    <li
        class="max-w-[300px] w-[300px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div>
            <img class="rounded-t-lg h-[200px] max-h-[200px] w-full object-cover object-top" :src="news.image" alt=""/>
            <div class="p-2 flex flex-col justify-between h-[300px]">
                <div>
                    <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{{
                            news.content.ru.title
                        }}</h5>
                    <p class="mb-3 text-sm font-normal text-gray-700 w-full dark:text-gray-400"
                       v-html="news.content.ru.article.substring(0,140) + '...'"></p>
                </div>
                <div class="flex justify-between">
                    <button @click="edit(news.id)" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Изменить
                    </button>
                    <button @click="destroy(news.id)" type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Удалить
                    </button>
                </div>
            </div>
        </div>

    </li>
</template>

<script>
import {defineComponent} from 'vue'
import {router} from "@inertiajs/vue3";

export default defineComponent({
    name: "newsCard",
    props: ['news'],
    methods: {
        destroy(id){
            router.post('/admin/news/destroy/' + id);
        },
        edit(id){
            router.get('/admin/news/edit/' + id);
        }
    },
})
</script>

<style scoped>
.drag {
    transition: 1s;
}
.drag > div{
    transform: rotate(5deg);
    opacity: 100;
}
.ghost {
    border: 2px gray dashed;
    transition: 0.5s;
}
.ghost > div{
    visibility: hidden;
}
</style>
