<script setup>
import ReferalButton from "../referalButton.vue";

const props = defineProps(['money']);
</script>

<template>
  <div class="w-full flex justify-between sm:flex-col gap-y-[11px]">
    <div class="w-[452px] 2xl:w-[400px] md:w-[200px] md:h-[150px] sm:w-full bg-c_gray rounded-[20px] py-[20px] px-[30px] flex flex-col">
      <p class="text-[#AAAAAA] text-[20px] md:text-[16px]">Баланс кошелька</p>
      <p class="text-white text-[46px] font-[600] md:text-[18px]">{{ money }} ₽</p>
      <div class="mt-[19px]">
        <button
          class="bg-c_orange text-white hover:opacity-80 rounded-[12px] text-[16px] md:py-[8px] py-[12px] px-[24px] transition-all">
          Пополнить
        </button>
      </div>
    </div>
    <div class="relative 2xl:w-[400px] md:w-[200px] md:h-[150px] sm:w-full group w-[452px] rounded-[20px] overflow-hidden">
      <img class="relative transition-all group-hover:scale-105 object-cover h-full w-full"
           src="../../../image/Profile/profile-baner-2.png" alt="">
      <div class="absolute top-0 py-[20px] px-[30px] flex flex-col justify-between h-full">
        <p class="text-white text-[20px] font-[700] md:text-[14px]">
          Приглашайте друзей <br class="md:hidden">
          и получайте бонусы
        </p>
        <div>
          <ReferalButton :type="2" />
        </div>
      </div>
    </div>
    <div class="relative 2xl:w-[400px] md:w-[200px] md:h-[150px] sm:w-full group w-[452px] rounded-[20px] overflow-hidden">
      <img class="relative group-hover:scale-105 transition-all object-cover h-full w-full filter grayscale"
           src="../../../image/Profile/profile-baner-3.png" alt="">
      <div class="absolute top-0 py-[20px] px-[30px] flex flex-col justify-between h-full">
        <p class="text-white text-[20px] font-[700] md:text-[14px]">
          Эксклюзивный<br class="md:hidden">
          контент для сообщества
        </p>
        <div>
          <button
            class="bg-white md:py-[8px] text-black hover:opacity-80 rounded-[12px] text-[16px] py-[12px] px-[24px] transition-all">
            Подробнее
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
