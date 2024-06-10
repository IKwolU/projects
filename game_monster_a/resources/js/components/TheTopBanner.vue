<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Pagination} from 'swiper/modules';
import {ref} from "vue";

const modules = [Pagination];
const PaginationSettings = {
  el: '[data-slider-dots]',
  dynamicBullets: true,
  bulletClass: "swiper-pagination",
}
let mobile = ref(false);
const resize = () => {
  window.screen.availWidth < 639 ? mobile.value = true : mobile.value = false;
}


window.addEventListener("resize", () => resize());


</script>
<template>
  <div class="container-banner" v-show="!mobile">
    <div class="left-banner pc-fade">
      <img src="../../image/Main/banner1.png" alt="" class="abs-img">
      <div class="banner-text">Страшные скидки в честь открытия</div>
    </div>
    <div class="right-banner">
      <div class="right-container-slider"><a href="#" class="item">
        <svg class="pc_fade" width="901" height="523" viewBox="0 0 901 523" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <image href="../../image/Main/banner_2.png" width="100%" clip-path="url(#top_banner_2)"></image>
        </svg>
        <div class="banner-text">Witcher 3: Wild Hunt</div>
        <div class="banner-price">
          <div class="low-price">790₽<span>-38%</span></div>
          <div class="normal-price">1550 ₽</div>
        </div>
      </a></div>
    </div>
  </div>

  <div class="container-banner" v-show="mobile">
    <swiper
      :pagination="PaginationSettings"
      :modules="modules"
      class="mySwiper hidden sm:block"
    >
      <swiper-slide v-for="index in 10">
        <div class="right-banner">
          <div class="right-container-slider">
            <a href="#" class="item">
              <img
                src="../../image/Main/banner_2.png"
                class="img-mob mob-fade absolute top-[-190px] object-fit"
                alt=""
              />
              <div class="h-[200px]"></div>
              <div class="banner-text">Witcher 3: Wild Hunt 123</div>
              <div class="banner-price">
                <div class="low-price">790₽<span>-38%</span></div>
                <div class="normal-price">1550 ₽</div>
              </div>
            </a>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
  <div class="swiper-pagination" data-slider-dots></div>
</template>
