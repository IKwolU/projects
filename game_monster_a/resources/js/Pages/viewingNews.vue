<template>
    <Head :title="news.content.ru.title"/>
    <Layout>
        <main>
            <section class="one-new-sect">
                <div class="container">
                    <div class="flex-one-new">
                        <div class="left-one-new">
                            <div class="title-one-new">{{ news.content.ru.title }}</div>
                            <div class="flex-category-new">
                                <div class="container-category-new">
                                    <a v-for="categoryId in news.categories" href="#" class="item">
                                        {{ getCategoryName(categoryId) }}
                                    </a>
                                </div>
                                <div class="date-publish-new">
                                    <Date :date="news.created_at"/>
                                </div>
                            </div>
                            <div class="content-one-new roudImg" v-html="news.content.ru.article"></div>
                            <div class="other-news-block">
                                <div class="other-title">Другие новости</div>
                                <div class="grid-other-news">
                                    <template v-for="(newsLocal, index) in relatedNews">
                                        <div v-if="newsLocal.id !== news.id && index <= 2" class="item">
                                            <Link :href="'/news/' + newsLocal.id"
                                               class="preview bg-center bg-cover"
                                               :style="{ backgroundImage: `url('${newsLocal.image}')` }"
                                            ></Link>
                                            <a href="#" class="name">{{ newsLocal.content.ru.title }}</a>
                                            <a  href="#" class="category">{{ getCategoryName(newsLocal.categories[0]) }}</a>
                                        </div>
                                    </template>

                                </div>
                            </div>
                        </div>
                        <div class="right-one-new">
                            <div class="image-news-two">
                                <div class="first">
                                    <Link v-if="previousNews !== null" :href="'/news/' + previousNews.id">
                                        <svg width="525" height="354" viewBox="0 0 525 354" fill=""
                                             xmlns="http://www.w3.org/2000/svg"
                                             xmlns:xlink="http://www.w3.org/1999/xlink">
                                            <path
                                                d="M24.1041 0C10.7918 0 0 10.8122 0 24.1497V171.404C0 184.742 10.7918 195.554 24.1041 195.554H202.396C238.847 195.554 268.396 225.103 268.396 261.554V329.85C268.396 343.188 279.188 354 292.5 354H500.896C514.208 354 525 343.188 525 329.85V24.1497C525 10.8122 514.208 0 500.896 0H24.1041Z"
                                                fill="url(#pattern1)"/>
                                            <defs>
                                                <pattern id="pattern1" patternContentUnits="objectBoundingBox"
                                                         width="100%" height="100%">
                                                    <use xlink:href="#image0_12897:72"
                                                         transform="translate(-0.332681 -0.368998) scale(0.0010248 0.0015227)"/>
                                                </pattern>
                                                <image id="image0_12897:72" width="1920" height="1080"
                                                       :href="previousNews.image"/>
                                            </defs>
                                        </svg>
                                    </Link>
                                </div>
                                <div class="two">
                                    <Link v-if="nextNews !== null" :href="'/news/' + nextNews.id">
                                        <div v-if="previousNews === null" class="h-[50px]"></div>
                                        <svg v-if="nextNews !== null" width="525" height="425" viewBox="0 0 525 425"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg"
                                             xmlns:xlink="http://www.w3.org/1999/xlink">
                                            <path
                                                d="M2.87439e-07 24.1041C1.28691e-07 10.7918 10.8122 -1.28934e-07 24.1497 -2.87983e-07L203.85 -2.04398e-06C217.188 -2.20302e-06 228 10.7918 228 24.1041L228 132.894C228 147.805 240.088 159.894 255 159.894L500.35 159.894C513.688 159.894 524.5 170.685 524.5 183.998L524.5 400C524.5 413.312 513.688 424.104 500.35 424.104L24.1498 424.104C10.8122 424.104 6.13187e-06 413.312 5.97312e-06 400L2.87439e-07 24.1041Z"
                                                fill="url(#pattern0)"/>
                                            <defs>
                                                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1"
                                                         height="1">
                                                    <use xlink:href="#image0_1289:73"
                                                         transform="translate(-0.599311) scale(0.00114512 0.000925926)"/>
                                                </pattern>
                                                <image id="image0_1289:73" width="1920" height="1080"
                                                       :href="nextNews.image"/>
                                            </defs>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--                    <div class="comments">-->
                    <!--                        <div class="flex-fisrst-comments">-->
                    <!--                            <div class="title-comments">Комментарии</div>-->
                    <!--                            <a href="#" class="add-comment-button">+ Написать комментарий</a>-->
                    <!--                        </div>-->
                    <!--                        <div class="comments-container">-->
                    <!--                            <div class="item">-->
                    <!--                                <div class="img-comment" style="background: url(image/News/new_small.png);background-size: cover;background-position: center;"></div>-->
                    <!--                                <div class="first-line-comment">-->
                    <!--                                    <div class="name-comment">FatherofNation</div>-->
                    <!--                                    <div class="flex-first-line">-->
                    <!--                                        <div class="reviews-star">-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                        </div>-->
                    <!--                                        <div class="date-comment">Вчера, 21:30</div>-->
                    <!--                                    </div>-->
                    <!--                                </div>-->
                    <!--                                <div class="container-content-comment">Отличная игра жанра МОВА-Шутер. Доступность, не нужно платить сверху, держит в напряжении. Что еще нужно? Кто-то плачет про буст и троллинг? Жаль что вы не знаете что такое мут и руки. Всех кого бустят в любом случае упадут. Рейтинговая система меня вполне устраивает, во всех МОВА намного больший разброс. Доната нету, имею 300+ лвл и открыл все скины которые хотел и имею при этом 5к голды на ивент. В рейтинге - Золото, но и играю соответствующе. Поэтому игра отличная. Ивентов много, скины иногда топ. Для игры с друзьями самое то.-->
                    <!--                                    Игру рекомендую на 100%</div>-->
                    <!--                            </div>-->
                    <!--                            <div class="item">-->
                    <!--                                <div class="img-comment" style="background: url(image/News/new_small.png);background-size: cover;background-position: center;"></div>-->
                    <!--                                <div class="first-line-comment">-->
                    <!--                                    <div class="name-comment">FatherofNation</div>-->
                    <!--                                    <div class="flex-first-line">-->
                    <!--                                        <div class="reviews-star">-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                        </div>-->
                    <!--                                        <div class="date-comment">Вчера, 21:30</div>-->
                    <!--                                    </div>-->
                    <!--                                </div>-->
                    <!--                                <div class="container-content-comment">Отличная игра жанра МОВА-Шутер. Доступность, не нужно платить сверху, держит в напряжении. Что еще нужно? Кто-то плачет про буст и троллинг? Жаль что вы не знаете что такое мут и руки. Всех кого бустят в любом случае упадут. Рейтинговая система меня вполне устраивает, во всех МОВА намного больший разброс. Доната нету, имею 300+ лвл и открыл все скины которые хотел и имею при этом 5к голды на ивент. В рейтинге - Золото, но и играю соответствующе. Поэтому игра отличная. Ивентов много, скины иногда топ. Для игры с друзьями самое то.-->
                    <!--                                    Игру рекомендую на 100%</div>-->
                    <!--                            </div>-->
                    <!--                            <div class="item">-->
                    <!--                                <div class="img-comment" style="background: url(image/News/new_small.png);background-size: cover;background-position: center;"></div>-->
                    <!--                                <div class="first-line-comment">-->
                    <!--                                    <div class="name-comment">FatherofNation</div>-->
                    <!--                                    <div class="flex-first-line">-->
                    <!--                                        <div class="reviews-star">-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.0001 14.7364L15.1701 17.8564C15.5501 18.0864 16.0201 17.7464 15.9201 17.3164L14.5501 11.4364L19.1101 7.4864C19.4401 7.1964 19.2701 6.6464 18.8201 6.6064L12.8101 6.0964L10.4601 0.556401C10.2901 0.146401 9.71006 0.146401 9.54006 0.556401L7.19006 6.0964L1.18006 6.6064C0.740056 6.6464 0.560056 7.1964 0.900056 7.4864L5.46006 11.4364L4.09006 17.3164C3.99006 17.7464 4.46006 18.0864 4.84006 17.8564L10.0001 14.7364Z" fill="#DCA53B"/> </svg>-->
                    <!--                                        </div>-->
                    <!--                                        <div class="date-comment">Вчера, 21:30</div>-->
                    <!--                                    </div>-->
                    <!--                                </div>-->
                    <!--                                <div class="container-content-comment">Отличная игра жанра МОВА-Шутер. Доступность, не нужно платить сверху, держит в напряжении. Что еще нужно? Кто-то плачет про буст и троллинг? Жаль что вы не знаете что такое мут и руки. Всех кого бустят в любом случае упадут. Рейтинговая система меня вполне устраивает, во всех МОВА намного больший разброс. Доната нету, имею 300+ лвл и открыл все скины которые хотел и имею при этом 5к голды на ивент. В рейтинге - Золото, но и играю соответствующе. Поэтому игра отличная. Ивентов много, скины иногда топ. Для игры с друзьями самое то.-->
                    <!--                                    Игру рекомендую на 100%</div>-->
                    <!--                            </div>-->
                    <!--                        </div>-->
                    <!--                        <div class="show-more-button-comment">Показать ещё</div>-->
                    <!--                    </div>-->
                </div>
            </section>
        </main>
    </Layout>
</template>

<script>
import {defineComponent} from 'vue'
import Layout from "@/components/layouts/layout.vue";
import {Head} from "@inertiajs/vue3";
import Date from "@/components/date.vue";
import {Link} from "@inertiajs/vue3";

export default defineComponent({
    name: "viewingNews",
    components: {Date, Layout, Head, Link},
    props: ['news', 'categories', 'nextNews', 'previousNews', 'relatedNews'],
    methods: {
        getCategoryName(categoryId) {
            const data = this.categories.find(category => parseInt(category.id) === parseInt(categoryId));
            return data.title_ru;
        }
    }
})
</script>

<style>
.roudImg .image_resized {
    border-radius: 20px;
}
</style>
