<script setup>
import ReferalPopUp from "./referalPopUp.vue";
import {ref} from "vue";

const props = defineProps(['type'])

let showStateModal = ref(false);

</script>
<template>
  <button @click.prevent="showStateModal = true" v-if="type === 2"
    class="bg-white md:py-[8px] text-black hover:opacity-80 rounded-[12px] text-[16px] py-[12px] px-[24px] transition-all">
    Подробнее
  </button>
  <a v-else @click.prevent="showStateModal = true" href="#" class="button-last">Подробнее</a>
  <ReferalPopUp :showStateModal="showStateModal" @close="() => {showStateModal = false}"/>
</template>
