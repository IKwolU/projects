<script setup>
import Layout from "../../components/layouts/layout.vue";
import {Head, Link} from "@inertiajs/vue3";
import {ref} from "vue";
import TheProfileTopBanners from "../../components/profile/TheProfileTopBanners.vue";
import TheProfileTransactions from "../../components/profile/TheProfileTransactions.vue";
import TheProfileMenuElements from "../../components/profile/TheProfileMenuElements.vue";
import TheProfileProducts from "../../components/profile/TheProfileProducts.vue";
import TheProfileDisputes from "../../components/profile/TheProfileDisputes.vue";
import TheProfileSettings from "../../components/profile/TheProfileSettings.vue";

const props = defineProps(['user', 'products']);

let selectPage = ref(0);

const pages = [
  {
    name: "Транзакции"
  },
  {
    name: "Мои товары"
  },
  {
    name: "Споры"
  },
  {
    name: "Настройки"
  }
];
</script>

<template>
  <Head title="Личный кабинет"/>
  <Layout>
    <main class="max-w-[1440px] w-full mx-auto flex flex-col 2xl:px-[36px] md:px-[20px]">
      <h1 class="text-white font-Rubik text-[36px] font-[700] mb-[36px]">Личный кабинет</h1>

      <TheProfileTopBanners :money="user.money" />

      <div class="mt-[48px] flex flex-col mb-[36px] sm:w-full">
        <ul class="flex gap-[28px] sm:gap-[15px]">
          <TheProfileMenuElements
            v-for="(page, index) in pages"
            :pageId="index"
            :pageName="page.name"
            :pageCurrentId="selectPage"
            @selectPage="(n) => {selectPage = n}"
          />
        </ul>
        <div class="h-[2px] bg-white opacity-20 mt-[16px] sm:w-full"></div>
      </div>

      <TheProfileTransactions v-if="selectPage === 0" />
      <TheProfileProducts :products="products" v-else-if="selectPage === 1" />
      <TheProfileDisputes v-else-if="selectPage === 2" />
      <TheProfileSettings :user="user" v-else />
    </main>
  </Layout>
</template>

