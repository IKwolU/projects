<script setup>
import Layout from "../components/layouts/layout.vue";
import {Head, router} from '@inertiajs/vue3';
import NewsBlock from "../components/news/NewsBlock.vue";
import IndexClip from "../components/pageClips/indexClip.vue";
import {reactive, ref} from "vue";
import GameList from "../components/GameList.vue";
import TheTopBanner from "../components/TheTopBanner.vue";
import ReferalButton from "../components/referalButton.vue";

const props = defineProps(['positions', 'news', 'categories', 'games']);
let form = reactive({
  email: ref(''),
})

let positionsData = ref(props.positions);
let newsData = ref(props.news);
let categoriesData = ref(props.categories)

let mobile = ref(false);
const resize = () => {
  window.screen.availWidth < 639 ? mobile.value = true : mobile.value = false;
}

function subscription() {
  router.post('/subscription', {'email': form.email}, {
    preserveState: (page) => Object.keys(page.props.errors).length
  })
}

window.addEventListener("resize", () => resize());

</script>

<template>
  <Layout>
    <Head title="Главная страница"/>
    <teleport to="body">
      <IndexClip/>
    </teleport>
    <main>
      <div class="top-banner-main">
        <div class="relative" :class="mobile ? 'w-full' : 'container'">
          <TheTopBanner/>
          <ul class="right-dots pc-fade">
            <li>
              <svg width="100" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <image xlink:href="../../image/Main/banner_3.png" width="100%"
                       clip-path="url(#top_banner_slide_dot)"></image>
              </svg>
            </li>
            <li>
              <svg width="100" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <image xlink:href="../../image/Main/banner_3.png" width="100%"
                       clip-path="url(#top_banner_slide_dot)"></image>
              </svg>
            </li>
            <li>
              <svg width="100" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <image xlink:href="../../image/Main/banner_3.png" width="100%"
                       clip-path="url(#top_banner_slide_dot)"></image>
              </svg>
            </li>
            <li>
              <svg width="100" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <image xlink:href="../../image/Main/banner_3.png" width="100%"
                       clip-path="url(#top_banner_slide_dot)"></image>
              </svg>
            </li>
            <li>
              <svg width="100" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <image xlink:href="../../image/Main/banner_3.png" width="100%"
                       clip-path="url(#top_banner_slide_dot)"></image>
              </svg>
            </li>
          </ul>
          <ul class="right-dots-mobile mob-fade">
            <li></li>
            <li></li>
            <li class="active"></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
      <section class="luck-main sm:pb-[70px]">
        <div class="container flex flex-col gap-[74px] ">
          <!-- Лучшие товары -->
          <div class="flex flex-col gap-9">
            <h2 class="text-white font-bold text-[38px]">Лучшие товары</h2>
            <div class="flex gap-4">
              <div class="flex flex-col gap-4 max-w-[348px]">
                <img
                  src="https://i.pinimg.com/736x/ec/ba/d0/ecbad08d06d1bc59038e2b0fb36fd999.jpg"
                  class="max-w-full rounded-[29px]"
                />

                <div class="flex flex-col gap-4 px-5">
                  <div class="flex flex-col gap-[14px]">
                    <div class="flex items-end gap-3">
                      <p class="text-white text-[26px] font-semibold">1 999 ₽</p>
                      <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                      <p class="text-[#F59502]">-35%</p>
                    </div>
                    <p class="text-[18px] text-white">
                      OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                    </p>
                  </div>
                  <div class="flex gap-3">
                    <img
                      width="48"
                      height="48"
                      src="https://i.pinimg.com/564x/94/05/5f/94055f0a5b69b2443c75b6f961019a8e.jpg"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex flex-col gap-1">
                      <p class="text-white">TopSeller21930</p>
                      <div class="flex gap-4">
                        <div class="flex items-center gap-1">
                          <svg
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                              fill="#EA9241"
                            />
                          </svg>
                          <span class="text-[#CECECE] text-[14px]">512</span>
                        </div>
                        <span class="text-[#939393] text-[14px]">3 года</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-4 max-w-[348px]">
                <img
                  src="https://i.pinimg.com/736x/ec/ba/d0/ecbad08d06d1bc59038e2b0fb36fd999.jpg"
                  class="max-w-full rounded-[29px]"
                />

                <div class="flex flex-col gap-4 px-5">
                  <div class="flex flex-col gap-[14px]">
                    <div class="flex items-end gap-3">
                      <p class="text-white text-[26px] font-semibold">1 999 ₽</p>
                      <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                      <p class="text-[#F59502]">-35%</p>
                    </div>
                    <p class="text-[18px] text-white">
                      OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                    </p>
                  </div>
                  <div class="flex gap-3">
                    <img
                      width="48"
                      height="48"
                      src="https://i.pinimg.com/564x/94/05/5f/94055f0a5b69b2443c75b6f961019a8e.jpg"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex flex-col gap-1">
                      <p class="text-white">TopSeller21930</p>
                      <div class="flex gap-4">
                        <div class="flex items-center gap-1">
                          <svg
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                              fill="#EA9241"
                            />
                          </svg>
                          <span class="text-[#CECECE] text-[14px]">512</span>
                        </div>
                        <span class="text-[#939393] text-[14px]">3 года</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-4 max-w-[348px]">
                <img
                  src="https://i.pinimg.com/736x/ec/ba/d0/ecbad08d06d1bc59038e2b0fb36fd999.jpg"
                  class="max-w-full rounded-[29px]"
                />

                <div class="flex flex-col gap-4 px-5">
                  <div class="flex flex-col gap-[14px]">
                    <div class="flex items-end gap-3">
                      <p class="text-white text-[26px] font-semibold">1 999 ₽</p>
                      <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                      <p class="text-[#F59502]">-35%</p>
                    </div>
                    <p class="text-[18px] text-white">
                      OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                    </p>
                  </div>
                  <div class="flex gap-3">
                    <img
                      width="48"
                      height="48"
                      src="https://i.pinimg.com/564x/94/05/5f/94055f0a5b69b2443c75b6f961019a8e.jpg"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex flex-col gap-1">
                      <p class="text-white">TopSeller21930</p>
                      <div class="flex gap-4">
                        <div class="flex items-center gap-1">
                          <svg
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                              fill="#EA9241"
                            />
                          </svg>
                          <span class="text-[#CECECE] text-[14px]">512</span>
                        </div>
                        <span class="text-[#939393] text-[14px]">3 года</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-4 max-w-[348px]">
                <img
                  src="https://i.pinimg.com/736x/ec/ba/d0/ecbad08d06d1bc59038e2b0fb36fd999.jpg"
                  class="max-w-full rounded-[29px]"
                />

                <div class="flex flex-col gap-4 px-5">
                  <div class="flex flex-col gap-[14px]">
                    <div class="flex items-end gap-3">
                      <p class="text-white text-[26px] font-semibold">1 999 ₽</p>
                      <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                      <p class="text-[#F59502]">-35%</p>
                    </div>
                    <p class="text-[18px] text-white">
                      OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                    </p>
                  </div>
                  <div class="flex gap-3">
                    <img
                      width="48"
                      height="48"
                      src="https://i.pinimg.com/564x/94/05/5f/94055f0a5b69b2443c75b6f961019a8e.jpg"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex flex-col gap-1">
                      <p class="text-white">TopSeller21930</p>
                      <div class="flex gap-4">
                        <div class="flex items-center gap-1">
                          <svg
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                              fill="#EA9241"
                            />
                          </svg>
                          <span class="text-[#CECECE] text-[14px]">512</span>
                        </div>
                        <span class="text-[#939393] text-[14px]">3 года</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Лучшие товары -->

          <!-- Рекомендуем/Каталог -->
          <div class="flex flex-col gap-9">
            <div class="flex items-end gap-7">
              <h2 class="text-white font-bold text-[38px]">Рекомендуем</h2>
              <p class="text-[18px] text-[#F59502] leading-[40px] font-bold">
                Все товары
              </p>
            </div>
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-2">
                <p class="text-[#7B7B7B]">Цена</p>
              </div>
              <div class="col-span-7">
                <p class="text-[#7B7B7B]">Название</p>
              </div>
              <div class="col-span-3">
                <p class="text-[#7B7B7B]">Продавец</p>
              </div>

              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
              <div class="flex flex-col gap-[2px] col-span-2">
                <p class="text-white text-[20px] font-semibold">1 999 ₽</p>
                <div class="flex gap-3">
                  <p class="text-[#AAAAAA] font-light line-through">3 499₽</p>
                  <p class="text-[#F59502]">-35%</p>
                </div>
              </div>
              <div class="col-span-7">
                <p class="text-[20px] text-white">
                  OVERLORD | REALLYWORLD | НЕ ПРИВЯЗАН | БЕЗ БАНА И МУТА
                </p>
              </div>
              <div class="col-span-3">
                <div class="flex gap-3">
                  <img
                    width="48"
                    height="48"
                    src="https://placehold.co/600x400"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex flex-col gap-1">
                    <p class="text-white">TopSeller21930</p>
                    <div class="flex gap-4">
                      <div class="flex items-center gap-1">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.54894 1.42705C8.8483 0.50574 10.1517 0.50574 10.4511 1.42705L11.8574 5.75532C11.9913 6.16734 12.3752 6.4463 12.8085 6.4463H17.3595C18.3282 6.4463 18.731 7.68592 17.9473 8.25532L14.2654 10.9303C13.9149 11.185 13.7683 11.6364 13.9021 12.0484L15.3085 16.3766C15.6078 17.298 14.5533 18.0641 13.7696 17.4947L10.0878 14.8197C9.7373 14.565 9.2627 14.565 8.91221 14.8197L5.23037 17.4947C4.44665 18.0641 3.39217 17.298 3.69153 16.3766L5.09787 12.0484C5.23174 11.6364 5.08508 11.185 4.7346 10.9303L1.05275 8.25532C0.269035 7.68592 0.67181 6.4463 1.64053 6.4463H6.19155C6.62477 6.4463 7.00873 6.16734 7.1426 5.75532L8.54894 1.42705Z"
                            fill="#EA9241"
                          />
                        </svg>
                        <span class="text-[#CECECE] text-[14px]">512</span>
                      </div>
                      <span class="text-[#939393] text-[14px]">3 года</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-span-12 border border-white/[.15]"/>
            </div>
          </div>
          <!-- Рекомендуем/Каталог -->

          <!-- Популярные игры -->
          <div class="flex flex-col gap-9">
            <div class="flex items-end gap-7">
              <h2 class="text-white font-bold text-[38px]">Популярные игры</h2>
              <p class="text-[18px] text-[#F59502] leading-[40px] font-bold">
                Все игры
              </p>
            </div>
            <div class="grid grid-cols-5 gap-9 h-[372px]">
              <div class="relative">
                <img
                  src="https://i.pinimg.com/564x/c2/d2/08/c2d208bf2c74fc820b2488be79c8aee7.jpg"
                  class="h-full basis-full rounded-[16px] object-cover"
                />
                <div
                  class="absolute inset-0 rounded-[16px] bg-black/[.7] flex justify-center items-center opacity-0 hover:opacity-100 transition"
                >
                  <ol
                    class="flex items-center flex-col gap-7 text-white text-[24px] font-semibold"
                  >
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Аккаунты
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Предметы
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Услуги
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Золото
                    </li>
                  </ol>
                </div>
              </div>
              <div class="relative">
                <img
                  src="https://i.pinimg.com/564x/c2/d2/08/c2d208bf2c74fc820b2488be79c8aee7.jpg"
                  class="h-full basis-full rounded-[16px] object-cover"
                />
                <div
                  class="absolute inset-0 rounded-[16px] bg-black/[.7] flex justify-center items-center opacity-0 hover:opacity-100 transition"
                >
                  <ol
                    class="flex items-center flex-col gap-7 text-white text-[24px] font-semibold"
                  >
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Аккаунты
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Предметы
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Услуги
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Золото
                    </li>
                  </ol>
                </div>
              </div>
              <div class="relative">
                <img
                  src="https://i.pinimg.com/564x/c2/d2/08/c2d208bf2c74fc820b2488be79c8aee7.jpg"
                  class="h-full basis-full rounded-[16px] object-cover"
                />
                <div
                  class="absolute inset-0 rounded-[16px] bg-black/[.7] flex justify-center items-center opacity-0 hover:opacity-100 transition"
                >
                  <ol
                    class="flex items-center flex-col gap-7 text-white text-[24px] font-semibold"
                  >
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Аккаунты
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Предметы
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Услуги
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Золото
                    </li>
                  </ol>
                </div>
              </div>
              <div class="relative">
                <img
                  src="https://i.pinimg.com/564x/c2/d2/08/c2d208bf2c74fc820b2488be79c8aee7.jpg"
                  class="h-full basis-full rounded-[16px] object-cover"
                />
                <div
                  class="absolute inset-0 rounded-[16px] bg-black/[.7] flex justify-center items-center opacity-0 hover:opacity-100 transition"
                >
                  <ol
                    class="flex items-center flex-col gap-7 text-white text-[24px] font-semibold"
                  >
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Аккаунты
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Предметы
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Услуги
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Золото
                    </li>
                  </ol>
                </div>
              </div>
              <div class="relative">
                <img
                  src="https://i.pinimg.com/564x/c2/d2/08/c2d208bf2c74fc820b2488be79c8aee7.jpg"
                  class="h-full basis-full rounded-[16px] object-cover"
                />
                <div
                  class="absolute inset-0 rounded-[16px] bg-black/[.7] flex justify-center items-center opacity-0 hover:opacity-100 transition"
                >
                  <ol
                    class="flex items-center flex-col gap-7 text-white text-[24px] font-semibold"
                  >
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Аккаунты
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Предметы
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Услуги
                    </li>
                    <li class="transition cursor-pointer hover:text-[#F59502]">
                      Золото
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <!-- Популярные игры -->
        </div>
        <!--        <div class="container">-->
        <!--          <div class="lick-title-main">Испытай удачу</div>-->
        <!--          <div class="luck-flex-main">-->
        <!--            <a href="#" class="item">-->
        <!--              <img src="../../image/Roulete/roulete1.png" alt="" class="abs-img1">-->
        <!--              <div class="left-price">-->
        <!--                <div class="item-price"><strong>800</strong> игр</div>-->
        <!--                <div class="item-price"><strong>профит</strong> 130%</div>-->
        <!--                <div class="item-price">игры от <strong>$ 900</strong></div>-->
        <!--              </div>-->
        <!--              <div class="name-luck-block"-->
        <!--                   style="background-image: linear-gradient(to bottom, #ff511a 0%, rgba(0, 0, 0, 0) 100%);">EPIC-->
        <!--              </div>-->
        <!--              <div class="bottom-price">-->
        <!--                <div class="item-true">800$</div>-->
        <!--                <div class="no-item">800$</div>-->
        <!--              </div>-->
        <!--            </a>-->
        <!--            <a href="#" class="item">-->
        <!--              <img src="../../image/Roulete/roulete2.png" alt="" class="abs-img2">-->
        <!--              <div class="left-price">-->
        <!--                <div class="item-price"><strong>800</strong> игр</div>-->
        <!--                <div class="item-price"><strong>профит</strong> 130%</div>-->
        <!--                <div class="item-price">игры от <strong>$ 900</strong></div>-->
        <!--              </div>-->
        <!--              <div class="name-luck-block"-->
        <!--                   style="background-image: linear-gradient(to bottom, #1a5aff 0%, rgba(0, 0, 0, 0) 100%);">COMMON-->
        <!--              </div>-->
        <!--              <div class="bottom-price">-->
        <!--                <div class="item-true">800$</div>-->
        <!--                <div class="no-item">800$</div>-->
        <!--              </div>-->
        <!--            </a>-->
        <!--            <a href="#" class="item">-->
        <!--              <img src="../../image/Roulete/roulete3.png" alt="" class="abs-img3">-->
        <!--              <div class="left-price">-->
        <!--                <div class="item-price"><strong>800</strong> игр</div>-->
        <!--                <div class="item-price"><strong>профит</strong> 130%</div>-->
        <!--                <div class="item-price">игры от <strong>$ 900</strong></div>-->
        <!--              </div>-->
        <!--              <div class="name-luck-block"-->
        <!--                   style="background-image: linear-gradient(to bottom, #ff431a 0%, rgba(0, 0, 0, 0) 100%);">LEGEND-->
        <!--              </div>-->
        <!--              <div class="bottom-price">-->
        <!--                <div class="item-true">800$</div>-->
        <!--                <div class="no-item">800$</div>-->
        <!--              </div>-->
        <!--            </a>-->
        <!--          </div>+- -->
        <!--        </div>-->
      </section>

