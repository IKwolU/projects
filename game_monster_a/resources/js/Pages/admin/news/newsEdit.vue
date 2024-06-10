<template>
    <AdminLayout>
        <TitlePage>Редактирование новости</TitlePage>
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">
        <div class="w-full flex flex-col gap-6">
            <div class="flex gap-4">
                <div class="w-2/3">
                    <label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Выберите категорию / категории | Для выбора нескольких категорий зажмите
                        <span class="underline text-blue-500">CTRL</span>
                    </label>
                    <select v-model="data.categories" multiple id="categories"
                            class="bg-gray-50 h-[100px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <template v-for="category in categories">
                            <option :value="category.id">{{ category.title_ru }}</option>
                        </template>
                    </select>
                </div>
                <div class="w-1/3">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Изображение
                        поста | Чтобы изменить загрузите новую</label>
                    <input type="file" accept="image/*" ref="file" @change="changeImage(this)"
                           class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                           id="default_size">
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or
                        GIF.</p>
                </div>
            </div>
            <div>
                <img class="max-h-[400px] rounded-xl" :src="data.imageUrl" alt="">
            </div>
            <div>
                <div class="flex gap-1">
                    <div @click="lang = 'ru'"
                         class="border-2 cursor-pointer border-gray-600 p-1 rounded-t-lg border-b-0 hover:opacity-70 transition-all"
                         :class="{'bg-gray-700' : selectLang('ru')}"
                    >
                        Русский язык
                    </div>
                    <div @click="lang = 'en'"
                         class="border-2 cursor-pointer border-gray-600 p-1 rounded-t-lg border-b-0 hover:opacity-70"
                         :class="{'bg-gray-700' : selectLang('en')}"
                    >
                        Английский язык
                    </div>
                </div>
                <hr/>
            </div>
            <div :class="{hidden : !selectLang('ru')}">
                <NewsMain :news="data.content.ru" @data="data => setData('ru',data)"/>
            </div>
            <div :class="{hidden : !selectLang('en')}">
                <NewsMain :news="data.content.en" @data="data => setData('en',data)"/>
            </div>
            <div>
                <button @click="UpdateNews" type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Сохранить изменения
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import {defineComponent} from "vue";
import TitlePage from "@/components/admin/news/titlePage.vue";
import AdminLayout from "@/components/layouts/adminLayout.vue";
import NewsMain from "@/components/admin/news/newsMain.vue";
import {router} from "@inertiajs/vue3";

export default defineComponent({
    name: "newsEdit",
    components: {NewsMain, AdminLayout, TitlePage},
    props: ['categories', 'news'],
    data() {
        return {
            lang: 'ru',
            data: {
                categories: this.news.categories,
                image: null,
                imageUrl: this.news.image,
                content: this.convertToJson(this.news.content)
            }
        }
    },
    methods: {
        selectLang(data) {
            return data === this.lang;
        },
        changeImage() {
            this.data.image = this.$refs.file.files[0];
        },
        setData(lang, data) {
            switch (lang) {
                case 'ru':
                    this.data.content.ru = data;
                    break;
                case 'en':
                    this.data.content.en = data;
                    break;
            }
        },
        UpdateNews() {
            const id = this.news.id;
            router.post('/admin/news/update/' + id, this.data, {
                forceFormData: true,
                onSuccess : () => {
                    router.visit('/admin/news');
                }
            });
        },
        convertToJson(content) {
            content = JSON.parse(content);
            if (content) {
                return {
                    ru: content.ru,
                    en: content.en
                }
            } else {
                return {
                    ru: '',
                    en: ''
                }
            }
        }
    }
});
</script>
