<template>
  <section class="news-main">
    <div class="container">
      <div class="first-line-catalog-main">
        <div class="title-catalog-main">Новости</div>
        <Link v-if="showAllNewsLinkLocal" href="/news">Все новости</Link>
      </div>
      <div class="news-block-page">
        <div class="news-abs-container">
          <Link :href="'/news/' + getData(1, 'id')" v-if="getData(1, 'exists')" class="new1-abs">
            <svg class="def_svg_image pc-fade" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="100%"
                 viewBox="0 0 568 380">
              <image style="background-size:cover; background-position:center;"
                     :href="getData(1, 'image')" width="100%" clip-path="url(#new1_bg)"></image>
            </svg>
            <img class="dop-img mob-fade object-cover pt-0" :src="getData(1, 'image')" alt="">
            <div class="text-content">
              <div class="category-news-abs">{{ getData(1, 'category') }}</div>
              <div class="title-news-abs">{{ getData(1, 'title') }}</div>
            </div>
          </Link>
          <Link :href="'/news/' + getData(2, 'id')" v-if="getData(2, 'exists')" class="new2-abs bg-bottom pc-fade">
            <svg class="def_svg_image" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="100%"
                 viewBox="0 0 517 474">
              <image style="background-size:cover; background-position:center;"
                     :href="getData(2, 'image')" clip-path="url(#new2_bg)"></image>
            </svg>
            <div class="text-content">
              <div class="category-news-abs">{{ getData(2, 'category') }}</div>
              <div class="title-news-abs">{{ getData(2, 'title') }}</div>
            </div>
          </Link>
          <Link :href="'/news/' + newsData[0].id" v-if="getExists(0)" class="new3-abs pc-fade">
            <svg class="def_svg_image" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="100%"
                 viewBox="0 0 383 298">
              <image style="background-size:cover; background-position:center;"
                     :href="newsData[0].image"
                     clip-path="url(#new3_bg)"></image>
            </svg>
            <div class="text-content">
              <div class="category-news-abs">{{ getCategory(newsData[0]) }}</div>
              <div class="title-news-abs">{{ newsData[0].content.ru.title }}</div>
            </div>
            <div class="abs-release">
              <img src="../../../image/News/OS/ios.svg" alt="" class="ios">
              <img src="../../../image/News/OS/android.svg" alt="" class="android">
            </div>
          </Link>
          <Link :href="'/news/' + getData(3, 'id')" v-if="getData(3, 'exists')" class="new4-abs bg-bottom pc-fade">
            <svg class="def_svg_image pc-fade" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="100%"
                 viewBox="0 0 473 505">
              <image style="background-size:cover; background-position:center;"
                     :href="getData(3, 'image')" height="100%" clip-path="url(#new4_bg)"></image>
            </svg>
            <div class="text-content">
              <div class="category-news-abs">{{ getData(3, 'category') }}</div>
              <div class="title-news-abs">{{ getData(3, 'title') }}</div>
            </div>
          </Link>
          <Link :href="'/news/' + getData(4, 'id')">
            <div v-if="getData(4, 'exists')" class="new5-abs pc-fade">
              <svg class="def_svg_image" xmlns="http://www.w3.org/2000/svg"
                   xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="100%"
                   viewBox="0 0 517 293">
                <image style="background-size:cover; background-position:center;"
                       :href="getData(4, 'image')" width="100%" clip-path="url(#new5_bg)"></image>
              </svg>
              <div class="text-content">
                <div class="category-news-abs">{{ getData(4, 'category') }}</div>
                <div class="title-news-abs">{{ getData(4, 'title') }}</div>
              </div>
            </div>
          </Link>
          <div class="new6-abs sm:hidden">
            <div class="flex-tree-news">
              <Link :href="'/news/' + newsData[1].id" v-if="getExists(1)" class="item">
                <div class="min-w-[114px]">
                  <img class=".img object-cover object w-[114px] h-[92px] rounded-xl"
                       :src="newsData[1].image" alt="">
                </div>
                <div class="desc-block">
                  <div class="name">{{ newsData[1].content.ru.title }}</div>
                  <div class="category">{{ getCategory(newsData[1]) }}</div>
                </div>
              </Link>
              <Link :href="'/news/' + newsData[2].id" v-if="getExists(2)" class="item">
                <div class="min-w-[114px]">
                  <img class=".img object-cover object w-[114px] h-[92px] rounded-xl"
                       :src="newsData[2].image" alt="">
                </div>
                <div class="desc-block">
                  <div class="name">{{ newsData[2].content.ru.title }}</div>
                  <div class="category">{{ getCategory(newsData[2]) }}</div>
                </div>
              </Link>
              <Link :href="'/news/' + newsData[3].id" v-if="getExists(3)" class="item">
                <div class="min-w-[114px]">
                  <img class=".img object-cover object w-[114px] h-[92px] rounded-xl"
                       :src="newsData[3].image" alt="">
                </div>
                <div class="desc-block">
                  <div class="name">{{ newsData[3].content.ru.title }}</div>
                  <div class="category">{{ getCategory(newsData[3]) }}</div>
                </div>
              </Link>
            </div>
          </div>
          <div class="h-[35px]"></div>
          <Link :href="'/news/' + newsData[4].id" v-if="getExists(4)" class="news7-abs pc-fade">
            <div class="video relative mt-10">
              <img class="object-cover absolute top-0 w-[150px] h-[120px] rounded-xl"
                   :src="newsData[4].image" alt="">
              <div class="abs-video relative">
                <div class="button-watch">
                  <svg width="11" height="17" viewBox="0 0 11 17" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.680192 0.856674L10.2328 8.18968L0.680192 15.5221L0.680191 8.18939L0.680192 0.856674Z"
                      stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="desc-block mt-10">
              <div class="name">{{ newsData[4].content.ru.title }}</div>
              <div class="link">
                <span>Смотреть видео</span>
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.14453 0.809875L5.1401 4.80544L1.14453 8.80101" stroke="#F55902"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <template class="sm:hidden">
        <div class="news-row-one">
          <Link :href="'/news/' + newsData[5].id" v-if="getExists(5)" class="item" href="#">
            <img class="img mob-fade object-cover pt-0" :src="newsData[5].image" alt="">
            <div class="flex-text">
              <div class="name">{{ newsData[5].content.ru.title }}</div>
              <div class="category mob-fade">RPG</div>
            </div>
          </Link>
          <Link :href="'/news/' + newsData[6].id" v-if="getExists(6)" class="item" href="#">
            <img class="img mob-fade object-cover pt-0" :src="newsData[6].image" alt="">
            <div class="flex-text">
              <div class="name">{{ newsData[6].content.ru.title }}</div>
              <div class="category mob-fade">RPG</div>
            </div>
          </Link>
          <Link :href="'/news/' + newsData[7].id" v-if="getExists(7)" class="item" href="#">
            <img class="img mob-fade object-cover pt-0" :src="newsData[7].image" alt="">
            <div class="flex-text">
              <div class="name">{{ newsData[7].content.ru.title }}</div>
              <div class="category mob-fade">RPG</div>
            </div>
          </Link>
          <Link :href="'/news/' + newsData[8].id" v-if="getExists(8)" class="item" href="#">
            <img class="img mob-fade object-cover pt-0" :src="newsData[8].image" alt="">
            <div class="flex-text">
              <div class="name">{{ newsData[8].content.ru.title }}</div>
              <div class="category mob-fade">RPG</div>
            </div>
          </Link>
          <Link :href="'/news/' + newsData[9].id" v-if="getExists(9)" class="item" href="#">
            <img class="img mob-fade object-cover pt-0" :src="newsData[9].image" alt="">
            <div class="flex-text">
              <div class="name">{{ newsData[9].content.ru.title }}</div>
              <div class="category mob-fade">RPG</div>
            </div>
          </Link>
        </div>
      </template>
    </div>
    <div class="new6-abs hidden sm:flex flex-col">
      <div v-if="mobileShowAll" class="flex flex-wrap mt-[25px] px-4 justify-between gap-4">
        <template v-for="(lNews, index) in news">
          <Link
            :href="'/news/' + lNews.id"
            v-if="index <= 3"
          >
            <div class="w-[155px]">
              <img class="w-[155px] h-[155px] object-cover rounded-[30px]" :src="lNews.image" alt="">
              <p class="text-[14px] mt-[10px]">{{ lNews.content.ru.title }}</p>
              <span class="opacity-60">{{ getCategory(lNews) }}</span>
            </div>
          </Link>
        </template>
      </div>
      <div class="flex-tree-news pl-4">
        <template v-for="(lNews, index) in news">
          <Link
            :href="'/news/' + lNews.id"
            class="item"
            v-if="(index <= 2 && !mobileShowAll) || (index >= 1 && mobileShowAll)"
          >
            <div class="min-w-[114px]">
              <img class="object-cover object w-[114px] h-[92px] rounded-xl"
                   :src="lNews.image" alt="">
            </div>
            <div class="desc-block">
              <div class="name">{{ lNews.content.ru.title }}</div>
              <div class="category">{{ getCategory(newsData[1]) }}</div>
            </div>
          </Link>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import {defineComponent} from 'vue'