<!--            <GameList :showAllGamesLink="true" :games="games"/>-->
      <NewsBlock :categories="categoriesData" :news="newsData" :positions="positionsData" showAllNewsLink="true"/>

      <section class="last-sect-main">
        <div class="container">
          <div class="container-last-sect-main">
            <div class="abs-last-1">
              <img src="../../image/Main/abs-img1.png" alt="" class="abs-img pc-fade">
              <img src="../../image/Main/abs-img1_mob.png" alt="" class="abs-img mob-fade">
              <div class="content-last">
                <div class="title-last">Система рефералов</div>
                <div class="desc-last pc-fade">Приглашайте друзей и получайте бонусы</div>
                <div class="desc-last mob-fade">За каждого приведенного участника Вы получите 500р на счет единоразово,и
                  20% от покупок реферала на протяжение 3-х месяцев
                </div>
                <ReferalButton/>
              </div>
            </div>
            <div class="abs-last-2">
              <img src="../../image/Main/abs-img2.png" alt="" class="abs-img pc-fade">
              <img src="../../image/Main/abs-img2_mob.png" alt="" class="abs-img mob-fade">
              <div class="content-last">
                <div class="title-last">Уникальные
                  скидки
                  и бонусы
                </div>
                <div class="desc-last">При подписке на новости сервиса</div>
                <form @submit.prevent="subscription()" method="post" class="form-subscribe">
                  <input type="text" v-model="form.email" placeholder="e-mail" name="email">
                  <button type="submit">Подписаться</button>
                </form>
              </div>
            </div>
            <div class="abs-last-3">
              <img src="../../image/Main/abs-img3.png" alt="" class="abs-img pc-fade">
              <img src="../../image/Main/abs-img3_mob.png" alt="" class="abs-img mob-fade">
              <div class="content-last">
                <div class="title-last">Остались вопросы?</div>
                <form action="" class="form-qeustions pc-fade">
                  <button>Подписаться</button>
                  <div class="b1">
                    <input type="text" placeholder="e-mail">
                    <textarea name="" id="" cols="30" rows="10" placeholder="Сообщение"></textarea>
                  </div>
                </form>
                <form action="" class="form-qeustions mob-fade">
                  <textarea name="" cols="30" rows="10" placeholder="Сообщение"></textarea>
                  <div class="b1">
                    <input type="text" placeholder="e-mail">
                    <button>Отправить</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </Layout>
</template>

<style scoped>

</style>
