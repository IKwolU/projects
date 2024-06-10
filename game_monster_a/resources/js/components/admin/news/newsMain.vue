<template>
    <div>
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Заголовок</label>
        <input v-model="content.title" type="text" id="title"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <div class="mx-auto w-full">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-4">Содержимое статьи</label>
        <TextEditor :data="this.news.article" @editorData="(data) => onChange(data)" />
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import TextEditor from "@/components/admin/news/textEditor.vue";

export default defineComponent({
    name: "newsMain",
    components: {TextEditor},
    emits: ['data'],
    props: ['news'],
    data(){
        return {
            content:{
                title: this.news.title,
                article : this.news.title,
            }
        }
    },
    methods:{
        onChange(data) {
            this.content.article = data;
            this.$emit('data', this.content)
        },
    },
})
</script>

<style scoped>

</style>
