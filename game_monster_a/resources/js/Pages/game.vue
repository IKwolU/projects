<script setup>
import Layout from "../components/layouts/layout.vue";
import {Head, Link} from '@inertiajs/vue3';
import {onMounted, ref} from "vue";
import UserAvatar from "../components/userAvatar.vue";
import RegisterDate from "../components/registerDate.vue";
import Price from "../components/price.vue";


const props = defineProps(['products', 'game']);
let windowWeight = ref(window.screen.width);

let podCategoryID = ref(null)

let products = ref();

onMounted(() => {
  addEventListener("resize", (event) => {
    windowWeight.value = window.screen.width;
  });
  getProduct();
});

let typeSort = ref(null);
let selectCategoryId = ref(null);
const sort = () => {
  switch (typeSort.value) {
    case 1:
      products.value.sort((a, b) => {
        if (a.price > b.price) {
          return 1;
        }
        if (a.price < b.price) {
          return -1;
        }
      })
      break;
    case 0:
      products.value.sort((a, b) => {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }
      })
      break;
  }
}
const getProduct = () => {
  if (selectCategoryId.value === null) {
    products.value = props.products;
  } else {
    products.value = props.products.filter(product => product.category === selectCategoryId.value);
    if (podCategoryID.value !== null) {
      products.value = products.value.filter(product => product.podCategory === podCategoryID.value);
    }
  }
}
</script>
<template>
  <Layout>
    <Head :title="game.name.title_ru"/>
    <main class="game max-w-[1440px] mx-auto">
      <div class="game__inner">
        <svg v-if="windowWeight >= 768" width="1441" preserveAspectRatio="none" height="269" viewBox="0 0 1441 269"
             fill="none" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <mask id="mask0_4124_31554" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1441"
                height="269">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M188.053 0C202.965 0 215.053 12.0883 215.053 27C215.053 41.9117 227.141 54 242.053 54H316.779C333.347 54 346.779 67.4315 346.779 84V239C346.779 255.569 333.347 269 316.779 269H159.226C144.314 269 132.226 256.912 132.226 242C132.226 227.088 120.137 215 105.226 215H30.5C13.9314 215 0.5 201.569 0.5 185V30C0.5 13.4315 13.9315 0 30.5 0H188.053ZM556.286 0C571.198 0 583.286 12.0883 583.286 27C583.286 41.9117 595.374 54 610.286 54H685.011C701.58 54 715.011 67.4315 715.011 84V239C715.011 255.569 701.58 269 685.011 269H527.458C512.547 269 500.458 256.912 500.458 242C500.458 227.088 488.37 215 473.458 215H398.733C382.164 215 368.733 201.569 368.733 185V30C368.733 13.4315 382.164 0 398.733 0H556.286ZM951.519 27C951.519 12.0883 939.43 0 924.519 0H766.966C750.397 0 736.966 13.4315 736.966 30V185C736.966 201.569 750.397 215 766.966 215H841.691C856.603 215 868.691 227.088 868.691 242C868.691 256.912 880.78 269 895.691 269H1053.24C1069.81 269 1083.24 255.569 1083.24 239V84C1083.24 67.4315 1069.81 54 1053.24 54H978.519C963.607 54 951.519 41.9117 951.519 27ZM1281.77 0C1296.69 0 1308.77 12.0883 1308.77 27C1308.77 41.9117 1320.86 54 1335.77 54H1410.5C1427.07 54 1440.5 67.4315 1440.5 84V239C1440.5 255.569 1427.07 269 1410.5 269H1252.95C1238.04 269 1225.95 256.912 1225.95 242C1225.95 227.088 1213.86 215 1198.95 215H1124.22C1107.65 215 1094.22 201.569 1094.22 185V30C1094.22 13.4315 1107.65 0 1124.22 0H1281.77Z"
                  fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_4124_31554)">
            <rect x="3.49414" y="-62" width="1437.01" height="346" rx="20" fill="#D9D9D9"/>
            <rect x="3.49414" y="-62" width="1437.01" height="346" rx="20" fill="url(#pattern0)"/>
          </g>
          <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_4124_31554" transform="matrix(0.000520833 0 0 0.00216311 0 -0.653631)"/>
            </pattern>
            <image :href="game.longImage" id="image0_4124_31554" width="140%"/>
          </defs>
        </svg>

        <svg v-if="windowWeight < 768 && windowWeight > 400" class="w-full" viewBox="0 0 713 177" fill="none"
             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <mask id="mask0_4124_31724" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="713"
                height="177">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M141.5 18C141.5 8.05888 133.441 0 123.5 0H20.5C9.45431 0 0.5 8.95431 0.5 20V121C0.5 132.046 9.4543 141 20.5 141H69.5C79.4411 141 87.5 149.059 87.5 159C87.5 168.941 95.5589 177 105.5 177H208.5C219.546 177 228.5 168.046 228.5 157V56C228.5 44.9543 219.546 36 208.5 36H159.5C149.559 36 141.5 27.9411 141.5 18ZM383.5 18C383.5 8.05888 375.441 0 365.5 0H262.5C251.454 0 242.5 8.95431 242.5 20V121C242.5 132.046 251.454 141 262.5 141H311.5C321.441 141 329.5 149.059 329.5 159C329.5 168.941 337.559 177 347.5 177H450.5C461.546 177 470.5 168.046 470.5 157V56C470.5 44.9543 461.546 36 450.5 36H401.5C391.559 36 383.5 27.9411 383.5 18ZM607.5 0C617.441 0 625.5 8.05888 625.5 18C625.5 27.9411 633.559 36 643.5 36H692.5C703.546 36 712.5 44.9543 712.5 56V157C712.5 168.046 703.546 177 692.5 177H589.5C579.559 177 571.5 168.941 571.5 159C571.5 149.059 563.441 141 553.5 141H504.5C493.454 141 484.5 132.046 484.5 121V20C484.5 8.95431 493.454 0 504.5 0H607.5Z"
                  fill="#D9D9D9"/>
            ё
          </mask>
          <g mask="url(#mask0_4124_31724)">
            <rect x="1.5" y="3" width="711" height="171" rx="9.89039" fill="#D9D9D9"/>
            <rect x="1.5" y="3" width="711" height="171" rx="9.89039" fill="url(#pattern0)"/>
          </g>
          <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_4124_31724" transform="matrix(0.000520833 0 0 0.00216311 0 -0.653631)"/>
            </pattern>
            <image :href="game.longImage" id="image0_4124_31724" width="300%"/>
          </defs>
        </svg>

        <svg v-if="windowWeight <= 400" width="328" height="124" viewBox="0 0 328 124" fill="none"
             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <mask id="mask0_62_1488" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="328"
                height="124">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M87 0C93.6274 0 99 5.37258 99 12V13C99 19.6274 104.373 25 111 25H147C153.627 25 159 30.3726 159 37V112C159 118.627 153.627 124 147 124H72C65.3726 124 60 118.627 60 112V111C60 104.373 54.6274 99 48 99H12C5.37258 99 0 93.6274 0 87V12C0 5.37258 5.37258 0 12 0H87ZM256 0C262.627 0 268 5.37258 268 12V13C268 19.6274 273.373 25 280 25H316C322.627 25 328 30.3726 328 37V112C328 118.627 322.627 124 316 124H241C234.373 124 229 118.627 229 112V111C229 104.373 223.627 99 217 99H181C174.373 99 169 93.6274 169 87V12C169 5.37258 174.373 0 181 0H256Z"
                  fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_62_1488)">
            <rect y="1" width="328" height="122" rx="6.93595" fill="#D9D9D9"/>
            <rect y="1" width="328" height="122" rx="6.93595" fill="url(#pattern0)"/>
          </g>
          <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_62_1488" transform="matrix(0.000787691 0 0 0.00212698 0 -0.642711)"/>
            </pattern>
            <image :href="game.longImage" id="image0_62_1488" width="400%"/>
          </defs>
        </svg>


        <div class="game-inner__main">

          <div class="game-inner__navigation">
            <div class="navigation__title">{{ game.name.title_ru }}</div>
            <div class="navigation__list">
              <p @click="selectCategoryId = null; getProduct()"
                 class="navigation-list__item cursor-pointer"
                 :class="{'underline' : selectCategoryId === null}"
              >
                Все
              </p>
              <p
                  v-for="(category, index) in game.categories"
                  @click="selectCategoryId = index; getProduct(); podCategoryID = null"
                  class="navigation-list__item cursor-pointer"
                  :class="{'underline' : selectCategoryId === index}"
              >
                {{ category.name[0] }}
              </p>
            </div>
            <div class="navigation__btns">
              <div class="navigation-btns__selectc flex gap-4">
                <!--                  <select class="game-select" name="all-games" id="">-->
                <!--                    <option class="game-option" value="">Все игры</option>-->
                <!--                  </select>-->
                <!--                  <select class="game-select" name="all-games" id="">-->
                <!--                    <option class="game-option" value="">Операционная система</option>-->
                <!--                  </select>-->
                <select v-model="typeSort" @change="sort()" class="game-select" name="all-games" id="">
                  <option class="game-option" :value="null">Сортировка по цене</option>
                  <option class="game-option" :value="0">От большей к меньшей</option>
                  <option class="game-option" :value="1">От меньшей к большей</option>
                </select>
                <select @change="getProduct()" v-model="podCategoryID" v-if="selectCategoryId !== null"
                        class="game-select" name="all-games" id="">
                  <option class="game-option" :value="null">Подкатегория</option>
                  <option v-for="(podCategory, lIndex) in game.categories[selectCategoryId].podCategories"
                          class="game-option" :value="lIndex">{{ podCategory[0] }}
                  </option>
                </select>
              </div>
              <label for="search" class="relative">
                <input
                    class="bg-[#222222] w-[339px] rounded-[9px] py-[17px] px-[23px] placeholder-[#757575]"
                    type="text"
                    id="search"
                    placeholder="Поиск">
                <img src="../../image/icons/search_org.png" alt="" class="search-org">
              </label>
            </div>
          </div>

          <div class="game-inner__information">
            <table>
              <thead>
              <tr class="">
                <th class="infoline-item text-left pb-[20px]">Цены</th>
                <th class="infoline-item text-left pl-[53px] pb-[20px]">Количество</th>
                <th>
                  <div class="flex items-center pl-[53px] pb-[20px]">
                    <p class="infoline-item text-left mr-[6px]">Название</p>
                    <div class="filters">
                      <button>
                        <img src="../../image/icons/Polygon1.svg" alt="">
                      </button>
                      <button>
                        <img src="../../image/icons/Polygon2.svg" alt="">
                      </button>
                    </div>
                  </div>
                </th>
                <th class="infoline-item text-left pb-[20px]">Продавец</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="product in products" class="border-b-[1px] border-gray-700">
                <td class="info-price__actual pb-[48px] pt-[24p] whitespace-nowrap">
                  <price :price="product.price" />
                </td>
                <td class="pl-[53px] pb-[48px] pt-[24p]">{{ product.count }}</td>

                <td class="game-info__name flex-1 pl-[53px] pb-[48px] pt-[24px]">
                  <Link :href="`/product/${product.id}`">
                    {{ product.name }}
                  </Link>
                </td>
                <td>
                  <div class="seller__information w-[310px] pt-[24p]">
                    <div>
                      <UserAvatar class="w-[48px] min-h-[48px]" :user="product.user"/>
                    </div>
                    <div class="seller__info">
                      <div class="seller-info__name">{{ product.user.login }}</div>
                      <div class="seller-info__state">
                        <div class="state__rate">
                          <img src="../../image/icons/Star.svg" alt="">
                          0
                        </div>
                        <div class="state__year">
                          <RegisterDate :date="product.user.created_at"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
      <div class="button-game">
        <button>Показать еще</button>
      </div>
    </main>
  </Layout>
</template>


<style scoped>
</style>