import {Link} from "@inertiajs/vue3";

export default defineComponent({
  name: "NewsBlock",
  props: ['news', 'positions', 'categories', 'showAllNewsLink', 'mobileShowAll'],
  components: {Link},
  data() {
    return {
      showAllNewsLinkLocal: this.getStateShowAllNewsLink(this.showAllNewsLink),
      newsData: this.getNewsData(this.news, this.positions),
    }
  },
  methods: {
    getData(number, type) {
      number--;

      const positions = JSON.parse(this.positions);
      const idNews = positions[number];
      let news = this.news.filter(news => news.id === idNews);
      news = news[0];

      if (type === 'exists') {
        return typeof news !== 'undefined';
      }
      if (type === 'id') {
        if (typeof news !== 'undefined') {
          return news.id;
        }

      }
      if (type === 'image') {
        return news.image;
      }
      if (type === 'title') {
        return news.content.ru.title;
      }
      if (type === 'category') {
        const data = this.categories.filter(cat => cat.id === parseInt(news.categories[0]));
        return data[0].title_ru;
      }
    },
    getNewsData(news) {
      const positions = JSON.parse(this.positions);
      return news.filter(news => !positions.find(position => position === news.id));
    },
    getCategory(news) {
      const data = this.categories.filter(cat => cat.id === parseInt(news.categories[0]));
      return data[0].title_ru;
    },
    getExists(id) {
      return typeof this.newsData[id] !== 'undefined';
    },
    getStateShowAllNewsLink(data) {
      if (typeof data !== 'undefined') {
        return data;
      }
      return false;
    }

  }

})
</script>
