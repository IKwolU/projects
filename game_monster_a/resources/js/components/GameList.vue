<script setup>
import {Link} from "@inertiajs/vue3";
import Price from "./price.vue";

const props = defineProps(['games','showAllGamesLink']);
</script>

<template>
  <section class="catalog-main">
    <div class="container">
      <div class="first-line-catalog-main">
        <div class="title-catalog-main">Каталог игр</div>
        <Link v-if="showAllGamesLink" class="text-c_orange hover:underline" href="/games/">Все игры</Link>
      </div>
      <div class="grid-catalog gap-[28px]" style="justify-content: start">

        <div v-for="game in games" class="item">
          <Link :href="`/game/${game.id}`" class="image-item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 339 258">
              <image :href="game.image" width="100%" clip-path="url(#catalog_bg)"></image>
            </svg>
            <div class="price-item">
              <div class="low-price">
                <price :price="game.lowPrice"/>
              </div>
              <div v-if="game.lowPrice !== game.avgPrice" class="normal-price">
                <price :price="game.avgPrice"/>
              </div>
            </div>
          </Link>
          <div class="fist-line-catalog-item">
            <div class="name-game">{{game.name.title_ru}}</div>
<!--            <div class="platforms">-->
<!--              <img src="../../image/Catalog/platforms/steam.svg" alt="../../image/Catalog/platforms/steam.svg">-->
<!--              <img src="../../image/Catalog/platforms/steam.svg" alt="../../image/Catalog/platforms/steam.svg">-->
<!--            </div>-->
          </div>
<!--          <div class="catalog-category">-->
<!--            <div class="item-category">RPG</div>-->
<!--            <div class="item-category">RPG</div>-->
<!--          </div>-->
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
