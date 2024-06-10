<script setup>
import Layout from "../components/layouts/layout.vue";
import {Head, Link} from '@inertiajs/vue3';
</script>

<template>
  <Head :title="'Страница не найдена'"/>
  <Layout class="h-[100vh] max-w-[1440px] w-full mx-auto">
    <div class="h-full flex flex-col gap-[38px] sm:px-4">
      <img class="absolute top-0 sm:right-0 sm:scale-[3] sm:top-[200px] right-[-200px] z-[10]" src="../../image/404image.png" alt="">
      <h1
        class="relative z-[21] sm:text-[62px] sm:leading-[60px] sm:mt-[50px] text-[102px] font-Rubik bg-clip-text text-transparent max-w-[561px] w-full font-[900] leading-[101px] bg-gradient-to-b from-white to-gray-700"
      >
        Похоже, такой страницы нет
      </h1>
      <Link
        href="/"
        class="relative z-[21] bg-c_orange self-start text-[16px] hover:opacity-70 rounded-[10px] py-[24px] px-[34px]"
      >
        Вернуться на главную
      </Link>

    </div>
  </Layout>
</template>
