<template>
    <Head title="Игровые новости"/>
    <teleport to="body">
        <newsClip />
    </teleport>
    <Layout>
        <main>
            <NewsBlock :categories="categories" :news="news" :positions="positions" :mobileShowAll="true"/>
            <div class="container sm:hidden">
                <div class="news-abs-container-2">`
                    <div class="new8-abs">
                        <div class="flex-tree-news">
                            <Link v-if="typeof news[10] !== 'undefined'" :href="'/news/' + news[10].id" class="item">
                                <div
                                    class="img bg-center bg-cover"
                                    :style="{ backgroundImage: `url('${news[10].image}')` }"
                                ></div>
                                <div class="desc-block w-[60%]">
                                    <div class="name">{{ news[10].content.ru.title }} 322</div>
                                    <div class="category">{{ getCategoryName(news[10].categories[0]) }}</div>
                                </div>
                            </Link>
                            <Link v-if="typeof news[11] !== 'undefined'" :href="'/news/' + news[11].id" class="item">
                                <div
                                    class="img bg-center bg-cover"
                                    :style="{ backgroundImage: `url('${news[11].image}')` }"
                                ></div>
                                <div class="desc-block w-[60%]">
                                    <div class="name">{{ news[11].content.ru.title }}</div>
                                    <div class="category">{{ getCategoryName(news[10].categories[0]) }}</div>
                                </div>
                            </Link>
                            <Link v-if="typeof news[12] !== 'undefined'" :href="'/news/' + news[12].id" class="item">
                                <div
                                    class="img bg-center bg-cover"
                                    :style="{ backgroundImage: `url('${news[11].image}')` }"
                                ></div>
                                <div class="desc-block w-[60%]">
                                    <div class="name">{{ news[12].content.ru.title }}</div>
                                    <div class="category">{{ getCategoryName(news[10].categories[0]) }}</div>
                                </div>
                            </Link>
                            <Link v-if="typeof news[13] !== 'undefined'" :href="'/news/' + news[13].id" class="item">
                                <div
                                    class="img bg-center bg-cover"
                                    :style="{ backgroundImage: `url('${news[13].image}')` }"
                                ></div>
                                <div class="desc-block w-[60%]">
                                    <div class="name">{{ news[13].content.ru.title }}</div>
                                    <div class="category">{{ getCategoryName(news[10].categories[0]) }}</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <Link v-if="typeof news[14] !== 'undefined'" :href="'/news/' + news[14].id" class="new9-abs pc-fade">
                        <svg width="982" height="430" viewBox="0 0 982 430" fill="none"
                             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <image :href="news[14].image" width="100%" clip-path="url(#new9_bg)"></image>
                        </svg>
                        <div class="text-content">
                            <div class="category-news-abs">Скидки и акции</div>
                            <div class="title-news-abs">{{ news[14].content.ru.title }}</div>
                            <Link :href="'/news/' + news[14].id" class="button-abs-news">Начать</Link>
                        </div>
                    </Link>
                    <Link v-if="typeof news[15] !== 'undefined'" :href="'/news/' + news[15].id" class="new10-abs bg-bottom">
                        <div class="bg-img bg-center bg-cover"
                             :style="{ backgroundImage: `url('${news[15].image}')` }"></div>
                        <div class="text-content">
                            <div class="category-news-abs">Скидки и акции</div>
                            <div class="title-news-abs">{{ news[15].content.ru.title }}</div>
                        </div>
                    </Link>
                    <Link v-if="typeof news[16] !== 'undefined'" :href="'/news/' + news[16].id" class="new11-abs bg-bottom">
                        <div class="bg-img bg-center bg-cover"
                             :style="{ backgroundImage: `url('${news[16].image}')` }"></div>
                        <div class="text-content">
                            <div class="category-news-abs">Скидки и акции</div>
                            <div class="title-news-abs">{{ news[16].content.ru.title }}</div>
                        </div>
                    </Link>
                    <Link v-if="typeof news[17] !== 'undefined'" :href="'/news/' + news[14].id" class="new12-abs">
                        <svg class="pc-fade" width="525" height="471" viewBox="0 0 525 471" fill="none"
                             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <image :href="news[17].image" height="100%" clip-path="url(#new12_bg)"></image>
                        </svg>
                        <div class="bg-img mob-fade"
                             style="background-size:cover;background: url(image/News/new.png) center;"></div>
                        <div class="text-content">
                            <div class="category-news-abs">Скидки и акции</div>
                            <div class="title-news-abs">{{ news[17].content.ru.title }}</div>
                        </div>
                    </Link>
                    <Link v-if="typeof news[18] !== 'undefined'" :href="'/news/' + news[15].id" class="new13-abs">
                        <div class="flex-small-news">
                            <a class="item" href="#">
                                <div class="img mob-fade"
                                     style="background-size:cover;background: url(image/News/new_small.png) center;"></div>
                                <div class="flex-text">
                                    <div class="name">{{ news[18].content.ru.title }}</div>
                                    <div class="category mob-fade">{{ getCategoryName(news[10].categories[0]) }}</div>
                                </div>
                            </a>
                            <a class="item" href="#">
                                <div class="img mob-fade"
                                     style="background-size:cover;background: url(image/News/new_small.png) center;"></div>
                                <div class="flex-text">
                                    <div class="name">{{ news[19].content.ru.title }}</div>
                                    <div class="category mob-fade">{{ getCategoryName(news[10].categories[0]) }}</div>
                                </div>
                            </a>
                        </div>
                    </Link>

                </div>
                <div class="grid-full-news">
                    <template v-for="(n, index) in news">
                        <div v-if="index > 20" class="item">
                            <Link :href="'/news/' + n.id"
                               class="preview bg-center bg-cover"
                               :style="{ backgroundImage: `url('${n.image}')` }">
                            </Link>
                            <div class="text-block">
                                <a href="#" class="name-new">{{ n.content.ru.title }}</a>
                                <div class="category"> {{ getCategoryName(n.categories[0]) }}</div>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </main>
    </Layout>
</template>

<script>
import {defineComponent} from 'vue'
import Layout from "@/components/layouts/layout.vue";
import {Head, Link} from "@inertiajs/vue3";
import NewsBlock from "@/components/news/NewsBlock.vue";
import NewsClip from "@/components/pageClips/newsClip.vue";

export default defineComponent({
    name: "news",
    components: {Link, NewsBlock, Layout, Head, NewsClip},
    props: ['positions', 'news', 'categories'],
    methods: {
        getCategoryName(categoryId) {
            const data = this.categories.find(category => parseInt(category.id) === parseInt(categoryId));
            return data.title_ru;
        }
    }
})
</script>

<style scoped>

</style>
