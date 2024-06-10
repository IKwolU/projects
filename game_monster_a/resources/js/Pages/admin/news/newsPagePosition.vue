<template>
    <AdminLayout>
        <TitlePage>Изминение позиции новостей на главной странице</TitlePage>
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">
        <div class="w-full">
            <div class="flex flex-col gap-4 items-center my-10">
                <p class="text-sm text-gray-900 p-0 m-0 dark:text-white w-[800px]">Отобразится на главной только 4
                    новости</p>
                <div
                    class="flex overflow-hidden gap-[30px] max-w-[800px] mt-[-10px] w-full min-h-[400px] flex-wrap rounded-xl border-dashed border-2 border-gray-600">
                    <Draggable
                        v-model="positionsData"
                        group="news"
                        item-key="id"
                        class="flex gap-4 flex-wrap justify-between p-20 w-full bg-gray-900"
                        tag="ul"
                        drag-class="drag"
                        ghost-class="ghost"
                    >
                        <template #item="{element}">
                            <NewsCard
                                :news="element"
                            />
                        </template>
                    </Draggable>
                </div>
                <div class="w-[800px]">
                    <button @click="saveData()" type="button"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full">
        <div class="w-full flex gap-4">
            <Draggable
                v-model="newsData"
                group="news"
                item-key="id"
                class="flex gap-4 flex-wrap bg-gray-900 min-h-[300px] w-full rounded-xl"
                tag="ul"
                drag-class="drag"
                ghost-class="ghost"
            >
                <template #item="{element}">
                    <NewsCard
                        :news="element"
                    />
                </template>
            </Draggable>
        </div>
    </AdminLayout>
</template>

<script>
import {defineComponent} from 'vue'
import AdminLayout from "@/components/layouts/adminLayout.vue";
import TitlePage from "@/components/admin/news/titlePage.vue";
import NewsCard from "@/components/admin/news/newsCard.vue";
import Draggable from "vuedraggable";
import {router} from "@inertiajs/vue3";

export default defineComponent({
    name: "newsPagePosition",
    components: {NewsCard, AdminLayout, TitlePage, Draggable},
    props: ['news', 'positions'],
    data() {
        return {
            newsData: [],
            positionsData: []
        }
    },
    methods: {
        GetPositionsData(news, positions) {
            return positions.map(pos => news.filter(n => n.id === pos)).map(d => d[0]);
        },
        getNewsData(news, positions) {
            return news.filter(news => !positions.find(position => position === news.id));
        },
        saveData() {
            const pos = this.positionsData.map(posData => posData.id);

            router.post('/admin/news/editpostions', pos, {
                onSuccess: () => alert('Данные сохранены'),
            });
        }
    },
    mounted() {
        const positionsLocal = JSON.parse(this.positions[0].positions);
        this.positionsData = this.GetPositionsData(this.news, positionsLocal);
        this.newsData = this.getNewsData(this.news, positionsLocal);
    }
})
</script>

<style scoped>
.drag {
    transition: 1s;
}

.drag > div {
    transform: rotate(5deg);
    opacity: 100;
}

.ghost {
    border: 2px gray dashed;
    transition: 0.5s;
}

.ghost > div {
    visibility: hidden;
}
</style>
