<script setup>
import Layout from "../components/layouts/layout.vue";
import {Head} from "@inertiajs/vue3";
</script>

<template>
  <Layout>
    <Head :title="'О нас'"/>
    <main class="about">
      <div class="about__inner">
        <p class="about-inner__title">О нас</p>
        <div class="about-img__inner">
          <div class="about-inner__first">
            <div class="about-inner__information-block">
              <img src="../../image/image/cyberpunk.png" alt="" class="about__first-img">
              <div class="about-information__text left">
                <p class="about-information__title right-text">На одной волне</p>
                <p class="about-information__subtitle right-text">Мы сами геймеры, так что продавать игры для нас не
                  только бизнес, но и большое удовольствие.</p>
              </div>
            </div>
            <div class="about-inner__information-block">
              <img src="../../image/image/gen-mask.png" alt="" class="about__second-mask">
              <img src="../../image/image/gen.png" alt="" class="about__second-img">
              <div class="about-information__text right">
                <p class="about-information__title left-text">Любимая работа</p>
                <p class="about-information__subtitle left-text">У нас нет секрета успеха, нам просто в кайф заниматься тем, чем мы занимаемся и развиваться так, как развиваемся.</p>
              </div>
            </div>
          </div>

          <div class="about-inner__second">
            <div class="about-inner__information-block">
              <img src="../../image/image/robot.png" alt="" class="about__third-img">
              <div class="about-information__text left">
                <p class="about-information__title right-text">На одной волне</p>
                <p class="about-information__subtitle right-text">Мы сами геймеры, так что продавать игры для нас не только бизнес, но и большое удовольствие.</p>
              </div>
            </div>
            <div class="about-inner__information-block">
              <img src="../../image/image/monster-mask.png" alt="" class="about__fouth-mask">
              <img src="../../image/image/monster.png" alt="" class="about__fouth-img">
              <div class="about-information__form" style="gap: 14px">
                <div class="about-form__title">Связаться с нами</div>
                <input
                  placeholder="E-mail"
                  type="text"
                  class="w-[264px] sm:w-full bg-c_gray placeholder-[#FFFFFFB2] p-[18px] text-[14px] rounded-[10px]"
                >
                <textarea
                  class="w-[264px] sm:w-full h-[150px] bg-c_gray placeholder-[#FFFFFFB2] p-[18px] text-[14px] rounded-[10px]"
                ></textarea>
                <button class="px-[34px] sm:w-full hover:opacity-70 py-[21px] bg-c_orange self-start text-[14px] rounded-[10px]">Отправить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </Layout>
</template>
