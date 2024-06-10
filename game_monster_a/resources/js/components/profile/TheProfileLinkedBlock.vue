<script setup>
const props = defineProps(['user', 'social']);
const emit = defineEmits(['deleteSocial']);
</script>

<template>
  <div class="flex items-center gap-[16px]">
    <div class="flex gap-[10px] bg-[#2C2C2C] w-[274px] items-center rounded-[6px] p-[16px]">
      <div class="w-[30px] flex justify-center">
        <img v-if="social.socialId === 'steam'" src="../../../image/icons/steam.svg" alt="">
        <img v-else-if="social.socialId === 'vk'" src="../../../image/icons/vkontakte.svg" alt="">
        <img v-else-if="social.socialId === 'google'" src="../../../image/icons/google.svg" alt="">
        <img v-else src="../../../image/icons/facebook.svg" alt="">
      </div>
      <p v-if="user[social.socialId] !== null" class="text-[16px] text-[#A3A3A3]">{{ user[social.socialId] }}</p>
      <p v-else class="text-[16px] text-[#A3A3A3]">{{ social.socialName }}</p>
    </div>
    <svg @click="emit('deleteSocial',social.socialId)" v-if="user[social.socialId] !== null" class="cursor-pointer" width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M16.0301 2.04309C16.4975 1.5757 16.4975 0.817924 16.0301 0.350539C15.5627 -0.116846 14.8049 -0.116846 14.3375 0.350539L7.94837 6.73969L2.1095 0.900818C1.64211 0.433433 0.88433 0.433433 0.416945 0.900818C-0.0504401 1.3682 -0.0504398 2.12598 0.416945 2.59337L6.25582 8.43224L0.417381 14.2707C-0.0500044 14.7381 -0.0500044 15.4958 0.41738 15.9632C0.884765 16.4306 1.64255 16.4306 2.10993 15.9632L7.94837 10.1248L14.3371 16.5135C14.8045 16.9809 15.5622 16.9809 16.0296 16.5135C16.497 16.0461 16.497 15.2883 16.0296 14.821L9.64092 8.43224L16.0301 2.04309Z"
            fill="white" fill-opacity="0.12"/>
    </svg>
  </div>
</template>

<style scoped>

</style>
